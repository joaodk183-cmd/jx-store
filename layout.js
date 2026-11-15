
import "./globals.css";

export const metadata = {
  title: "JX Store | Loja Digital",
  description: "Sua loja de produtos digitais com qualidade e segurança."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
