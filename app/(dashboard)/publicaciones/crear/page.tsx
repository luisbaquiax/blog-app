"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"

export default function CrearPublicacionPage() {
  const [formData, setFormData] = useState({
    tipo_publicacion: "ARTICULO",
    titulo: "",
    contenido: "",
    visibilidad: "PUBLICO",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const user = getUserFromStorage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError("Debes iniciar sesión")
      return
    }

    setLoading(true)
    setError("")

    try {
      await api.crearPublicacion({
        id_usuario: user.id_usuario,
        ...formData,
      })
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al crear publicación:", error)
      setError(error.response?.data?.message || "Error al crear la publicación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Publicación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_publicacion">Tipo de Publicación</Label>
                <Select
                  value={formData.tipo_publicacion}
                  onValueChange={(value) => setFormData({ ...formData, tipo_publicacion: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOTICIA">Noticia</SelectItem>
                    <SelectItem value="ARTICULO">Artículo</SelectItem>
                    <SelectItem value="FORO">Foro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visibilidad">Visibilidad</Label>
                <Select
                  value={formData.visibilidad}
                  onValueChange={(value) => setFormData({ ...formData, visibilidad: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PUBLICO">Público</SelectItem>
                    <SelectItem value="AMIGOS">Solo Amigos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea
                id="contenido"
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                rows={10}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Publicando..." : "Publicar"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
