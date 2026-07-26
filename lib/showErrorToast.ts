import axios from "axios"
import { toast } from "sonner"

type ApiErrorResponse = {
  success: boolean
  data: unknown
  message: string
  pagination: unknown
}

const isApiErrorResponse = (value: unknown): value is ApiErrorResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  )
}

export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again"
) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    if (isApiErrorResponse(data)) {
      return data.message || fallbackMessage
    }
  }

  return fallbackMessage
}

export const showErrorToast = (
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again"
) => {
  toast.error(getErrorMessage(error, fallbackMessage))
}
