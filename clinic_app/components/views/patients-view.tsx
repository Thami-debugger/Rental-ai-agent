"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  ChevronRight,
  Filter,
  Mail,
  MoreHorizontal,
  Phone,
  Pill,
  Plus,
  Search,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PatientActionsDialog } from "@/components/patient-actions-dialog"
import { ClinicalAgentAPI } from "@/lib/api-client"

// Transform backend data to display format
interface Patient {
  id: string
  name: string
  age?: number
  condition: string
  status: string
  lastVisit: string
  nextAppointment?: string
  adherence?: number
  phone?: string
  email?: string
  patient_id?: string
  first_name?: string
  last_name?: string
  date_of_birth?: string
  allergies?: string[]
  chronic_conditions?: string[]
}

function getStatusBadge(status: string) {
  switch (status) {
    case "High Risk":
      return <Badge variant="destructive">{status}</Badge>
    case "Medium Risk":
      return <Badge className="bg-warning text-warning-foreground">{status}</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

function getAdherenceColor(adherence: number) {
  if (adherence >= 80) return "text-success"
  if (adherence >= 60) return "text-warning"
  return "text-destructive"
}

// Transform backend patient data to display format
function transformPatientData(backendPatients: any[]): Patient[] {
  return backendPatients.map((p) => ({
    id: p.patient_id || p.id,
    name: `${p.first_name || p.name?.split(" ")[0] || ""} ${p.last_name || p.name?.split(" ")[1] || ""}`,
    condition: Array.isArray(p.chronic_conditions) && p.chronic_conditions.length > 0 
      ? p.chronic_conditions[0] 
      : p.condition || "Routine",
    status: p.status || "Low Risk",
    lastVisit: p.last_visit || "2025-02-01",
    phone: p.phone || "",
    email: p.email || "",
    adherence: p.adherence || 75,
  }))
}

export function PatientsView() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Load patients from backend on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true)
        const response = await ClinicalAgentAPI.searchPatients()
        
        // Handle the API response
        if (response && Array.isArray(response)) {
          const transformed = transformPatientData(response)
          setPatients(transformed)
        } else if (response?.success && Array.isArray(response.patients)) {
          const transformed = transformPatientData(response.patients)
          setPatients(transformed)
        } else {
          // Fallback - provide helpful data
          console.log("API Response:", response)
          setError("Could not load patients from backend")
        }
      } catch (err) {
        console.error("Error loading patients:", err)
        setError("Failed to load patients. Make sure backend is running on http://localhost:8000")
      } finally {
        setLoading(false)
      }
    }

    loadPatients()
  }, [])


  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handlePatientAction = (patient: typeof patients[0]) => {
    setSelectedPatient(patient)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Management</h1>
          <p className="text-muted-foreground">
            Comprehensive view of patient cohort with AI-driven insights
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2,847</p>
                <p className="text-xs text-muted-foreground">Total Patients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <User className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">High Risk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Calendar className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">48</p>
                <p className="text-xs text-muted-foreground">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Pill className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">76%</p>
                <p className="text-xs text-muted-foreground">Avg Adherence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Patient Directory</CardTitle>
              <CardDescription>Click on a patient to view detailed profile</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="High Risk">High Risk</SelectItem>
                  <SelectItem value="Medium Risk">Medium Risk</SelectItem>
                  <SelectItem value="Low Risk">Low Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading patients from backend...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-destructive font-medium mb-2">⚠️ {error}</p>
                <p className="text-sm text-muted-foreground">Make sure the backend is running</p>
              </div>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No patients found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Adherence</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="cursor-pointer hover:bg-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{patient.condition}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(patient.status)}</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getAdherenceColor(patient.adherence || 75)}`}>
                        {patient.adherence || 75}%
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{patient.lastVisit}</TableCell>
                    <TableCell className="text-muted-foreground">{patient.nextAppointment || "TBD"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePatientAction(patient)}
                        >
                          AI Actions
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePatientAction(patient)}>
                              <User className="w-4 h-4 mr-2" />
                              AI Agent Actions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Phone className="w-4 h-4 mr-2" />
                              Call Patient
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Patient Actions Dialog */}
      {selectedPatient && (
        <PatientActionsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          patient={{
            id: selectedPatient.id,
            name: selectedPatient.name,
            condition: selectedPatient.condition,
          }}
        />
      )}
    </div>
  )
}
