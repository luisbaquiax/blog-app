export interface User {
  id_usuario: number
  nombre_usuario: string
  tipo_usuario: "ADMINISTRADOR" | "PERIODISTA" | "COMUN"
  posicion_politica?: string
  medios_comunicacion?: string
}

export const saveUserToStorage = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user))
  }
}

export const getUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  }
  return null
}

export const removeUserFromStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

export const isAuthenticated = (): boolean => {
  return getUserFromStorage() !== null
}
