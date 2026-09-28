import "./globals.css";
export const metadata = { title: "ISTE Easwari Student Chapter — The Launch", description: "Official website launch trailer" };
export default function RootLayout({ children }) {
  return (<html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Rajdhani:wght@400;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
  </head><body>{children}</body></html>);
}
