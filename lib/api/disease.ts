import axios from "../axios"

export type DiseasePrediction = {
  predicted_class: string
  cause: string | null
  prescriptions: string[] | null
}

export type DiseasePredictionResponse = {
  success: boolean
  data: DiseasePrediction
  message: string
}

const isTimeoutError = (error: unknown) => (
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === "ECONNABORTED"
)

export const predictDisease = async (file: File): Promise<DiseasePredictionResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const { data } = await axios.post("/image/predict/", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 60000
    })

    return data
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new Error("Disease analysis is taking too long. Please try again with a clearer image.")
    }

    throw error
  }
}
