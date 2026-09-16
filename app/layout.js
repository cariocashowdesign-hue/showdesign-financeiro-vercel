import "./globals.css";
import Nav from "./nav";

export const metadata = {
  title: "Financeiro Show Design",
  description: "Caixa, borderos e recebiveis da Showdesign",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <header className="site">
          <div className="brand-row">
            <div className="brand">
              <span className="mark">SD</span>
              <span className="name">Financeiro Show Design</span>
              <span className="sub">— caixa, borderos e recebiveis</span>
            </div>
          </div>
          <Nav />
        </header>
        <main className="wrap">{children}</main>
        <footer className="site">
          <div className="wrap">
            <span>Financeiro Show Design</span>
            <span className="mono">dados: planilha-ponte (Google Drive + Open Finance)</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
