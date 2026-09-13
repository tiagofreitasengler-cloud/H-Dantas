export const BARBER = "Pedro Henrique Dantas";
export const PHONE = "+55 16 99178-1025";
export const WHATSAPP = "5516991781025";
export const ADDRESS = "R. Maj. Claudiano, 2366 – Centro";
export const money = (cents: number) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
