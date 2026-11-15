
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
      return Response.json(
        { error: "Configurações do Mercado Pago ausentes." },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const dataId = url.searchParams.get("data.id");
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    if (!dataId || !xSignature || !xRequestId) {
      return Response.json(
        { error: "Dados da notificação incompletos." },
        { status: 400 }
      );
    }

    const parts = Object.fromEntries(
      xSignature.split(",").map((part) => {
        const [key, value] = part.trim().split("=");
        return [key, value];
      })
    );

    const ts = parts.ts;
    const receivedHash = parts.v1;

    if (!ts || !receivedHash) {
      return Response.json(
        { error: "Assinatura inválida." },
        { status: 401 }
      );
    }

    const manifest =
      `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(manifest)
      .digest("hex");

    const receivedBuffer = Buffer.from(receivedHash, "hex");
    const expectedBuffer = Buffer.from(expectedHash, "hex");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return Response.json(
        { error: "Assinatura não autorizada." },
        { status: 401 }
      );
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!paymentResponse.ok) {
      return Response.json(
        { error: "Não foi possível consultar o pagamento." },
        { status: 502 }
      );
    }

    const payment = await paymentResponse.json();

    if (payment.status === "approved") {
      console.log("Pagamento aprovado:", payment.id);
    } else {
      console.log("Status do pagamento:", payment.status);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);

    return Response.json(
      { error: "Erro interno no webhook." },
      { status: 500 }
    );
  }
}
