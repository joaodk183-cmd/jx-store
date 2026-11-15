
import "./globals.css";

export const metadata = {
  title: "JX Store | Loja Digital",
  description: "Produtos digitais com qualidade, rapidez e segurança."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
