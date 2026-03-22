"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, ImagePlus, X, Loader2, Microscope } from "lucide-react"
import { DiseaseResultCard } from "@/components/disease-result-card"
import { mockDiseaseResult } from "@/lib/mock-data"
import { toast } from "sonner"

export default function DiseaseAnalysisPage() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<typeof mockDiseaseResult | null>(null)
  const [notes, setNotes] = useState("")
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

  const handleDragLeave = () => setIsDragging(false)

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
    setNotes("")
  }

  const handleSaveNotes = () => {
    toast.success("Expert notes saved successfully!")
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-heading">Disease Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload leaf images, verify AI results, and add expert recommendations.
        </p>
      </div>

      <Card className="border-2 border-dashed border-border/60 overflow-hidden">
        <CardContent className="p-0">
          {!image ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-16 px-6 cursor-pointer transition-colors ${
                isDragging ? "bg-primary/5" : "hover:bg-muted/50"
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
                Drag and drop an image here, or click to browse.
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
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
              {!result && (
                <div className="p-4 border-t border-border flex items-center justify-between bg-card">
                  <p className="text-sm text-muted-foreground">Image ready for analysis</p>
                  <Button onClick={handleAnalyze} disabled={analyzing} className="gap-2">
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Microscope className="h-4 w-4" />
                        Run Analysis
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" aria-label="Upload image" />
        </CardContent>
      </Card>

      {analyzing && (
        <Card className="border-primary/30">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="text-center">
              <h3 className="font-semibold text-card-foreground">Running disease analysis...</h3>
              <p className="text-sm text-muted-foreground mt-1">Examining the leaf image for pathological indicators.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <DiseaseResultCard result={result} />

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Expert Notes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="expert-notes">Additional Observations & Recommendations</Label>
                <Textarea
                  id="expert-notes"
                  placeholder="Add your expert observations, corrections, or additional treatment recommendations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotes} disabled={!notes.trim()}>
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
