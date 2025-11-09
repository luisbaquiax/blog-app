"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Publicacion {
  id_publicacion: number
  titulo: string
  contenido: string
  tipo_publicacion: string
  estado: string
  visibilidad: string
  fecha_publicacion: string
  orientacion_politica?: string
  PublicacionFotos?: Array<{
    url_foto: string
    descripcion: string
  }>
}

export default function MisPublicacionesPage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    cargarMisPublicaciones()
  }, [])

  const cargarMisPublicaciones = async () => {
    try {
      const response = await api.getMisPublicaciones(user!.id_usuario)
      setPublicaciones(response.data.data || [])
    } catch (error) {
      console.error("Error al cargar mis publicaciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar tus publicaciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "APROBADO":
        return "default"
      case "PENDIENTE":
        return "secondary"
      case "RECHAZADO":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Cargando tus publicaciones...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Publicaciones</h1>
        <Button asChild>
          <Link href="/publicaciones/crear">Crear Nueva Publicación</Link>
        </Button>
      </div>

      {publicaciones.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center">
            <p className="mb-4 text-lg text-muted-foreground">No tienes publicaciones aún</p>
            <Button asChild>
              <Link href="/publicaciones/crear">Crear tu primera publicación</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {publicaciones.map((publicacion) => (
            <Card key={publicacion.id_publicacion}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <h2 className="text-xl font-bold">{publicacion.titulo}</h2>
                      <Badge variant={getEstadoBadgeVariant(publicacion.estado)}>{publicacion.estado}</Badge>
                      <Badge variant="outline">{publicacion.tipo_publicacion}</Badge>
                      <Badge variant="secondary">{publicacion.visibilidad}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Publicado el {new Date(publicacion.fecha_publicacion).toLocaleDateString("es-ES")}
                    </p>
                    {publicacion.orientacion_politica && (
                      <p className="text-sm text-muted-foreground">
                        Orientación política: {publicacion.orientacion_politica}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/mis-publicaciones/editar/${publicacion.id_publicacion}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground line-clamp-3">{publicacion.contenido}</p>

                {publicacion.PublicacionFotos && publicacion.PublicacionFotos.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    <span>{publicacion.PublicacionFotos.length} foto(s) adjunta(s)</span>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/publicaciones/${publicacion.id_publicacion}`}>Ver completa</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
