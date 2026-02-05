"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageSquare,
  Phone,
  User,
  X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const appointments = [
  {
    id: 1,
    time: "09:00",
    patient: "John Doe",
    patientId: "P-1024",
    type: "Follow-up",
    status: "Confirmed",
    duration: 30,
  },
  {
    id: 2,
    time: "09:30",
    patient: "Maria Santos",
    patientId: "P-2156",
    type: "Medication Review",
    status: "Pending",
    duration: 30,
  },
  {
    id: 3,
    time: "10:30",
    patient: "Robert Chen",
    patientId: "P-3891",
    type: "Lab Results",
    status: "Confirmed",
    duration: 45,
  },
  {
    id: 4,
    time: "11:30",
    patient: "Emily Watson",
    patientId: "P-4521",
    type: "Initial Assessment",
    status: "Not Confirmed",
    duration: 60,
  },
  {
    id: 5,
    time: "14:00",
    patient: "James Wilson",
    patientId: "P-5672",
    type: "Follow-up",
    status: "Confirmed",
    duration: 30,
  },
  {
    id: 6,
    time: "15:00",
    patient: "Sarah Johnson",
    patientId: "P-6834",
    type: "Routine Check",
    status: "Pending",
    duration: 30,
  },
]

const statusLogic = [
  {
    status: "Confirmed",
    description: "Patient interacted with app",
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    status: "Pending",
    description: "Notification delivered to device",
    icon: Bell,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    status: "Not Confirmed",
    description: "Alert triggered for Ops Intervention",
    icon: AlertCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
]

const automationTimeline = [
  { time: "T-2 Days", action: "Notification sent via SMS/App", completed: true },
  { time: "T-1 Day", action: "Reminder notification sent", completed: true },
  { time: "T-Zero", action: "Appointment Time - System checks for check-in", completed: false },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "Confirmed":
      return (
        <Badge className="bg-success/20 text-success border-success/30">
          <Check className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      )
    case "Pending":
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30">
          <Clock className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      )
    case "Not Confirmed":
      return (
        <Badge className="bg-destructive/20 text-destructive border-destructive/30">
          <X className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function SchedulingView() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  const currentDay = currentDate ? currentDate.getDate() : "--"
  const currentMonth = currentDate
    ? currentDate.toLocaleString("default", { month: "long" })
    : "--"
  const currentYear = currentDate ? currentDate.getFullYear() : "----"

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automated Scheduling</h1>
          <p className="text-muted-foreground">
            AI-driven appointment management with automated status logic
          </p>
        </div>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">32</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Not Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mini Calendar */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {currentMonth} {currentYear}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 3 // Offset for month start
                  const isCurrentDay = dayNum === currentDay
                  const isValid = dayNum > 0 && dayNum <= 28
                  const hasAppointments = [4, 7, 11, 14, 18, 21, 25].includes(dayNum)

                  return (
                    <button
                      key={i}
                      className={`p-2 rounded-lg text-sm transition-colors relative ${
                        isCurrentDay
                          ? "bg-primary text-primary-foreground font-semibold"
                          : isValid
                          ? "hover:bg-secondary"
                          : "text-muted-foreground/30"
                      }`}
                      disabled={!isValid}
                    >
                      {isValid ? dayNum : ""}
                      {hasAppointments && isValid && !isCurrentDay && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Today's Appointments */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Today&apos;s Schedule</CardTitle>
              <CardDescription>February 4, 2026</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-secondary/30 transition-colors"
                >
                  <div className="text-center min-w-[60px]">
                    <p className="font-semibold">{apt.time}</p>
                    <p className="text-xs text-muted-foreground">{apt.duration} min</p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{apt.patient}</span>
                      <span className="text-xs text-muted-foreground">{apt.patientId}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.type}</p>
                  </div>
                  {getStatusBadge(apt.status)}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Logic */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Status Logic</CardTitle>
              <CardDescription>Automated appointment status tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusLogic.map((status) => (
                <div key={status.status} className={`p-3 rounded-lg ${status.bgColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <status.icon className={`w-4 h-4 ${status.color}`} />
                    <span className={`font-medium text-sm ${status.color}`}>{status.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{status.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Automation Timeline */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Automation Timeline</CardTitle>
              <CardDescription>Pre-appointment notification sequence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />
                <div className="space-y-4">
                  {automationTimeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          item.completed ? "bg-success" : "bg-muted"
                        }`}
                      >
                        {item.completed ? (
                          <Check className="w-3 h-3 text-success-foreground" />
                        ) : (
                          <Clock className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.time}</p>
                        <p className="text-xs text-muted-foreground">{item.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outcome */}
          <Card className="border-0 shadow-sm bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-1">Outcome</p>
              <p className="text-xs text-muted-foreground">
                Reduces &apos;No-Shows&apos; without requiring manual phone banking by administrative
                staff.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
