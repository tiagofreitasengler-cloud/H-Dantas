"use client";
export default function LogoutButton(){return <button className="sideitem" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});location.href='/';}}>Sair</button>}
