
const products = {
  1: { name: "Netflix Premium", price: 15 },
  2: { name: "Spotify Premium", price: 8 },
  3: { name: "Discord Nitro", price: 16 },
  4: { name: "Max HBO", price: 5 },
  5: { name: "Contas Premium", price: 10 },
  6: { name: "YouTube Premium", price: 8 },
};

export async function POST(request) {
  try {
    const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!token) {
      return Response.json(
        { error: "Token do Mercado Pago não configurado." },
        { status: 500 }
      );
    }

    const body = await request.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return Response.json(
        { error: "Carrinho vazio." },
        { status: 400 }
      );
    }

    const items = body.items.map((item) => {
      const product = products[item.id];
      const quantity = Number(item.quantity);

      if (
        !product ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      ) {
        throw new Error("Produto ou quantidade inválida.");
      }

      return {
        id: String(item.id),
        title: product.name,
        quantity,
        currency_id: "BRL",
        unit_price: product.price,
      };
    });

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Mercado Pago:", data);
      return Response.json(
        { error: "Não foi possível criar o pagamento." },
        { status: 502 }
      );
    }

    return Response.json({
      paymentUrl: data.sandbox_init_point || data.init_point,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message || "Erro interno." },
      { status: 500 }
    );
  }
}
