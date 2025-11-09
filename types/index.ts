export interface Persona {
  id_persona: number
  nombre: string
  apellido: string
  fecha_nacimiento: string
  dpi: string
  correo: string
  telefono?: string
  direccion?: string
  ciudad?: string
  pais?: string
  codigo_postal?: string
  fecha_registro?: string
  sexo?: "M" | "F" | "OTRO"
  tipo_sangre?: string
  biografia?: string
}

export interface Usuario {
  id_usuario: number
  nombre_usuario: string
  tipo_usuario: "COMUN" | "PERIODISTA" | "ADMINISTRADOR"
  estado?: "ACTIVO" | "INACTIVO" | "SUSPENDIDO"
  fecha_registro?: string
  posicion_politica?: "IZQUIERDA" | "CENTRO" | "DERECHA" | "NEUTRO"
  medios_comunicacion?: string
  persona?: Persona
}

export interface Publicacion {
  id_publicacion: number
  id_usuario: number
  tipo_publicacion: "NOTICIA" | "ARTICULO" | "FORO"
  titulo: string
  contenido: string
  fecha_publicacion?: string
  fecha_actualizacion?: string
  estado?: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "ELIMINADO"
  visibilidad?: "PUBLICO" | "AMIGOS"
  orientacion_politica?: "IZQUIERDA" | "CENTRO" | "DERECHA" | "NEUTRO"
  id_evento_asociado?: number
  usuario?: Usuario
  fotos?: PublicacionFoto[]
  comentarios?: Comentario[]
  likes_count?: number
  has_liked?: boolean
}

export interface PublicacionFoto {
  id_foto: number
  id_publicacion: number
  url_foto: string
  descripcion?: string
  fecha_subida?: string
}

export interface Comentario {
  id_comentario: number
  id_publicacion: number
  id_usuario: number
  contenido: string
  fecha_comentario?: string
  estado?: "VISIBLE" | "OCULTO" | "DENUNCIADO"
  usuario?: Usuario
}

export interface Notificacion {
  id_notificacion: number
  id_usuario: number
  tipo_notificacion: string
  mensaje: string
  url_destino?: string
  fecha_creacion?: string
  leida: boolean
}

export interface Amistad {
  id_usuario1: number
  id_usuario2: number
  estado: "PENDIENTE" | "ACEPTADO" | "RECHAZADO"
  fecha_solicitud?: string
  fecha_actualizacion?: string
  usuario?: Usuario
}

export interface HistorialLectura {
  id_historial: number
  id_usuario: number
  id_publicacion: number
  fecha_lectura: string
}

export interface PublicacionMasLeida {
  id_publicacion: number
  cantidad_lecturas: number
  publicacion?: Publicacion
}

export interface Denuncia {
  id_denuncia: number
  id_usuario_denunciante: number
  id_publicacion: number
  id_comentario?: number
  motivo: string
  descripcion: string
  estado: "PENDIENTE" | "REVISADO" | "ACEPTADO" | "RECHAZADO"
  fecha_denuncia: string
  fecha_actualizacion?: string
  Usuario?: Usuario
  publicacion?: Publicacion
}
