"use client"

import { useState } from "react"
import {
  Calendar,
  FileText,
  Pill,
  MessageSquare,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ClinicalAgentAPI } from "@/lib/api-client"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PatientActionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: {
    id: string
    name: string
    condition?: string
  }
}

export function PatientActionsDialog({
  open,
  onOpenChange,
  patient,
}: PatientActionsDialogProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (action: string) => {
    setLoading(action)
    setError(null)
    setResult(null)

    try {
      let response
      switch (action) {
        case "history":
          response = await ClinicalAgentAPI.getPatientHistory(patient.id)
          setResult({
            title: "Medical History",
            data: response,
          })
          break
        case "schedule":
          response = await ClinicalAgentAPI.scheduleAppointment({
            patient_id: patient.id,
            doctor_id: "DR001",
            appointment_time: "2026-02-10 14:00",
            reason: "Follow-up visit",
          })
          setResult({
            title: "Appointment Scheduled",
            data: response,
          })
          break
        case "medications":
          response = await ClinicalAgentAPI.checkDrugInteractions({
            medication1: "aspirin",
            medication2: "ibuprofen",
          })
          setResult({
            title: "Drug Interaction Check",
            data: response,
          })
          break
        case "query":
          response = await ClinicalAgentAPI.queryAgent({
            patient_id: patient.id,
            question: "What is the patient's current status and risk level?",
          })
          setResult({
            title: "AI Agent Response",
            data: response,
          })
          break
      }
    } catch (err: any) {
      setError(err.message || "Action failed")
    } finally {
      setLoading(null)
    }
  }

  const actions = [
    {
      id: "history",
      title: "View Medical History",
      description: "Retrieve patient's medical records",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "schedule",
      title: "Schedule Appointment",
      description: "Book a follow-up appointment",
      icon: Calendar,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: "medications",
      title: "Check Drug Interactions",
      description: "Verify medication compatibility",
      icon: Pill,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "query",
      title: "Ask AI Agent",
      description: "Get AI assessment and recommendations",
      icon: MessageSquare,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Patient Actions: {patient.name}</DialogTitle>
          <DialogDescription>
            Patient ID: {patient.id}
            {patient.condition && ` • Condition: ${patient.condition}`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4 p-1">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={() => handleAction(action.id)}
                  disabled={loading !== null}
                >
                  <div className={`p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  {loading === action.id && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <Card className="border-primary/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <div>
                      <p className="font-medium">Processing request...</p>
                      <p className="text-sm text-muted-foreground">
                        Contacting AI agent backend
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-destructive/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Error</p>
                      <p className="text-sm text-muted-foreground">{error}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Make sure backend is running on http://localhost:8000
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Result Display */}
            {result && (
              <Card className="border-success/50">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <p className="font-medium">{result.title}</p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <pre className="text-xs overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
