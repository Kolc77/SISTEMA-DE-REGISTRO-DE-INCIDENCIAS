import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirección del lado del servidor para evitar parpadeos del layout/navbar
  redirect("/login");
}
