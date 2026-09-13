import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return <html lang="pt-BR"><body>
    <header className="nav"><div className="container navin"><Link href="/" className="brand">H'<span>Dantas</span></Link>
      <nav className="navlinks"><Link href="/#servicos">Serviços</Link><Link href="/#sobre">Sobre</Link><Link href="/#contato">Contato</Link>{session ? <Link href={session.role === "ADMIN" ? "/admin" : "/cliente"}>Minha área</Link> : <Link href="/login">Entrar</Link>}</nav>
      <Link className="btn" href={session ? "/agendar" : "/login"}>{session ? "Agendar" : "Agendar horário"}</Link>
    </div></header>
    {children}
  </body></html>
}
