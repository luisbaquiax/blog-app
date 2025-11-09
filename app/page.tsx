"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Publicacion {
  id_publicacion: number
  titulo: string
  contenido: string
  fecha_publicacion: string
  Usuario: {
    id_usuario: number
    nombre_usuario: string
    tipo_usuario: string
    Persona: {
      nombre: string
      apellido: string
      biografia: string
    }
  }
  likes?: number
}

export default function HomePage() {
  const [publicaciones, setPublicaciones] = useState<Publicacion[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()
  const router = useRouter()

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  const cargarPublicaciones = async () => {
    try {
      const response = await api.getPublicacionesPublicas()
      setPublicaciones(response.data.data || [])
    } catch (error) {
      console.error("Error al cargar publicaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id_publicacion: number) => {
    if (!user) {
      router.push("/login")
      return
    }

    try {
      await api.darLike(user.id_usuario, id_publicacion)
      cargarPublicaciones()
    } catch (error) {
      console.error("Error al dar like:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Blog Social</h1>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Hola, {user.nombre_usuario}</span>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b bg-muted/50 py-12">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">Bienvenido a Blog Social</h2>
            <p className="text-lg text-muted-foreground">
              Descubre noticias, artículos y foros de la comunidad. Únete para participar en las conversaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Publicaciones */}
      <section className="container py-8">
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-6 text-2xl font-bold">Publicaciones Recientes</h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-muted" />
                  <CardContent className="h-32 bg-muted/50" />
                </Card>
              ))}
            </div>
          ) : publicaciones.length === 0 ? (
            <Card>
              <CardContent className="flex min-h-[200px] items-center justify-center">
                <p className="text-muted-foreground">No hay publicaciones disponibles</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {publicaciones.map((pub) => (
                <Card key={pub.id_publicacion} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {pub.Usuario?.Persona?.nombre} {pub.Usuario?.Persona?.apellido}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          @{pub.Usuario?.nombre_usuario} • {pub.Usuario?.tipo_usuario}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(pub.fecha_publicacion).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="mb-2 text-xl font-bold">{pub.titulo}</h3>
                    <p className="text-muted-foreground line-clamp-3">{pub.contenido}</p>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" onClick={() => handleLike(pub.id_publicacion)} disabled={!user}>
                        <Heart className="mr-2 h-4 w-4" />
                        {pub.likes || 0} Me gusta
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (!user) {
                            router.push("/login")
                          } else {
                            router.push(`/publicaciones/${pub.id_publicacion}`)
                          }
                        }}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Comentar
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" disabled={!user}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Blog Social. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
