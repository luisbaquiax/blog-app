"use client"

import { useEffect, useState } from "react"
import { FeedPublicaciones } from "@/components/publicaciones/feed-publicaciones"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Usuario } from "@/types"

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUsuario(JSON.parse(userStr))
    }
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido, {usuario?.nombre_usuario}</CardTitle>
          <CardDescription>Este es tu panel principal donde puedes ver todas las publicaciones</CardDescription>
        </CardHeader>
      </Card>

      <FeedPublicaciones />
    </div>
  )
}
