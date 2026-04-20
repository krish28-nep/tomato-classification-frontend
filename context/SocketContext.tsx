"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { useAuth } from "@/hooks/useAuth"
import { SocketChatMessage } from "@/types/chat"
import { Role } from "@/types/user"

type SocketStatus = "connecting" | "connected" | "disconnected"
type SocketEventMap = {
  message: SocketChatMessage
}

type SocketEventName = keyof SocketEventMap
type SocketListener<TEvent extends SocketEventName> = (payload: SocketEventMap[TEvent]) => void

type SocketContextType = {
  status: SocketStatus
  on: <TEvent extends SocketEventName>(event: TEvent, listener: SocketListener<TEvent>) => () => void
  send: (payload: { to: number; message: string }) => boolean
  getBufferedMessages: (roomUserId: number) => SocketChatMessage[]
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [status, setStatus] = useState<SocketStatus>("disconnected")

  const socketRef = useRef<WebSocket | null>(null)
  const pathnameRef = useRef(pathname)
  const chatPathRef = useRef<string | null>(null)
  const messageBufferRef = useRef<Map<number, SocketChatMessage[]>>(new Map())
  const listenersRef = useRef<{
    message: Set<SocketListener<"message">>
  }>({
    message: new Set(),
  })

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    if (user?.role === Role.USER) {
      chatPathRef.current = "/farmer/chat"
      return
    }

    if (user?.role === Role.EXPERT) {
      chatPathRef.current = "/expert/chat"
      return
    }

    chatPathRef.current = null
  }, [user?.role])

  const emit = useCallback(<TEvent extends SocketEventName>(event: TEvent, payload: SocketEventMap[TEvent]) => {
    listenersRef.current[event].forEach((listener) => {
      listener(payload as never)
    })
  }, [])

  const parseSocketMessage = useCallback((rawData: unknown): SocketChatMessage | null => {
    if (typeof rawData !== "string") {
      return null
    }

    const trimmed = rawData.trim()

    if (trimmed === "") {
      return null
    }

    if (!trimmed.startsWith("{")) {
      return {
        message: trimmed,
        sender_id: -1,
        receiver_id: -1,
        is_read: false,
        messaged_at: new Date().toISOString(),
      }
    }

    try {
      return JSON.parse(trimmed) as SocketChatMessage
    } catch {
      return {
        message: trimmed,
        sender_id: -1,
        receiver_id: -1,
        is_read: false,
        messaged_at: new Date().toISOString(),
      }
    }
  }, [])

  const on = useCallback(<TEvent extends SocketEventName>(event: TEvent, listener: SocketListener<TEvent>) => {
    const typedListener = listener as SocketListener<"message">
    listenersRef.current[event].add(typedListener)

    return () => {
      listenersRef.current[event].delete(typedListener)
    }
  }, [])

  const send = useCallback((payload: { to: number; message: string }) => {
    const socket = socketRef.current

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false
    }

    socket.send(JSON.stringify(payload))
    return true
  }, [])

  const getBufferedMessages = useCallback((roomUserId: number) => {
    return messageBufferRef.current.get(roomUserId) ?? []
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      setStatus("disconnected")
      socketRef.current?.close()
      socketRef.current = null
      return
    }

    const ws = new WebSocket("ws://localhost:8000/api/v1/chat/ws")
    socketRef.current = ws

    ws.onopen = () => {
      setStatus("connected")
    }

    ws.onclose = () => {
      setStatus("disconnected")
    }

    ws.onerror = () => {
      setStatus("disconnected")
    }

    ws.onmessage = (event) => {
      const message = parseSocketMessage(event.data)

      if (!message) {
        return
      }

      if (user?.id) {
        const roomUserId =
          message.sender_id === user.id ? message.receiver_id : message.sender_id

        if (roomUserId > 0) {
          const existingMessages = messageBufferRef.current.get(roomUserId) ?? []
          messageBufferRef.current.set(roomUserId, [...existingMessages, message].slice(-20))
        }
      }

      emit("message", message)

      const currentPath = pathnameRef.current
      const chatPath = chatPathRef.current
      const roomPath = chatPath && message.sender_id > 0 ? `${chatPath}/${message.sender_id}` : null
      const isAlreadyOnRoom = roomPath ? currentPath === roomPath : false

      if (!isAlreadyOnRoom && roomPath) {
        toast("New message received", {
          description: message.message,
          action: {
            label: "Open chat",
            onClick: () => router.push(roomPath),
          },
        })
        return
      }

      const isAlreadyOnChatList = chatPath ? currentPath === chatPath : false

      if (!isAlreadyOnRoom && !isAlreadyOnChatList && message.message && chatPath) {
        toast("New message received", {
          description: message.message,
          action: {
            label: "Open chats",
            onClick: () => router.push(chatPath),
          },
        })
      }
    }

    return () => {
      ws.close()
      socketRef.current = null
    }
  }, [emit, isAuthenticated, parseSocketMessage, router, user?.email, user?.id])

  const value = useMemo<SocketContextType>(() => ({
    status,
    on,
    send,
    getBufferedMessages,
  }), [getBufferedMessages, on, send, status])

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error("useSocket must be used within SocketProvider")
  }

  return context
}
