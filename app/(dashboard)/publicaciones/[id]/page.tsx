"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ComentariosSection } from "@/components/comentarios/comentarios-section"
import { LikeButton } from "@/components/publicaciones/like-button"
import axiosInstance from "@/lib/axios"
import type { Publicacion } from "@/types"

export default function PublicacionDetailPage() {
  const params = useParams()
  const [publicacion, setPublicacion] = useState<Publicacion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublicacion = async () => {
      try {
        const response = await axiosInstance.get(`/publicaciones/${params.id}`)
        setPublicacion(response.data)
      } catch (error) {
        console.error("Error al cargar publicación:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublicacion()
  }, [params.id])

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!publicacion) {
    return <div>Publicación no encontrada</div>
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
                {publicacion.orientacion_politica && (
                  <Badge variant="outline">{publicacion.orientacion_politica}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(publicacion.fecha_publicacion!).toLocaleDateString()}
              </p>
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
            <LikeButton
              publicacionId={publicacion.id_publicacion}
              initialLikes={publicacion.likes_count || 0}
              initialHasLiked={publicacion.has_liked || false}
            />
          </div>
        </CardContent>
      </Card>

      <ComentariosSection publicacionId={publicacion.id_publicacion} />
    </div>
  )
}
