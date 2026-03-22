// tomato-classification-frontend/lib/showErrorToast.ts
import { toast } from "sonner"

type ApiErrorResponse = {
  success?: boolean
  message?: string
  error?: string
  statusCode?: number
}

const isApiErrorResponse = (obj: unknown): obj is ApiErrorResponse => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "message" in obj
  )
}

export const showErrorToast = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again"
) => {

  let message = fallbackMessage

  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as any).response

    if (response?.data && isApiErrorResponse(response.data)) {
      message = response.data.message || fallbackMessage
    }
  }

  else if (error instanceof Error) {
    message = error.message
  }

  else if (typeof error === "string") {
    message = error
  }

  toast.error(message)
}