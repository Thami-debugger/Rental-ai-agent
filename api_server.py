"""
FastAPI Backend for Clinical AI Agent
Connects the Next.js frontend with the Python LangChain agent
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import os
import json
import re
from pathlib import Path

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, AIMessage

from clinical_tools import ClinicalTools

load_dotenv()

# ============================================================================
# FASTAPI APP SETUP
# ============================================================================

app = FastAPI(
    title="Clinical AI Agent API",
    description="Backend API for clinical agent dashboard",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# PYDANTIC MODELS
# ============================================================================

class PatientQuery(BaseModel):
    patient_id: str
    question: str

class DoctorSearch(BaseModel):
    specialty: Optional[str] = None
    available_day: Optional[str] = None

class AppointmentRequest(BaseModel):
    patient_id: str
    doctor_id: str
    appointment_time: str
    reason: str
    appointment_type: str = "checkup"

class MedicationCheck(BaseModel):
    medication1: str
    medication2: str

class AgentAction(BaseModel):
    patient_id: str
    action_type: str  # "sms", "call", "escalation", "reminder"
    details: Dict

class PatientHistory(BaseModel):
    patient_id: str

# ============================================================================
# LANGCHAIN TOOLS
# ============================================================================

@tool
def search_patients(patient_id: str = None, last_name: str = None) -> str:
    """Search for patients by ID or last name"""
    try:
        clinical = ClinicalTools()
        results = clinical.search_patients(patient_id=patient_id, last_name=last_name)
        return json.dumps(results, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@tool
def search_doctors(specialty: str = None, available_day: str = None) -> str:
    """Search for doctors by specialty or availability"""
    try:
        clinical = ClinicalTools()
        results = clinical.search_doctors(specialty=specialty, available_day=available_day)
        return json.dumps(results, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@tool
def schedule_appointment(patient_id: str, doctor_id: str, appointment_time: str, 
                         reason: str, appointment_type: str = "checkup") -> str:
    """Schedule an appointment for a patient"""
    try:
        clinical = ClinicalTools()
        result = clinical.schedule_appointment(
            patient_id=patient_id,
            doctor_id=doctor_id,
            appointment_time=appointment_time,
            reason=reason,
            appointment_type=appointment_type
        )
        return json.dumps(result)
    except Exception as e:
        return json.dumps({"error": str(e)})

@tool
def get_medical_history(patient_id: str) -> str:
    """Get medical history for a patient"""
    try:
        clinical = ClinicalTools()
        result = clinical.get_medical_history(patient_id=patient_id)
        return json.dumps(result, indent=2)
    except Exception as e:
        return json.dumps({"error": str(e)})

@tool
def check_drug_interactions(medication1: str, medication2: str) -> str:
    """Check for drug interactions between two medications"""
    try:
        clinical = ClinicalTools()
        result = clinical.check_drug_interactions(medication1=medication1, medication2=medication2)
        return json.dumps(result)
    except Exception as e:
        return json.dumps({"error": str(e)})

# ============================================================================
# AGENT INITIALIZATION
# ============================================================================

def init_agent():
    """Initialize LangChain agent that DIRECTLY uses clinical tools"""
    llm = ChatOpenAI(
        model="gpt-4",
        temperature=0.3,
        api_key=os.getenv("OPENAI_API_KEY")
    )
    
    # Create a simple agent that uses tools directly
    class DirectToolAgent:
        def __init__(self, llm):
            self.llm = llm
            self.clinical = ClinicalTools()
            
        def invoke(self, input_data):
            user_input = input_data.get("input", "").lower()
            
            # ALWAYS try to get patient data first when patient ID or name is mentioned
            print(f"\n🔍 Processing query: {user_input}")
            
            # Try to extract patient identifier
            patient_id = None
            patient_name = None
            
            # Check for patient IDs (PT000001, P-1024, etc.)
            id_match = re.search(r'\b(P[T-]?\d+|PT\d{6})\b', user_input, re.IGNORECASE)
            if id_match:
                patient_id = id_match.group(1).upper()
                print(f"✅ Found patient ID: {patient_id}")
            
            # Check for common names
            if "john" in user_input and "doe" in user_input:
                patient_id = "PT000001"
                print(f"✅ Identified John Doe as PT000001")
            elif "maria" in user_input or "garcia" in user_input:
                patient_id = "PT000002"
                print(f"✅ Identified Maria Garcia as PT000002")
            elif "robert" in user_input or "johnson" in user_input:
                patient_id = "PT000003"
                print(f"✅ Identified Robert Johnson as PT000003")
            
            # Get medical history if patient ID found
            if patient_id:
                try:
                    history = self.clinical.get_medical_history(patient_id=patient_id)
                    print(f"✅ Retrieved medical history for {patient_id}")
                    return {"output": f"Medical History for Patient {patient_id}:\\n{json.dumps(history, indent=2)}"}
                except Exception as e:
                    print(f"❌ Error getting history: {e}")
                    return {"output": f"Error retrieving patient history: {str(e)}"}
            
            # Check for drug interactions
            if "interaction" in user_input or "drug" in user_input:
                # Extract medication names
                meds = re.findall(r'\b(aspirin|ibuprofen|acetaminophen|warfarin|metformin|lisinopril|potassium|alcohol)\b', user_input, re.IGNORECASE)
                if len(meds) >= 2:
                    try:
                        interaction = self.clinical.check_drug_interactions(meds[:2])
                        print(f"✅ Checked interactions between {meds[0]} and {meds[1]}")
                        return {"output": f"Drug Interaction Check:\\n{json.dumps(interaction, indent=2)}"}
                    except Exception as e:
                        print(f"❌ Error checking interactions: {e}")
                        return {"output": f"Error checking interactions: {str(e)}"}
            
            # Search for patients
            if "search" in user_input or "find" in user_input or "list" in user_input or "show" in user_input:
                try:
                    patients = self.clinical.search_patients()
                    print(f"✅ Retrieved patient list")
                    return {"output": f"Available Patients:\\n{json.dumps(patients, indent=2)}"}
                except Exception as e:
                    print(f"❌ Error searching patients: {e}")
                    return {"output": f"Error retrieving patients: {str(e)}"}
            
            # Default: use LLM to answer
            print("📝 Using LLM to answer query")
            response = self.llm.invoke([HumanMessage(content=user_input)])
            return {"output": response.content}
    
    return DirectToolAgent(llm)

agent = init_agent()

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Clinical AI Agent API"
    }

@app.post("/api/agent/query")
async def agent_query(query: PatientQuery):
    """Send a query to the agent"""
    try:
        prompt = f"Patient {query.patient_id}: {query.question}"
        response = agent.invoke({"input": prompt})
        
        return {
            "status": "success",
            "patient_id": query.patient_id,
            "query": query.question,
            "response": response.get("output", "No response"),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/patients/search")
async def search_patients_endpoint(patient_id: Optional[str] = None, last_name: Optional[str] = None):
    """Search for patients"""
    try:
        result = await search_patients(patient_id=patient_id, last_name=last_name)
        return json.loads(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/patients/{patient_id}/history")
async def get_patient_history(patient_id: str):
    """Get patient's medical history"""
    try:
        result = await get_medical_history(patient_id=patient_id)
        return json.loads(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/doctors/search")
async def search_doctors_endpoint(search: DoctorSearch):
    """Search for doctors"""
    try:
        result = await search_doctors(specialty=search.specialty, available_day=search.available_day)
        return json.loads(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/appointments/schedule")
async def schedule_appointment_endpoint(appointment: AppointmentRequest):
    """Schedule an appointment"""
    try:
        result = await schedule_appointment(
            patient_id=appointment.patient_id,
            doctor_id=appointment.doctor_id,
            appointment_time=appointment.appointment_time,
            reason=appointment.reason,
            appointment_type=appointment.appointment_type
        )
        return json.loads(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/medications/check-interactions")
async def check_interactions(check: MedicationCheck):
    """Check drug interactions"""
    try:
        result = await check_drug_interactions(
            medication1=check.medication1,
            medication2=check.medication2
        )
        return json.loads(result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/agent/actions")
async def agent_action(action: AgentAction):
    """Log or execute agent action (SMS, Call, Escalation, etc.)"""
    try:
        action_log = {
            "patient_id": action.patient_id,
            "action_type": action.action_type,
            "details": action.details,
            "timestamp": datetime.now().isoformat(),
            "status": "completed"
        }
        
        # Save action to log
        log_file = Path(".agent_actions") / f"{action.patient_id}_actions.json"
        log_file.parent.mkdir(exist_ok=True)
        
        existing = []
        if log_file.exists():
            with open(log_file, 'r') as f:
                existing = json.load(f)
        
        existing.append(action_log)
        
        with open(log_file, 'w') as f:
            json.dump(existing, f, indent=2)
        
        return {
            "status": "success",
            "action": action_log,
            "message": f"{action.action_type.upper()} action logged for {action.patient_id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agent/actions/{patient_id}")
async def get_agent_actions(patient_id: str):
    """Get agent actions for a patient"""
    try:
        log_file = Path(".agent_actions") / f"{patient_id}_actions.json"
        
        if not log_file.exists():
            return {"patient_id": patient_id, "actions": []}
        
        with open(log_file, 'r') as f:
            actions = json.load(f)
        
        return {
            "patient_id": patient_id,
            "actions": actions,
            "total": len(actions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard/summary")
async def get_dashboard_summary():
    """Get dashboard summary data"""
    try:
        # Count total patients and recent actions
        actions_dir = Path(".agent_actions")
        total_actions = 0
        total_patients = set()
        
        if actions_dir.exists():
            for file in actions_dir.glob("*_actions.json"):
                patient_id = file.stem.replace('_actions', '')
                total_patients.add(patient_id)
                
                with open(file, 'r') as f:
                    actions = json.load(f)
                    total_actions += len(actions)
        
        return {
            "total_patients": len(total_patients),
            "total_actions": total_actions,
            "timestamp": datetime.now().isoformat(),
            "status": "operational",
            "recent_patients": list(total_patients)[-10:]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
