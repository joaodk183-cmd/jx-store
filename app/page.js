
import { ShoppingCart, ShieldCheck, Zap, Headphones } from "lucide-react";

const products = [
  { name: "Netflix Premium", category: "Streaming", price: "15,00", icon: "🎬" },
  { name: "Discord Nitro", category: "Impulsos", price: "16,00", icon: "💜" },
  { name: "Spotify Premium", category: "Streaming", price: "8,00", icon: "🎵" },
  { name: "Contas Premium", category: "Contas", price: "Consultar", icon: "👑" }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#09070e] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-16">
        <h1 className="text-3xl font-black tracking-wider">
          JX<span className="text-purple-500"> STORE</span>
        </h1>
        <button className="rounded-xl border border-purple-500/40 p-3">
          <ShoppingCart size={22} />
        </button>
      </header>

      <section className="px-6 py-24 text-center md:py-32">
        <p className="mb-5 text-sm font-bold tracking-[0.3em] text-purple-400">
          BEM-VINDO À JX STORE
        </p>
        <h2 className="mx-auto max-w-3xl text-5xl font-black md:text-7xl">
          O melhor do digital está aqui<span className="text-purple-500">.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-gray-400">
          Produtos digitais com qualidade, rapidez e segurança.
        </p>
        <a href="#produtos" className="mt-9 inline-block rounded-xl bg-purple-600 px-9 py-4 font-bold transition hover:bg-purple-500">
          EXPLORAR PRODUTOS
        </a>
      </section>

      <section className="px-6 pb-24 md:px-16" id="produtos">
        <div className="mb-10">
          <p className="text-sm font-bold text-purple-400">NOSSO CATÁLOGO</p>
          <h2 className="mt-2 text-3xl font-black">Produtos em destaque</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="rounded-2xl border border-white/10 bg-[#15111e] p-6 transition hover:-translate-y-1 hover:border-purple-500/60">
              <div className="mb-6 flex h-32 items-center justify-center rounded-xl bg-purple-500/10 text-5xl">
                {product.icon}
              </div>
              <p className="text-sm text-purple-400">{product.category}</p>
              <h3 className="mt-2 text-xl font-bold">{product.name}</h3>
              <p className="mt-4 text-lg font-bold">
                {product.price === "Consultar" ? product.price : `R$ ${product.price}`}
              </p>
              <button className="mt-5 w-full rounded-xl bg-purple-600 py-3 font-bold hover:bg-purple-500">
                Comprar
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-white/10 px-6 py-14 md:grid-cols-3 md:px-16">
        <div className="flex items-center gap-4">
          <ShieldCheck className="text-purple-500" size={34} />
          <div><b>Segurança</b><p className="text-sm text-gray-400">Compra protegida</p></div>
        </div>
        <div className="flex items-center gap-4">
          <Zap className="text-purple-500" size={34} />
          <div><b>Agilidade</b><p className="text-sm text-gray-400">Atendimento rápido</p></div>
        </div>
        <div className="flex items-center gap-4">
          <Headphones className="text-purple-500" size={34} />
          <div><b>Suporte</b><p className="text-sm text-gray-400">Estamos aqui para ajudar</p></div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
        © 2026 JX Store. Todos os direitos reservados.
      </footer>
    </main>
  );
}
