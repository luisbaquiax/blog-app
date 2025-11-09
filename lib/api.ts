import axiosInstance from "./axios"

// Users API
export const api = {
  // Auth
  register: async (data: {
    nombre: string
    apellido: string
    fecha_nacimiento: string
    dpi: string
    correo: string
    telefono: string
    direccion: string
    ciudad: string
    pais: string
    codigo_postal: string
    sexo: string
    tipo_sangre: string
    biografia: string
    nombre_usuario: string
    password: string
    tipo_usuario: string
    posicion_politica?: string
    medios_comunicacion?: string
  }) => {
    return axiosInstance.post("/users/register", data)
  },

  login: async (nombre_usuario: string, password: string) => {
    return axiosInstance.post("/users/login", { nombre_usuario, password })
  },

  getUserProfile: async (id_usuario: number) => {
    return axiosInstance.get(`/users/${id_usuario}`)
  },

  getAllUsers: async () => {
    return axiosInstance.get("/users")
  },

  // Publicaciones
  getPublicacionesPublicas: async () => {
    return axiosInstance.get("/publicaciones/publicas")
  },

  getPublicacionesVisibles: async (id_usuario: number) => {
    return axiosInstance.get(`/publicaciones/publicaciones-visibles/${id_usuario}`)
  },

  getPublicacionPorId: async (id_publicacion: number) => {
    return axiosInstance.get(`/publicaciones/${id_publicacion}`)
  },

  crearPublicacion: async (data: {
    id_usuario: number
    tipo_publicacion: string
    titulo: string
    contenido: string
    visibilidad: string
    id_evento?: number
  }) => {
    return axiosInstance.post("/publicaciones/crear", data)
  },

  actualizarPublicacion: async (id_publicacion: number, data: any) => {
    return axiosInstance.put(`/publicaciones/actualizar/${id_publicacion}`, data)
  },

  cambiarEstadoPublicacion: async (id_publicacion: number, nuevo_estado: string) => {
    return axiosInstance.put(`/publicaciones/cambiar-estado/${id_publicacion}`, { nuevo_estado })
  },

  getPublicacionesPorOrientacion: async (id_usuario: number) => {
    return axiosInstance.get(`/publicaciones/por-orientacion/${id_usuario}`)
  },

  agregarFotoPublicacion: async (formData: FormData) => {
    return axiosInstance.post("/publicaciones/agregar-foto", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  eliminarFotoPublicacion: async (id_foto: number) => {
    return axiosInstance.delete(`/publicaciones/eliminar-foto/${id_foto}`)
  },

  // Comentarios
  agregarComentario: async (data: {
    id_publicacion: number
    id_usuario: number
    contenido: string
  }) => {
    return axiosInstance.post("/comentarios/comentarios", data)
  },

  getComentariosPorPublicacion: async (id_publicacion: number) => {
    return axiosInstance.get(`/comentarios/comentarios/publicacion/${id_publicacion}`)
  },

  getComentariosPorUsuario: async (id_usuario: number) => {
    return axiosInstance.get(`/comentarios/usuario/${id_usuario}`)
  },

  editarComentario: async (id_usuario: number, id_comentario: number, contenido: string) => {
    return axiosInstance.put(`/comentarios/${id_usuario}/${id_comentario}`, { contenido })
  },

  eliminarComentario: async (id_usuario: number, id_comentario: number) => {
    return axiosInstance.delete(`/comentarios/${id_usuario}/${id_comentario}`)
  },

  // Likes
  darLike: async (id_usuario: number, id_publicacion: number) => {
    return axiosInstance.post("/likes/like", { id_usuario, id_publicacion })
  },

  quitarLike: async (id_usuario: number, id_publicacion: number) => {
    return axiosInstance.delete("/likes/like", { data: { id_usuario, id_publicacion } })
  },

  verificarLike: async (id_usuario: number, id_publicacion: number) => {
    return axiosInstance.get(`/likes/like/verificar/${id_usuario}/${id_publicacion}`)
  },

  // Amigos
  agregarAmigo: async (id_usuario1: number, id_usuario2: number) => {
    return axiosInstance.post("/friends/agregar", { id_usuario1, id_usuario2 })
  },

  aceptarAmigo: async (id_usuario1: number, id_usuario2: number) => {
    return axiosInstance.post("/friends/aceptar", { id_usuario1, id_usuario2 })
  },

  rechazarAmigo: async (id_usuario1: number, id_usuario2: number) => {
    return axiosInstance.post("/friends/rechazar", { id_usuario1, id_usuario2 })
  },

  listarAmigos: async (id_usuario: number) => {
    return axiosInstance.get(`/friends/listar-amigos/${id_usuario}`)
  },

  eliminarAmigo: async (id_usuario1: number, id_usuario2: number) => {
    return axiosInstance.delete("/friends/eliminar", { data: { id_usuario1, id_usuario2 } })
  },

  getSolicitudesPendientes: async (id_usuario: number) => {
    return axiosInstance.get(`/friends/solicitudes-pendientes/${id_usuario}`)
  },

  // Denuncias
  denunciarPublicacion: async (data: {
    id_usuario: number
    id_publicacion: number
    motivo: string
    descripcion: string
  }) => {
    return axiosInstance.post("/denuncias/denunciar", data)
  },

  getDenunciasPendientes: async () => {
    return axiosInstance.get("/denuncias/denuncias/pendientes")
  },

  actualizarEstadoDenuncia: async (id_denuncia: number, nuevo_estado: string) => {
    return axiosInstance.put(`/denuncias/denuncia/${id_denuncia}/estado`, { nuevo_estado })
  },

  // Suscripciones
  suscribirseAPeriodista: async (id_usuario: number, id_periodista: number) => {
    return axiosInstance.post("/suscripciones/suscribirse", { id_usuario, id_periodista })
  },

  getSuscripciones: async (id_usuario: number) => {
    return axiosInstance.get(`/suscripciones/suscripciones/${id_usuario}`)
  },

  // Historial de lectura
  agregarHistorialLectura: async (id_usuario: number, id_publicacion: number) => {
    return axiosInstance.post("/historial-lectura/agregar", { id_usuario, id_publicacion })
  },

  getPublicacionesMasLeidas: async () => {
    return axiosInstance.get("/historial-lectura/reporte-mas-leidas")
  },

  // Usuarios con persona
  getUsersWithPersona: async () => {
    return axiosInstance.get("/users")
  },
}
