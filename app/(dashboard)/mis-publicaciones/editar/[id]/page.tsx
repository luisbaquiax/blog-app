"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function EditarPublicacionPage() {
  const params = useParams()
  const id = params?.id as string

  const [user, setUser] = useState<any>(null)
  const [titulo, setTitulo] = useState("")
  const [contenido, setContenido] = useState("")
  const [visibilidad, setVisibilidad] = useState<"PUBLICO" | "AMIGOS">("PUBLICO")
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const storedUser = getUserFromStorage()
    if (!storedUser) {
      router.push("/login")
    } else {
      setUser(storedUser)
    }
  }, [router])

  useEffect(() => {
    if (!user || !id) return

    const cargarPublicacion = async () => {
      try {
        const response = await api.getPublicacionPorId(Number.parseInt(id))
        const publicacion = response.data.data.publicacion

        if (!publicacion || publicacion.id_usuario !== user.id_usuario) {
          toast({
            title: "Error",
            description: "No tienes permiso para editar esta publicación o no existe.",
            variant: "destructive",
          })
          router.push("/mis-publicaciones")
          return
        }

        setTitulo(publicacion.titulo)
        setContenido(publicacion.contenido)
        setVisibilidad(publicacion.visibilidad as "PUBLICO" | "AMIGOS")
      } catch (error) {
        console.error("Error al cargar publicación:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la publicación",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    cargarPublicacion()
  }, [user, id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.actualizarPublicacion(Number.parseInt(id), {
        titulo,
        contenido,
        visibilidad,
      })

      toast({
        title: "Éxito",
        description: "Publicación actualizada correctamente",
      })

      router.push("/mis-publicaciones")
    } catch (error: any) {
      console.error("Error al actualizar publicación:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al actualizar la publicación",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Mostrar carga inicial
  if (loadingData) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Cargando publicación...</div>
      </div>
    )
  }

  // 🔹 Render principal
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar Publicación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de tu publicación"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido</Label>
              <Textarea
                id="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe tu contenido aquí..."
                rows={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibilidad">Visibilidad</Label>
              <Select
                value={visibilidad}
                onValueChange={(value: "PUBLICO" | "AMIGOS") => setVisibilidad(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la visibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLICO">Público</SelectItem>
                  <SelectItem value="AMIGOS">Solo amigos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/mis-publicaciones")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
