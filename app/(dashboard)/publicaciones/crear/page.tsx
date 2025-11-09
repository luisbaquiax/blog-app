"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

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

  const tiposPermitidos = () => {
    if (!user) return []

    if (user.tipo_usuario === "PERIODISTA") {
      return ["NOTICIA"] // Solo periodistas crean noticias
    } else if (user.tipo_usuario === "COMUN") {
      return ["ARTICULO", "FORO"] // Usuarios comunes crean artículos y foros
    } else if (user.tipo_usuario === "ADMINISTRADOR") {
      return ["NOTICIA", "ARTICULO", "FORO"] // Admin puede crear todo
    }
    return []
  }

  useEffect(() => {
    // Establecer tipo por defecto según el rol
    const tipos = tiposPermitidos()
    if (tipos.length > 0) {
      setFormData((prev) => ({ ...prev, tipo_publicacion: tipos[0] }))
    }
  }, [])

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

      if (formData.tipo_publicacion === "NOTICIA") {
        alert("Noticia creada. Está pendiente de aprobación por un administrador.")
      }

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Error al crear publicación:", error)
      setError(error.response?.data?.message || "Error al crear la publicación")
    } finally {
      setLoading(false)
    }
  }

  const tipos = tiposPermitidos()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Debes iniciar sesión para crear publicaciones</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Publicación</CardTitle>
          <CardDescription>
            {user.tipo_usuario === "PERIODISTA" &&
              "Como periodista, tus noticias serán revisadas por un administrador antes de publicarse."}
            {user.tipo_usuario === "COMUN" && "Puedes crear artículos y foros que se publicarán inmediatamente."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

            {formData.tipo_publicacion === "NOTICIA" && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Las noticias quedan en estado PENDIENTE hasta que un administrador las apruebe y asigne su orientación
                  política.
                </AlertDescription>
              </Alert>
            )}

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
                    {tipos.includes("NOTICIA") && <SelectItem value="NOTICIA">Noticia</SelectItem>}
                    {tipos.includes("ARTICULO") && <SelectItem value="ARTICULO">Artículo</SelectItem>}
                    {tipos.includes("FORO") && <SelectItem value="FORO">Foro</SelectItem>}
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
