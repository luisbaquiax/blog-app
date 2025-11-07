"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axios"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  publicacionId: number
  initialLikes: number
  initialHasLiked: boolean
}

export function LikeButton({ publicacionId, initialLikes, initialHasLiked }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [hasLiked, setHasLiked] = useState(initialHasLiked)

  const handleLike = async () => {
    try {
      if (hasLiked) {
        await axiosInstance.delete(`/publicaciones/${publicacionId}/like`)
        setLikes(likes - 1)
        setHasLiked(false)
      } else {
        await axiosInstance.post(`/publicaciones/${publicacionId}/like`)
        setLikes(likes + 1)
        setHasLiked(true)
      }
    } catch (error) {
      console.error("Error al dar like:", error)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLike} className="gap-1">
      <Heart className={cn("h-4 w-4", hasLiked && "fill-red-500 text-red-500")} />
      <span>{likes}</span>
    </Button>
  )
}
