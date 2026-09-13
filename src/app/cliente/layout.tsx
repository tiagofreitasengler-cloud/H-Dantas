import {requireUser}from'@/lib/auth';
export default async function ClienteLayout({children}:{children:React.ReactNode}){await requireUser();return children}
