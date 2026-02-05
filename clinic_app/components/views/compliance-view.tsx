"use client"

import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Key,
  Lock,
  RefreshCw,
  Shield,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const complianceChecks = [
  { name: "HIPAA Compliance", status: "passed", lastCheck: "2 hours ago" },
  { name: "GDPR Data Protection", status: "passed", lastCheck: "2 hours ago" },
  { name: "Schema Validation", status: "passed", lastCheck: "5 min ago" },
  { name: "Audit Logging", status: "passed", lastCheck: "Real-time" },
  { name: "Access Control (RBAC)", status: "passed", lastCheck: "2 hours ago" },
  { name: "Data Encryption", status: "passed", lastCheck: "24 hours ago" },
]

const guardrails = [
  {
    name: "Schema Validation",
    description: "Strict JSON validation ensures AI output matches format before processing",
    status: "active",
    icon: CheckCircle2,
  },
  {
    name: "Constrained Actions",
    description: "AI must select from pre-defined action list (enum). No free text execution.",
    status: "active",
    icon: Lock,
  },
  {
    name: "Risk Thresholds",
    description: "Mandatory human review for all HIGH-risk scores (>0.90)",
    status: "active",
    icon: AlertTriangle,
  },
  {
    name: "Audit Logging",
    description: "All AI decisions and actions are logged for compliance review",
    status: "active",
    icon: FileText,
  },
]

const failureModes = [
  {
    name: "Hallucinated Certainty",
    risk: "Model sounds confident but is factually wrong",
    mitigation: "Audit logs & retrieval augmented generation",
    status: "mitigated",
  },
  {
    name: "Prompt Drift",
    risk: "Updates change behavior unexpectedly",
    mitigation: "Regression testing suite",
    status: "mitigated",
  },
  {
    name: "Silent Truncation",
    risk: "Data loss due to token limits",
    mitigation: "Context window monitoring",
    status: "mitigated",
  },
]

const recentAuditLogs = [
  {
    id: 1,
    action: "Risk Score Generated",
    patient: "P-1024",
    user: "AI Agent",
    details: "Score: 0.92, Level: HIGH",
    time: "2 min ago",
  },
  {
    id: 2,
    action: "Escalation Triggered",
    patient: "P-1024",
    user: "AI Agent",
    details: "Escalated to Nurse Queue",
    time: "2 min ago",
  },
  {
    id: 3,
    action: "Patient Record Accessed",
    patient: "P-2156",
    user: "Dr. Sarah Chen",
    details: "View patient history",
    time: "15 min ago",
  },
  {
    id: 4,
    action: "SMS Action Executed",
    patient: "P-3891",
    user: "AI Agent",
    details: "Reminder sent successfully",
    time: "32 min ago",
  },
]

const accessRoles = [
  { role: "Participant", access: ["Mobile App", "Notifications", "Confirmations"] },
  { role: "Clinic Admin", access: ["Dashboard", "Scheduling", "Workflow Alerts"] },
  { role: "Clinical Staff", access: ["Medical Files", "Patient History", "Notes"] },
  { role: "Lab/Pharmacy", access: ["Task View", "Processing Orders"] },
]

export function ComplianceView() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Compliance & Safety</h1>
        <p className="text-muted-foreground">
          Production guardrails, safety protocols, and regulatory compliance
        </p>
      </div>

      {/* Compliance Status Banner */}
      <Card className="border-0 shadow-sm bg-success/10 border-l-4 border-l-success">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-success" />
            <div>
              <p className="font-semibold text-success">All Systems Compliant</p>
              <p className="text-sm text-muted-foreground">
                All safety protocols and compliance checks are passing. Last full audit: 2 hours ago.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">6/6</p>
                <p className="text-xs text-muted-foreground">Checks Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Active Guardrails</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">12.4K</p>
                <p className="text-xs text-muted-foreground">Audit Entries Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Violations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Production Guardrails */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Production Guardrails</CardTitle>
              <CardDescription>
                AI output is untrusted input. These safeguards ensure safe operation.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guardrails.map((guardrail) => (
                <div
                  key={guardrail.name}
                  className="p-4 rounded-lg border border-border bg-secondary/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <guardrail.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium">{guardrail.name}</span>
                    <Badge className="bg-success/20 text-success text-[10px] ml-auto">Active</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{guardrail.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Failure Mode Management */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Failure Mode Management</CardTitle>
              <CardDescription>
                AI fails quietly. We design for uncertainty to ensure reliability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {failureModes.map((mode) => (
                <div key={mode.name} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{mode.name}</span>
                    <Badge className="bg-success/20 text-success text-[10px]">Mitigated</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Risk</p>
                      <p className="text-destructive">{mode.risk}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mitigation</p>
                      <p className="text-success">{mode.mitigation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Audit Logs */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Audit Logs</CardTitle>
                  <CardDescription>All AI decisions and system actions are logged</CardDescription>
                </div>
                <Badge variant="outline" className="font-normal">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Real-time
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.action}</span>
                      <Badge variant="outline" className="text-[10px]">
                        {log.patient}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {log.user} - {log.details}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{log.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compliance Checks */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Compliance Checks</CardTitle>
              <CardDescription>Regulatory and security status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceChecks.map((check) => (
                <div
                  key={check.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm">{check.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{check.lastCheck}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Role-Based Access */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Access Control (RBAC)</CardTitle>
              <CardDescription>Role-based data access policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {accessRoles.map((role) => (
                <div key={role.role} className="p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{role.role}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {role.access.map((item) => (
                      <Badge key={item} variant="outline" className="text-[10px]">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Security Note */}
          <Card className="border-0 shadow-sm border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">End-to-End Encryption</p>
                  <p className="text-xs text-muted-foreground">
                    All patient data is encrypted in transit and at rest. Keys are managed via secure
                    vault with automatic rotation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
