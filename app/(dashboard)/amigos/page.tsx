"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListaAmigos } from "@/components/amigos/lista-amigos"
import { SolicitudesAmistad } from "@/components/amigos/solicitudes-amistad"
import { BuscarPersonas } from "@/components/amigos/buscar-personas"

export default function AmigosPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Amigos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="amigos">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="amigos">Mis Amigos</TabsTrigger>
              <TabsTrigger value="solicitudes">Solicitudes</TabsTrigger>
            </TabsList>
            <TabsContent value="amigos">
              <ListaAmigos />
            </TabsContent>
            <TabsContent value="solicitudes">
              <SolicitudesAmistad />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <BuscarPersonas />
    </div>
  )
}
