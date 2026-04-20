import axios from "../axios"

export type DiseasePrediction = {
  predicted_class: string
  cause: string
  prescriptions: string[]
}

export type DiseasePredictionResponse = {
  success: boolean
  data: DiseasePrediction
  message: string
}

export const predictDisease = async (file: File): Promise<DiseasePredictionResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  const { data } = await axios.post("/image/predict/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    timeout: 120000
  })

  return data
}
