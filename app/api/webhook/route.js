
import crypto from "node:crypto";

export async function GET() {
  return Response.json({
    status: "online",
    message: "Webhook da JX Store funcionando."
  });
}

export async function POST(request) {
  try {
    const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!secret || !token) {
      console.error("Webhook: variável de ambiente ausente.");
      return Response.json(
        { error: "Configuração ausente na Vercel." },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const dataId = url.searchParams.get("data.id");
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    if (!xSignature) {
      console.error("Webhook: header x-signature ausente.");
      return Response.json(
        { error: "Assinatura ausente." },
        { status: 401 }
      );
    }

    const parts = {};

    for (const part of xSignature.split(",")) {
      const separator = part.indexOf("=");
      if (separator === -1) continue;

      const key = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      parts[key] = value;
    }

    const ts = parts.ts;
    const receivedHash = parts.v1;

    if (!ts || !receivedHash) {
      console.error("Webhook: assinatura sem ts ou v1.");
      return Response.json(
        { error: "Formato da assinatura inválido." },
        { status: 401 }
      );
    }

    let manifest = "";

    if (dataId) {
      manifest += `id:${dataId};`;
    }

    if (xRequestId) {
      manifest += `request-id:${xRequestId};`;
    }

    manifest += `ts:${ts};`;

    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(manifest)
      .digest("hex");

    const received = Buffer.from(receivedHash, "hex");
    const expected = Buffer.from(expectedHash, "hex");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      console.error("Webhook: assinatura não confere.");
      return Response.json(
        { error: "Assinatura não autorizada." },
        { status: 401 }
      );
    }

    if (!dataId) {
      console.error("Webhook: data.id ausente.");
      return Response.json({ received: true });
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: "no-store"
      }
    );

    if (!paymentResponse.ok) {
      console.error(
        "Webhook: consulta do pagamento falhou. HTTP:",
        paymentResponse.status
      );

      return Response.json(
        { error: "Falha ao consultar pagamento." },
        { status: 502 }
      );
    }

    const payment = await paymentResponse.json();

    console.log("Pagamento recebido:", payment.id);
    console.log("Status:", payment.status);

    return Response.json({ received: true });

  } catch (error) {
    console.error("Erro no webhook:", error.message);

    return Response.json(
      { error: "Erro interno no webhook." },
      { status: 500 }
    );
  }
}
