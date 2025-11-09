"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ComentariosSection } from "@/components/comentarios/comentarios-section"
import { LikeButton } from "@/components/publicaciones/like-button"
import type { Publicacion } from "@/types"
import { api } from "@/lib/api"

export default function PublicacionDetailPage() {
  const params = useParams()
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const response = await api.getPublicacionPorId(Number(params.id))
        setPublicacion(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar publicación:", error)
        setLoading(false)
      }
    }

    fetchPublicacion()
  }, [params.id])

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6">Cargando...</div>
  }

  if (!publicacion) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Publicación no encontrada</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{publicacion.usuario?.nombre_usuario[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{publicacion.usuario?.nombre_usuario}</h3>
                <Badge variant="secondary">{publicacion.tipo_publicacion}</Badge>
                {publicacion.usuario?.tipo_usuario === "PERIODISTA" && <Badge variant="outline">Periodista</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(publicacion.fecha_publicacion!).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {publicacion.usuario?.persona && (
                <p className="text-sm text-muted-foreground mt-1">
                  {publicacion.usuario.persona.nombre} {publicacion.usuario.persona.apellido}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold mb-4">{publicacion.titulo}</h1>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{publicacion.contenido}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <LikeButton publicacionId={publicacion.id_publicacion} initialLikes={0} />
          </div>
        </CardContent>
      </Card>

      <ComentariosSection publicacionId={Number(params.id)} />
    </div>
  )
}
