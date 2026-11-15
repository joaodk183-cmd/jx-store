
"use client";

import { useState } from "react";
import {
  ShoppingCart, X, Plus, Minus, Trash2,
  ShieldCheck, Zap, Headphones
} from "lucide-react";

const products = [
  { id: 1, name: "Netflix Premium", category: "Streaming", price: 15, icon: "🎬" },
  { id: 2, name: "Spotify Premium", category: "Streaming", price: 8, icon: "🎵" },
  { id: 3, name: "Discord Nitro", category: "Impulsos", price: 16, icon: "💜" },
  { id: 4, name: "Max HBO", category: "Streaming", price: 5, icon: "🎥" },
  { id: 5, name: "Contas Premium", category: "Contas", price: 10, icon: "👑" },
  { id: 6, name: "YouTube Premium", category: "Streaming", price: 8, icon: "▶️" },
];

const money = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function Home() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("Todos");
  const [openCart, setOpenCart] = useState(false);
  const [loading, setLoading] = useState(false);

  function addProduct(product) {
    setCart((old) => {
      const found = old.find((item) => item.id === product.id);

      if (found) {
        return old.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...old, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id, amount) {
    setCart((old) =>
      old
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeProduct(id) {
    setCart((old) => old.filter((item) => item.id !== id));
  }

  async function checkout() {
    if (cart.length === 0 || loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const texto = await response.text();

      let data;

      try {
        data = JSON.parse(texto);
      } catch {
        throw new Error(
          `O servidor respondeu com erro HTTP ${response.status}. Verifique a configuração da API.`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || "Não foi possível criar o pagamento.");
      }

      if (!data.paymentUrl) {
        throw new Error("O Mercado Pago não retornou o link de pagamento.");
      }

      window.location.href = data.paymentUrl;
    } catch (error) {
      alert(error.message || "Erro ao iniciar pagamento.");
      setLoading(false);
    }
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const quantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const filteredProducts =
    category === "Todos"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <main className="min-h-screen bg-[#09070e] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09070e]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="text-2xl font-black tracking-tight">
            JX <span className="text-purple-500">STORE</span>
          </a>

          <button
            onClick={() => setOpenCart(true)}
            className="relative rounded-xl border border-purple-500/40 p-3 hover:bg-purple-600/20"
          >
            <ShoppingCart size={22} />
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-xs">
              {quantity}
            </span>
          </button>
        </div>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-5 text-xs font-bold uppercase tracking-[5px] text-purple-400">
          Bem-vindo à JX Store
        </span>

        <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
          O melhor do digital
          <br />
          está aqui<span className="text-purple-500">.</span>
        </h1>

        <p className="mt-6 max-w-lg text-sm text-gray-400">
          Produtos digitais com qualidade, rapidez e segurança.
        </p>

        <a
          href="#produtos"
          className="mt-8 rounded-xl bg-purple-600 px-8 py-4 text-sm font-bold transition hover:bg-purple-500"
        >
          EXPLORAR PRODUTOS
        </a>
      </section>

      <section id="produtos" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
            Nosso catálogo
          </span>
          <h2 className="mt-2 text-3xl font-black">Produtos em destaque</h2>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {["Todos", "Streaming", "Impulsos", "Contas"].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                category === item
                  ? "bg-purple-600 text-white"
                  : "border border-white/10 bg-white/5 text-gray-400 hover:border-purple-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-white/10 bg-[#120e1b] p-6 transition hover:-translate-y-1 hover:border-purple-500/60"
            >
              <div className="mb-6 flex h-24 items-center justify-center rounded-xl bg-purple-500/10 text-5xl">
                {product.icon}
              </div>

              <span className="text-xs font-semibold uppercase text-purple-400">
                {product.category}
              </span>

              <h3 className="mt-2 text-xl font-bold">{product.name}</h3>

              <div className="mt-5 flex items-center justify-between">
                <strong className="text-2xl text-white">
                  {money(product.price)}
                </strong>

                <button
                  onClick={() => addProduct(product)}
                  className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold hover:bg-purple-500"
                >
                  Adicionar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#100b18] px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="text-purple-400" size={30} />
            <strong>Compra segura</strong>
            <span className="text-sm text-gray-400">Mais tranquilidade na compra</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Zap className="text-purple-400" size={30} />
            <strong>Agilidade</strong>
            <span className="text-sm text-gray-400">Atendimento rápido</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Headphones className="text-purple-400" size={30} />
            <strong>Suporte</strong>
            <span className="text-sm text-gray-400">Estamos aqui para ajudar</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-gray-500">
        © 2026 JX Store. Todos os direitos reservados.
      </footer>

      {openCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70">
          <div className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#100b18] p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <h2 className="text-2xl font-black">Meu carrinho</h2>
              <button onClick={() => setOpenCart(false)}>
                <X size={25} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5">
              {cart.length === 0 ? (
                <p className="py-12 text-center text-gray-400">
                  Seu carrinho está vazio.
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="mb-5 border-b border-white/10 pb-5">
                    <div className="flex justify-between gap-3">
                      <div>
                        <strong>{item.name}</strong>
                        <p className="mt-1 text-sm text-purple-400">
                          {money(item.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeProduct(item.id)}
                        className="text-red-400"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        className="rounded-lg border border-white/10 p-2"
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        className="rounded-lg border border-white/10 p-2"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="mb-5 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-purple-400">{money(total)}</span>
              </div>

              <button
                disabled={cart.length === 0 || loading}
                onClick={checkout}
                className="w-full rounded-xl bg-purple-600 py-4 font-bold hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "GERANDO PAGAMENTO..." : "CONTINUAR PARA PAGAMENTO"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Pagamento processado pelo Mercado Pago.
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
