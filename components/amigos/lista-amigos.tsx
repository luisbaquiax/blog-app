"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserMinus, UserPlus } from "lucide-react"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export function ListaAmigos() {
  const [amigos, setAmigos] = useState<any[]>([])
  const [todosUsuarios, setTodosUsuarios] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    fetchAmigos()
    fetchTodosUsuarios()
  }, [])

  const fetchAmigos = async () => {
    if (!user) return

    try {
      const response = await api.listarAmigos(user.id_usuario)
      setAmigos(response.data || [])
    } catch (error) {
      console.error("Error al cargar amigos:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTodosUsuarios = async () => {
    try {
      const response = await api.getUsersWithPersona()
      const usuarios = response.data || []
      // Filtrar usuarios que no sean el usuario actual
      const usuariosFiltrados = usuarios.filter((u: any) => u.id_usuario !== user?.id_usuario)
      setTodosUsuarios(usuariosFiltrados)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
    }
  }

  const handleEliminarAmigo = async (id_usuario1: number, id_usuario2: number) => {
    if (!user) return

    try {
      await api.eliminarAmigo(id_usuario1, id_usuario2)
      fetchAmigos()
    } catch (error) {
      console.error("Error al eliminar amigo:", error)
    }
  }

  const handleAgregarAmigo = async (id_usuario2: number) => {
    if (!user) return

    try {
      await api.agregarAmigo(user.id_usuario, id_usuario2)
      alert("Solicitud de amistad enviada")
      fetchTodosUsuarios()
    } catch (error: any) {
      console.error("Error al agregar amigo:", error)
      alert(error.response?.data?.message || "Error al enviar solicitud")
    }
  }

  const usuariosFiltrados = todosUsuarios.filter((usuario) => {
    const persona = usuario.Persona || usuario.persona
    const nombreCompleto = `${persona?.nombre} ${persona?.apellido}`.toLowerCase()
    const nombreUsuario = usuario.nombre_usuario.toLowerCase()
    return nombreCompleto.includes(busqueda.toLowerCase()) || nombreUsuario.includes(busqueda.toLowerCase())
  })

  // Filtrar usuarios que ya son amigos
  const idsAmigos = new Set(amigos.flatMap((amistad) => [amistad.id_usuario1, amistad.id_usuario2]))
  const usuariosNoAmigos = usuariosFiltrados.filter((u) => !idsAmigos.has(u.id_usuario))

  if (loading) {
    return <div className="text-center py-4">Cargando...</div>
  }

  return (
    <Tabs defaultValue="amigos" className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="amigos">Mis Amigos</TabsTrigger>
        <TabsTrigger value="buscar">Buscar Personas</TabsTrigger>
      </TabsList>

      <TabsContent value="amigos" className="space-y-4">
        {amigos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tienes amigos agregados</p>
        ) : (
          amigos.map((amistad) => {
            const amigo = amistad.id_usuario1 === user?.id_usuario ? amistad.Receptor : amistad.Solicitante
            const persona = amigo?.Persona || amigo?.persona

            return (
              <div
                key={amistad.id_usuario1 + "-" + amistad.id_usuario2}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{amigo?.nombre_usuario?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {persona?.nombre} {persona?.apellido}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{amigo?.nombre_usuario} • {amigo?.tipo_usuario}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEliminarAmigo(amistad.id_usuario1, amistad.id_usuario2)}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              </div>
            )
          })
        )}
      </TabsContent>

      <TabsContent value="buscar" className="space-y-4">
        <Input
          placeholder="Buscar por nombre o usuario..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {usuariosNoAmigos.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {busqueda ? "No se encontraron usuarios" : "No hay más usuarios disponibles"}
          </p>
        ) : (
          usuariosNoAmigos.map((usuario) => {
            const persona = usuario.Persona || usuario.persona

            return (
              <div key={usuario.id_usuario} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{usuario.nombre_usuario[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {persona?.nombre} {persona?.apellido}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{usuario.nombre_usuario} • {usuario.tipo_usuario}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleAgregarAmigo(usuario.id_usuario)}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            )
          })
        )}
      </TabsContent>
    </Tabs>
  )
}
