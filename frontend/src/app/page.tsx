// app/page.js
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login"); // redirige automáticamente al cargar localhost:3000
}
