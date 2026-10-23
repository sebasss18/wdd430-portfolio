// Endpoint de prueba que responde con un mensaje de saludo.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Hello from Next.js API!",
  });
}
