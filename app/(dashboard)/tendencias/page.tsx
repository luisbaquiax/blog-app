"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Eye } from "lucide-react"
import { getUserFromStorage } from "@/lib/auth"
import { api } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

export default function TendenciasPage() {
  const [publicacionesMasLeidas, setPublicacionesMasLeidas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    fetchPublicacionesTendencia()
  }, [])

  const fetchPublicacionesTendencia = async () => {
    try {
      setLoading(true)
      const response = await api.getPublicacionesMasLeidas()
      const masLeidas = response.data.data || []

      const publicacionesConDetalles = masLeidas.map((item: any) => ({
        ...item.Publicacion,
        cantidad_lecturas: item.cantidad_lecturas,
      }))

      setPublicacionesMasLeidas(publicacionesConDetalles)
    } catch (error) {
      console.error("Error al cargar tendencias:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8" />
          Publicaciones en Tendencia
        </h1>
        <p className="text-muted-foreground">Las publicaciones más leídas por la comunidad</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Cargando tendencias...</p>
          </CardContent>
        </Card>
      ) : publicacionesMasLeidas.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No hay publicaciones en tendencia aún</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {publicacionesMasLeidas.map((pub, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{pub.titulo}</h2>
                    <p className="text-muted-foreground line-clamp-2 mb-3">{pub.contenido}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <Badge variant="secondary">{pub.tipo_publicacion}</Badge>
                      {pub.orientacion_politica && <Badge variant="outline">{pub.orientacion_politica}</Badge>}
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {pub.cantidad_lecturas} lecturas
                      </span>
                    </div>
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
