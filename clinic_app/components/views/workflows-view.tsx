"use client"

import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  FlaskConical,
  Pill,
  Stethoscope,
  User,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const workflowStages = [
  { id: "request", label: "Request Received", icon: FileText, color: "bg-primary" },
  { id: "ra", label: "Ready for RA", icon: User, color: "bg-accent" },
  { id: "admin", label: "Ready for Admin", icon: Users, color: "bg-muted" },
  { id: "nurse", label: "Ready for Nurse", icon: Stethoscope, color: "bg-primary" },
  { id: "doctor", label: "Ready for Doctor", icon: Stethoscope, color: "bg-accent" },
  { id: "lab", label: "Ready for Lab", icon: FlaskConical, color: "bg-muted" },
  { id: "pharmacy", label: "Ready for Pharmacy", icon: Pill, color: "bg-success" },
]

const workflowStageCounts = [6, 10, 8, 12, 5, 9, 7]

const activeWorkflows = [
  {
    id: "WF-001",
    patient: "John Doe",
    patientId: "P-1024",
    type: "Follow-up Visit",
    currentStage: "nurse",
    startedAt: "2025-02-04 09:15",
    priority: "High",
  },
  {
    id: "WF-002",
    patient: "Maria Santos",
    patientId: "P-2156",
    type: "Medication Refill",
    currentStage: "pharmacy",
    startedAt: "2025-02-04 08:30",
    priority: "High",
  },
  {
    id: "WF-003",
    patient: "Robert Chen",
    patientId: "P-3891",
    type: "Lab Results Review",
    currentStage: "doctor",
    startedAt: "2025-02-04 10:00",
    priority: "Medium",
  },
  {
    id: "WF-004",
    patient: "Emily Watson",
    patientId: "P-4521",
    type: "Initial Assessment",
    currentStage: "ra",
    startedAt: "2025-02-04 11:20",
    priority: "Low",
  },
]

const workflowStats = [
  { label: "Total Active", value: 87, change: "+5" },
  { label: "Completed Today", value: 43, change: "+12" },
  { label: "Avg Duration", value: "2.4 hrs", change: "-15%" },
  { label: "Bottlenecks", value: 3, change: "-2" },
]

function getStageIndex(stageId: string) {
  return workflowStages.findIndex((s) => s.id === stageId)
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "High":
      return <Badge variant="destructive">{priority}</Badge>
    case "Medium":
      return <Badge className="bg-warning text-warning-foreground">{priority}</Badge>
    default:
      return <Badge variant="secondary">{priority}</Badge>
  }
}

export function WorkflowsView() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Clinical Workflows</h1>
        <p className="text-muted-foreground">
          Track patient files through the clinical pipeline with role-based transparency
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {workflowStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className="text-xs text-success mb-1">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workflow Pipeline Visual */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Workflow Pipeline</CardTitle>
          <CardDescription>
            Any user with Role-Based Access can see exactly where a participant file is located
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto pb-4">
            {workflowStages.map((stage, index) => (
              <div key={stage.id} className="flex items-center">
                <div className="flex flex-col items-center min-w-[100px]">
                  <div
                    className={`w-12 h-12 rounded-full ${stage.color} flex items-center justify-center mb-2`}
                  >
                    <stage.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-xs text-center font-medium">{stage.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {workflowStageCounts[index] ?? 0} files
                  </span>
                </div>
                {index < workflowStages.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflows */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Active Workflows</CardTitle>
              <CardDescription>Real-time tracking of patient workflows</CardDescription>
            </div>
            <Button variant="outline">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeWorkflows.map((workflow) => {
            const currentIndex = getStageIndex(workflow.currentStage)
            const progress = ((currentIndex + 1) / workflowStages.length) * 100

            return (
              <div
                key={workflow.id}
                className="p-4 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{workflow.patient}</span>
                        <span className="text-xs text-muted-foreground">{workflow.patientId}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{workflow.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(workflow.priority)}
                    <Badge variant="outline" className="text-xs">
                      {workflow.id}
                    </Badge>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {workflowStages[currentIndex].label}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between mt-1">
                      {workflowStages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className={`w-3 h-3 rounded-full -mt-2.5 ${
                            index <= currentIndex ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    Started: {workflow.startedAt}
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
