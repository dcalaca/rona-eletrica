import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Rona Elétrica & Hidráulica - Materiais de Qualidade",
  description:
    "Rona Elétrica e Hidráulica Ltda - CNPJ: 26.244.711/0001-03. Especializada em materiais elétricos e hidráulicos, instalação, reparos e caminhão muque para instalação de postes. Atendimento de Segunda a Sexta das 07h30 às 17h30, Sábado das 07h30 às 12h00.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
