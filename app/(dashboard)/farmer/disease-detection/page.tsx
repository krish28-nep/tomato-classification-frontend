"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImagePlus, X, Loader2, Leaf } from "lucide-react"
import { DiseaseResultCard } from "@/components/disease-result-card"
import { PostCard } from "@/components/post-card"
import { mockDiseaseResult, mockPosts } from "@/lib/mock-data"

export default function DiseaseDetectionPage() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<typeof mockDiseaseResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result as string)
      setResult(null)
    }
    reader.readAsDataURL(file)
  }, [])

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
    if (!image) return
    setAnalyzing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setResult(mockDiseaseResult)
    setAnalyzing(false)
  }

  const handleClear = () => {
    setImage(null)
    setResult(null)
  }

  const relatedPosts = mockPosts.filter((p) => p.tags.includes("disease") || p.tags.includes("leaves")).slice(0, 2)

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
          {!image ? (
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
                <img src={image} alt="Uploaded leaf" className="max-h-full max-w-full object-contain" />
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
                  <Button onClick={handleAnalyze} disabled={analyzing} className="gap-2">
                    {analyzing ? (
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
      {analyzing && (
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

      {/* Results */}
      {result && <DiseaseResultCard result={result} />}

      {/* Related Community Posts */}
      {result && relatedPosts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-foreground font-heading">Related Community Discussions</h2>
          {relatedPosts.map((post) => (
            <PostCard key={post.id} post={post} basePath="/farmer" />
          ))}
        </div>
      )}
    </div>
  )
}
