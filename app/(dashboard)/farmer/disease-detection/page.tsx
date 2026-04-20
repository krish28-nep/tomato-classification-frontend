"use client"

import { useState, useRef, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImagePlus, X, Loader2, Leaf, AlertTriangle, Pill, Info } from "lucide-react"
import { predictDisease } from "@/lib/api/disease"

export default function DiseaseDetectionPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      setSelectedFile(file)
    }
    reader.readAsDataURL(file)
  }, [])

  const {
    data: predictionResponse,
    isFetching: isAnalyzing,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["disease-prediction", selectedFile?.name, selectedFile?.lastModified, selectedFile?.size],
    queryFn: async () => {
      if (!selectedFile) {
        throw new Error("Please select an image before analyzing.")
      }

      return predictDisease(selectedFile)
    },
    enabled: false,
    retry: false
  })

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return
    await refetch()
  }

  const handleClear = () => {
    setImagePreview(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const result = predictionResponse?.data
  const formattedPredictedClass = result?.predicted_class.replaceAll("_", " ") ?? ""
  const errorMessage =
    error instanceof Error ? error.message : "We couldn't analyze the image right now. Please try again."

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Disease Detection</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload a photo of your tomato leaf for AI-powered disease analysis.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-border/60 overflow-hidden">
        <CardContent className="p-0">
          {!imagePreview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-16 px-6 cursor-pointer transition-colors ${
                isDragging ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
              }`}
              role="button"
              tabIndex={0}
              aria-label="Upload image area"
            >
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Upload Leaf Image</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Drag and drop an image here, or click to browse. Supports JPG, PNG, and WebP formats.
              </p>
              <Button variant="outline" className="mt-4 gap-2">
                <ImagePlus className="h-4 w-4" />
                Choose Image
              </Button>
            </div>
          ) : (
            <div className="relative">
              <div className="aspect-video max-h-96 overflow-hidden flex items-center justify-center bg-muted">
                <img src={imagePreview} alt="Uploaded leaf" className="max-h-full max-w-full object-contain" />
              </div>
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
              {!result && (
                <div className="p-4 border-t border-border flex items-center justify-between bg-card">
                  <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Leaf className="h-4 w-4" />
                        Analyze Disease
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Upload image"
          />
        </CardContent>
      </Card>

      {/* Loading State */}
      {isAnalyzing && (
        <Card className="border-primary/30">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="font-semibold text-card-foreground">Analyzing your image...</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our AI model is examining the leaf for signs of disease.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{errorMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4">
          <Card className="border-primary/30 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-card-foreground">{formattedPredictedClass}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{predictionResponse.message}</p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-card-foreground">
                <AlertTriangle className="h-4 w-4 text-accent" />
                Cause
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.cause}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-card-foreground">
                <Pill className="h-4 w-4 text-chart-3" />
                Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-2">
                {result.prescriptions.map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-chart-3 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-border/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-card-foreground">
                <Info className="h-4 w-4 text-muted-foreground" />
                Predicted Label
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{result.predicted_class}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
