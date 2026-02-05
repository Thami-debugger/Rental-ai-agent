"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { DashboardView } from "@/components/views/dashboard-view"
import { PatientsView } from "@/components/views/patients-view"
import { RiskScoringView } from "@/components/views/risk-scoring-view"
import { AIAgentView } from "@/components/views/ai-agent-view"
import { WorkflowsView } from "@/components/views/workflows-view"
import { SchedulingView } from "@/components/views/scheduling-view"
import { AnalyticsView } from "@/components/views/analytics-view"
import { ComplianceView } from "@/components/views/compliance-view"

export default function ClinicalAIPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />
      case "patients":
        return <PatientsView />
      case "risk-scoring":
        return <RiskScoringView />
      case "ai-agent":
        return <AIAgentView />
      case "workflows":
        return <WorkflowsView />
      case "scheduling":
        return <SchedulingView />
      case "analytics":
        return <AnalyticsView />
      case "compliance":
        return <ComplianceView />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
