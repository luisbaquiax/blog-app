"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ComentariosSection } from "@/components/comentarios/comentarios-section";
import { LikeButton } from "@/components/publicaciones/like-button";
import { DenunciarButton } from "@/components/publicaciones/denunciar-button";
import { api } from "@/lib/api";
import { getUserFromStorage } from "@/lib/auth";

import { User } from 'lucide-react'; 
import { Publicacion, Usuario, Persona } from "@/types";

interface PublicacionData {
  publicacion: Publicacion;
  likes: number;
}

interface ApiResponse {
  publicacion: Publicacion;
  likes: number;
}

export default function PublicacionDetailPage() {
  const params = useParams();
  const [publicacionData, setPublicacionData] = useState<PublicacionData | null>(null);
  const [loading, setLoading] = useState(true);

  const historialRegistrado = useRef(false);

  const user = useMemo(() => getUserFromStorage(), []); 
  
  const publicacionId = useMemo(() => {
    if (params && params.id) {
        const idString = Array.isArray(params.id) ? params.id[0] : params.id;
        return Number(idString);
    }
    return NaN;
  }, [params.id]);

  const publicacion = publicacionData?.publicacion;

  useEffect(() => {
    if (!publicacionId || isNaN(publicacionId)) {
        setLoading(false);
        return;
    }

    const fetchPublicacion = async () => {
      if (publicacionData && publicacionData.publicacion.id_publicacion === publicacionId) {
          setLoading(false);
          return;
      }
      
      setLoading(true);
      try {
        const response = await api.getPublicacionPorId(publicacionId);
        
        const dataFromApi: ApiResponse = response.data.data; 

        setPublicacionData(dataFromApi);
        
      } catch (error) {
        console.error("Error al cargar publicación:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicacion();
    
  }, [publicacionId]);

  useEffect(() => {
    if (!publicacionId || isNaN(publicacionId) || !user) {
        return;
    }

    if (historialRegistrado.current) {
        console.log(`[Historial Controlado] Evitando doble registro para ID: ${publicacionId}`);
        return; 
    }

    const registerHistory = async () => {
      try {
        await api.agregarHistorialLectura(user.id_usuario, publicacionId);
        historialRegistrado.current = true; 
        console.log(`✅ Historial de lectura registrado de forma única para ID: ${publicacionId}`);
      } catch (error) {
        console.error("❌ Error al registrar historial de lectura:", error);
      }
    };

    registerHistory();
    
  }, [publicacionId, user]);


  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 font-sans text-gray-700">Cargando detalles de la publicación...</div>;
  }

  if (!publicacion || !publicacionData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="rounded-xl shadow-lg">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-semibold text-red-500">Error 404</h2>
            <p className="text-gray-500 mt-2">No se pudo encontrar la publicación solicitada.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const formattedDate = publicacion.fecha_publicacion ? 
    new Date(publicacion.fecha_publicacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }) : "Fecha Desconocida";

  // Iniciales para el Avatar o Icono de usuario
  const initial = publicacion.usuario?.nombre_usuario ? publicacion.usuario.nombre_usuario[0].toUpperCase() : <User className="h-5 w-5" />;
  const usuario = publicacion.Usuario || publicacion.usuario
  const persona = usuario?.Persona || usuario?.persona
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 font-sans">
      
      <Card className="rounded-xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="p-6 pb-4 border-b border-gray-100">
          <div className="flex items-start gap-4">
            
            <Avatar>
            <AvatarFallback>{usuario?.nombre_usuario?.[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-2 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {usuario?.nombre_usuario || "Usuario Desconocido"}
                </h3>
                
                {/* Metadatos en Badges */}
                <div className="flex flex-wrap gap-2 mt-1 sm:mt-0">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 rounded-full">{publicacion.tipo_publicacion}</Badge>
                  {publicacion.usuario?.tipo_usuario === "PERIODISTA" && <Badge variant="outline" className="border-green-500 text-green-700 rounded-full">Periodista</Badge>}
                  {publicacion.estado && (
                    <Badge variant={publicacion.estado === "APROBADO" ? "default" : "destructive"} className="rounded-full">
                      {publicacion.estado}
                    </Badge>
                  )}
                  {publicacion.orientacion_politica && (
                    <Badge variant="outline" className="rounded-full">{publicacion.orientacion_politica}</Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                Publicado el {formattedDate}
              </p>
              
              {publicacion.usuario?.persona && (
                <p className="text-sm text-gray-600 font-medium mt-1">
                  {publicacion.usuario.persona.nombre} {publicacion.usuario.persona.apellido}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{publicacion.titulo}</h1>
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              <p className="whitespace-pre-wrap">{publicacion.contenido}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
            <LikeButton 
              publicacionId={publicacion.id_publicacion} 
              initialLikes={publicacionData.likes}
            />
            
            {publicacion.tipo_publicacion === "ARTICULO" && user && (
              <DenunciarButton 
                publicacionId={publicacion.id_publicacion} 
                userId={user.id_usuario} 
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sección de Comentarios */}
      <ComentariosSection publicacionId={Number(params.id)} />
    </div>
  );
}