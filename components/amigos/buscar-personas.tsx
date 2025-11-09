"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { getUserFromStorage } from "@/lib/auth"
import { Search, UserPlus } from "lucide-react"

interface PersonaUsuario {
  id_usuario: number
  nombre_usuario: string
  tipo_usuario: string
  estado: string
  posicion_politica: string
  Persona: {
    id_persona: number
    nombre: string
    apellido: string
    correo: string
    ciudad: string
    pais: string
    biografia: string
  }
}

export function BuscarPersonas() {
  const [personas, setPersonas] = useState<PersonaUsuario[]>([])
  const [filteredPersonas, setFilteredPersonas] = useState<PersonaUsuario[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const user = getUserFromStorage()

  useEffect(() => {
    fetchPersonas()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPersonas(personas)
    } else {
      const filtered = personas.filter((persona) =>
        `${persona.Persona.nombre} ${persona.Persona.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPersonas(filtered)
    }
  }, [searchTerm, personas])

  const fetchPersonas = async () => {
    try {
      const response = await api.getUsersWithPersona()
      // Filter out current user
      const otherUsers = response.data.data.filter((p: PersonaUsuario) => p.id_usuario !== user?.id_usuario)
      setPersonas(otherUsers)
      setFilteredPersonas(otherUsers)
    } catch (error) {
      console.error("Error al cargar personas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAgregarAmigo = async (id_usuario2: number) => {
    if (!user) return

    try {
      await api.agregarAmigo(user.id_usuario, id_usuario2)
      alert("Solicitud de amistad enviada")
    } catch (error) {
      console.error("Error al enviar solicitud:", error)
      alert("Error al enviar solicitud de amistad")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Buscar Personas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Cargando personas...</p>
        ) : filteredPersonas.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {searchTerm ? "No se encontraron personas" : "No hay personas disponibles"}
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredPersonas.map((persona) => (
              <div
                key={persona.id_usuario}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {persona.Persona.nombre} {persona.Persona.apellido}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {persona.posicion_politica}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">@{persona.nombre_usuario}</p>
                  {persona.Persona.biografia && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{persona.Persona.biografia}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {persona.Persona.ciudad}, {persona.Persona.pais}
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleAgregarAmigo(persona.id_usuario)}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
