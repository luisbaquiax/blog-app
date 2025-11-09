"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { FileText, Check, X } from "lucide-react"

export default function AprobacionesAdminPage() {
  const [publicacionesPendientes, setPublicacionesPendientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [orientaciones, setOrientaciones] = useState<{ [key: number]: string }>({})
  const user = getUserFromStorage()

  useEffect(() => {
    if (user?.tipo_usuario === "ADMINISTRADOR") {
      fetchPublicacionesPendientes()
    }
  }, [])

  const fetchPublicacionesPendientes = async () => {
    try {
      // Obtener todas las publicaciones públicas y filtrar las pendientes
      const response = await api.getPublicacionesPublicas()
      const pubs = response.data.data || []
      const pendientes = pubs.filter((p: any) => p.estado === "PENDIENTE" && p.tipo_publicacion === "NOTICIA")
      setPublicacionesPendientes(pendientes)
    } catch (error) {
      console.error("Error al cargar publicaciones pendientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAprobar = async (id_publicacion: number) => {
    const orientacion = orientaciones[id_publicacion]

    if (!orientacion) {
      alert("Por favor selecciona una orientación política")
      return
    }

    try {
      // Primero actualizar la orientación política
      await api.actualizarPublicacion(id_publicacion, {
        orientacion_politica: orientacion,
      })

      // Luego cambiar el estado a APROBADO
      await api.cambiarEstadoPublicacion(id_publicacion, "APROBADO")

      alert("Noticia aprobada correctamente")
      fetchPublicacionesPendientes()
    } catch (error) {
      console.error("Error al aprobar publicación:", error)
      alert("Error al aprobar la publicación")
    }
  }

  const handleRechazar = async (id_publicacion: number) => {
    try {
      await api.cambiarEstadoPublicacion(id_publicacion, "RECHAZADO")
      alert("Noticia rechazada")
      fetchPublicacionesPendientes()
    } catch (error) {
      console.error("Error al rechazar publicación:", error)
    }
  }

  if (user?.tipo_usuario !== "ADMINISTRADOR") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-destructive">No tienes permisos para acceder a esta página</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Aprobar Noticias</h1>
          <p className="text-muted-foreground">Revisa y aprueba noticias de periodistas</p>
        </div>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Cargando noticias pendientes...</p>
          </CardContent>
        </Card>
      ) : publicacionesPendientes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay noticias pendientes de aprobación</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {publicacionesPendientes.map((publicacion) => (
            <Card key={publicacion.id_publicacion}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{publicacion.titulo}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Por: @{publicacion.Usuario?.nombre_usuario || publicacion.usuario?.nombre_usuario}
                      {" • "}
                      <Badge variant="outline">PERIODISTA</Badge>
                    </p>
                  </div>
                  <Badge variant="secondary">{publicacion.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm whitespace-pre-wrap line-clamp-4">{publicacion.contenido}</p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="space-y-2">
                    <Label>Orientación Política</Label>
                    <Select
                      value={orientaciones[publicacion.id_publicacion] || ""}
                      onValueChange={(value) =>
                        setOrientaciones({ ...orientaciones, [publicacion.id_publicacion]: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la orientación política" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IZQUIERDA">Izquierda</SelectItem>
                        <SelectItem value="CENTRO">Centro</SelectItem>
                        <SelectItem value="DERECHA">Derecha</SelectItem>
                        <SelectItem value="NEUTRO">Neutro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAprobar(publicacion.id_publicacion)}>
                      <Check className="h-4 w-4 mr-1" />
                      Aprobar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRechazar(publicacion.id_publicacion)}>
                      <X className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
