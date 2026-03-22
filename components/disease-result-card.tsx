import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, Pill, Info } from "lucide-react"
import type { DiseaseResult } from "@/lib/mock-data"

interface DiseaseResultCardProps {
  result: DiseaseResult
}

export function DiseaseResultCard({ result }: DiseaseResultCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="border-primary/30 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-lg text-card-foreground">{result.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-semibold">
                {result.confidence}% Confidence
              </Badge>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Detection Confidence</span>
              <span>{result.confidence}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-card-foreground">
            <AlertTriangle className="h-4 w-4 text-accent" />
            Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {result.symptoms.map((symptom, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                {symptom}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-card-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Prevention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {result.prevention.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-card-foreground">
            <Pill className="h-4 w-4 text-chart-3" />
            Treatment / Cure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2">
            {result.cure.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
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
            Expert Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Based on the analysis, we recommend consulting with a plant pathologist for a definitive diagnosis.
            Early intervention is key to managing this disease effectively. Consider posting in the community
            forum for additional expert advice tailored to your specific conditions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
