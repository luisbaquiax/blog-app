"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, MessageCircle, Heart } from "lucide-react"
import { FeedPublicaciones } from "@/components/publicaciones/feed-publicaciones"
import { getUserFromStorage } from "@/lib/auth"
import { api } from "@/lib/api"

export default function TendenciasPage() {
  const [publicaciones, setPublicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPublicaciones: 0,
    totalUsuarios: 0,
    totalComentarios: 0,
    totalLikes: 0,
  })
  const user = getUserFromStorage()

  useEffect(() => {
    fetchPublicacionesTendencia()
  }, [])

  const fetchPublicacionesTendencia = async () => {
    if (!user) return

    try {
      setLoading(true)
      // Por ahora mostramos publicaciones por orientación política como tendencia
      const response = await api.getPublicacionesPorOrientacion(user.id_usuario)
      const pubs = response.data.data || []
      setPublicaciones(pubs)

      // Calcular estadísticas básicas
      setStats({
        totalPublicaciones: pubs.length,
        totalUsuarios: new Set(pubs.map((p: any) => p.id_usuario)).size,
        totalComentarios: pubs.reduce((sum: number, p: any) => sum + (p.total_comentarios || 0), 0),
        totalLikes: pubs.reduce((sum: number, p: any) => sum + (p.total_likes || 0), 0),
      })
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
          Tendencias
        </h1>
        <p className="text-muted-foreground">Descubre las publicaciones más relevantes según tu perfil</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Publicaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalPublicaciones}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalUsuarios}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Comentarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalComentarios}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Me Gusta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{stats.totalLikes}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Cargando tendencias...</p>
          </CardContent>
        </Card>
      ) : (
        <FeedPublicaciones publicaciones={publicaciones} />
      )}
    </div>
  )
}
