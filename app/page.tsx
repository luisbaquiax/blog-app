"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Publicacion {
  id_publicacion: number
  titulo: string
  contenido: string
  fecha_publicacion: string
  tipo_publicacion: string
  visibilidad: string
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
  PublicacionFotos?: Array<{
    url_foto: string
    descripcion: string
  }>
}

export default function HomePage() {
  const [publicacionesPublicas, setPublicacionesPublicas] = useState<Publicacion[]>([])
  const [publicacionesAmigos, setPublicacionesAmigos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<"publicas" | "amigos">("publicas")
  const user = getUserFromStorage()
  const router = useRouter()

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  const cargarPublicaciones = async () => {
    try {
      const responsePublicas = await api.getPublicacionesPublicas()
      setPublicacionesPublicas(responsePublicas.data.data || [])

      if (user) {
        const responseAmigos = await api.getPublicacionesVisibles(user.id_usuario)
        setPublicacionesAmigos(responseAmigos.data || [])
      }
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

  const renderPublicacion = (pub: any, likesCount?: number) => {
    const publicacion = pub.publicacion || pub
    const likes = likesCount || pub.likes || 0

    return (
      <Card key={publicacion.id_publicacion} className="overflow-hidden">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">
                {publicacion.Usuario?.Persona?.nombre} {publicacion.Usuario?.Persona?.apellido}
              </h4>
              <p className="text-sm text-muted-foreground">
                @{publicacion.Usuario?.nombre_usuario} • {publicacion.Usuario?.tipo_usuario}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(publicacion.fecha_publicacion).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium">
              {publicacion.tipo_publicacion}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="mb-2 text-xl font-bold">{publicacion.titulo}</h3>
          <p className="text-muted-foreground line-clamp-3">{publicacion.contenido}</p>
          {publicacion.PublicacionFotos && publicacion.PublicacionFotos.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {publicacion.PublicacionFotos.slice(0, 2).map((foto: any, idx: number) => (
                <img
                  key={idx}
                  src={foto.url_foto || "/placeholder.svg"}
                  alt={foto.descripcion || "Foto de publicación"}
                  className="h-48 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={() => handleLike(publicacion.id_publicacion)} disabled={!user}>
              <Heart className="mr-2 h-4 w-4" />
              {likes} Me gusta
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!user) {
                  router.push("/login")
                } else {
                  router.push(`/publicaciones/${publicacion.id_publicacion}`)
                }
              }}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Comentar
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            asChild={user ? true : false}
            disabled={!user}
            onClick={() => !user && router.push("/login")}
          >
            <Link href={`/publicaciones/${publicacion.id_publicacion}`}>Ver más</Link>
          </Button>
        </CardFooter>
      </Card>
    )
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
          <h3 className="mb-6 text-2xl font-bold">Publicaciones</h3>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-muted" />
                  <CardContent className="h-32 bg-muted/50" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              {user ? (
                <Tabs defaultValue="publicas" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="publicas">Públicas</TabsTrigger>
                    <TabsTrigger value="amigos">Mis Amigos y Públicas</TabsTrigger>
                  </TabsList>
                  <TabsContent value="publicas" className="space-y-6">
                    {publicacionesPublicas.length === 0 ? (
                      <Card>
                        <CardContent className="flex min-h-[200px] items-center justify-center">
                          <p className="text-muted-foreground">No hay publicaciones disponibles</p>
                        </CardContent>
                      </Card>
                    ) : (
                      publicacionesPublicas.map((pub) => renderPublicacion(pub))
                    )}
                  </TabsContent>
                  <TabsContent value="amigos" className="space-y-6">
                    {publicacionesAmigos.length === 0 ? (
                      <Card>
                        <CardContent className="flex min-h-[200px] items-center justify-center">
                          <p className="text-muted-foreground">No hay publicaciones de amigos disponibles</p>
                        </CardContent>
                      </Card>
                    ) : (
                      publicacionesAmigos.map((item) => renderPublicacion(item.publicacion, item.likes))
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="space-y-6">
                  {publicacionesPublicas.length === 0 ? (
                    <Card>
                      <CardContent className="flex min-h-[200px] items-center justify-center">
                        <p className="text-muted-foreground">No hay publicaciones disponibles</p>
                      </CardContent>
                    </Card>
                  ) : (
                    publicacionesPublicas.map((pub) => renderPublicacion(pub))
                  )}
                </div>
              )}
            </>
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
