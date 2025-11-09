"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenSquare } from "lucide-react"
import Link from "next/link"
import { FeedPublicaciones } from "@/components/publicaciones/feed-publicaciones"
import { getUserFromStorage } from "@/lib/auth"
import { api } from "@/lib/api"

export default function PublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    fetchPublicaciones()
  }, [])

  const fetchPublicaciones = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await api.getPublicacionesVisibles(user.id_usuario)
      setPublicaciones(response.data.data || [])
    } catch (error) {
      console.error("Error al cargar publicaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Todas las Publicaciones</h1>
          <p className="text-muted-foreground">Explora todas las publicaciones visibles para ti</p>
        </div>
        <Button asChild>
          <Link href="/publicaciones/crear">
            <PenSquare className="h-4 w-4 mr-2" />
            Nueva Publicación
          </Link>
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Cargando publicaciones...</p>
          </CardContent>
        </Card>
      ) : (
        <FeedPublicaciones publicaciones={publicaciones} />
      )}
    </div>
  )
}
