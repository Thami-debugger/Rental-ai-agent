"""
Clinical AI Assistant with Patient-Based Persistent Memory
Simple LangChain integration using file-based storage per patient
"""

import os
from typing import Dict, List, Optional
from dotenv import load_dotenv
from datetime import datetime
import json
from pathlib import Path
import re

# LangChain imports
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

# Local imports
from clinical_tools import ClinicalTools

load_dotenv()

# ============================================================================
# PATIENT-BASED MEMORY MANAGER
# ============================================================================

class PatientMemoryManager:
    """Manages separate conversation histories per patient"""
    
    def __init__(self, storage_dir: str = ".patient_conversations"):
        self.storage_dir = Path(storage_dir)
        self.storage_dir.mkdir(exist_ok=True)
        self.current_patient = None
    
    def get_patient_file(self, patient_id: str) -> Path:
        """Get file path for patient's conversation history"""
        return self.storage_dir / f"{patient_id}_history.json"
    
    def load_patient_memory(self, patient_id: str) -> List[Dict]:
        """Load previous conversation history for a patient"""
        file_path = self.get_patient_file(patient_id)
        
        if file_path.exists():
            with open(file_path, 'r') as f:
                history = json.load(f)
                return history
        return []
    
    def save_patient_memory(self, patient_id: str, messages: List[Dict]) -> None:
        """Save conversation history for a patient"""
        file_path = self.get_patient_file(patient_id)
        
        with open(file_path, 'w') as f:
            json.dump(messages, f, indent=2, default=str)
    
    def switch_patient(self, patient_id: str) -> None:
        """Switch to a different patient"""
        history = self.load_patient_memory(patient_id)
        self.current_patient = patient_id
        
        if not history:
            print(f"\n📝 Starting new conversation with {patient_id}")
        else:
            print(f"\n📚 Loaded {len(history)} previous messages for {patient_id}")
        
        print(f"👤 Current patient: {patient_id}")
    
    def add_message(self, patient_id: str, role: str, content: str) -> None:
        """Add a message to patient's history"""
        history = self.load_patient_memory(patient_id)
        history.append({
            'type': role,
            'content': content,
            'timestamp': datetime.now().isoformat()
        })
        self.save_patient_memory(patient_id, history)
    
    def get_all_patients(self) -> List[str]:
        """Get list of all patients with conversation history"""
        files = list(self.storage_dir.glob("*_history.json"))
        patients = [f.stem.replace('_history', '') for f in files]
        return sorted(patients)
    
    def get_patient_summary(self, patient_id: str) -> Dict:
        """Get summary of patient's conversation history"""
        history = self.load_patient_memory(patient_id)
        return {
            'patient_id': patient_id,
            'total_messages': len(history),
            'last_updated': history[-1]['timestamp'] if history else None,
            'human_messages': len([m for m in history if m['type'] == 'human']),
            'ai_messages': len([m for m in history if m['type'] == 'ai']),
        }
    
    def clear_patient_history(self, patient_id: str) -> None:
        """Clear conversation history for a patient"""
        file_path = self.get_patient_file(patient_id)
        if file_path.exists():
            file_path.unlink()
            print(f"🗑️  Cleared history for {patient_id}")
    
    def get_patient_context(self, patient_id: str) -> str:
        """Get patient's recent conversation as context"""
        history = self.load_patient_memory(patient_id)
        
        if not history:
            return ""
        
        # Get last 5 messages
        recent = history[-5:]
        context_lines = []
        
        for msg in recent:
            role = "Patient" if msg['type'] == 'human' else "Assistant"
            context_lines.append(f"{role}: {msg['content'][:100]}")
        
        return "\n".join(context_lines)


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
# LANGCHAIN CLINICAL AGENT WITH PATIENT MEMORY
# ============================================================================

class LangChainPatientAgent:
    """LangChain-based Clinical Agent with patient-based memory"""
    
    def __init__(self):
        # Initialize patient memory manager
        self.memory_manager = PatientMemoryManager()
        
        # Initialize LLM
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.3,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        # Initialize tools
        self.tools = [
            search_patients,
            search_doctors,
            schedule_appointment,
            get_medical_history,
            check_drug_interactions
        ]
        
        # Create agent with tools
        self.agent = create_react_agent(
            self.llm,
            self.tools
        )
    
    def detect_patient_from_input(self, user_input: str) -> Optional[str]:
        """Detect patient ID from user input"""
        match = re.search(r'PT\d{6}', user_input)
        return match.group(0) if match else None
    
    def process_input(self, user_input: str) -> str:
        """Process user input and route to correct patient"""
        
        # Check if input specifies a patient
        detected_patient = self.detect_patient_from_input(user_input)
        
        if detected_patient:
            # Switch to this patient
            self.memory_manager.switch_patient(detected_patient)
            
            # Save user message
            self.memory_manager.add_message(detected_patient, 'human', user_input)
            
            # Get patient context
            context = self.memory_manager.get_patient_context(detected_patient)
            
            # Create input with patient context
            if context:
                full_input = f"Patient {detected_patient} (Recent context:\n{context})\n\nNew request: {user_input}"
            else:
                full_input = f"Patient {detected_patient}: {user_input}"
            
            try:
                # Run agent
                print("\n🧠 Processing...", end="", flush=True)
                response = self.agent.invoke({"input": full_input})
                output = response.get('output', 'No response')
                print("\r             ", end="\r")  # Clear line
                
                # Save AI response
                self.memory_manager.add_message(detected_patient, 'ai', output)
                
                return output
            except Exception as e:
                print("\r             ", end="\r")
                return f"Error: {str(e)}"
        else:
            if self.memory_manager.current_patient:
                # Use current patient
                self.memory_manager.add_message(self.memory_manager.current_patient, 'human', user_input)
                
                context = self.memory_manager.get_patient_context(self.memory_manager.current_patient)
                
                if context:
                    full_input = f"Patient {self.memory_manager.current_patient} (Recent context:\n{context})\n\nNew request: {user_input}"
                else:
                    full_input = f"Patient {self.memory_manager.current_patient}: {user_input}"
                
                try:
                    print("\n🧠 Processing...", end="", flush=True)
                    response = self.agent.invoke({"input": full_input})
                    output = response.get('output', 'No response')
                    print("\r             ", end="\r")
                    
                    self.memory_manager.add_message(self.memory_manager.current_patient, 'ai', output)
                    return output
                except Exception as e:
                    print("\r             ", end="\r")
                    return f"Error: {str(e)}"
            else:
                return "Please specify a patient ID (e.g., 'PT000001') in your message."
    
    def show_patient_history(self, patient_id: str) -> None:
        """Display conversation history for a patient"""
        history = self.memory_manager.load_patient_memory(patient_id)
        
        print(f"\n{'='*60}")
        print(f"📋 Conversation History for {patient_id}")
        print(f"{'='*60}")
        
        if not history:
            print("No history found.")
            return
        
        for msg in history:
            role = "👤 You" if msg['type'] == 'human' else "🤖 Agent"
            content = msg['content'][:200] + "..." if len(msg['content']) > 200 else msg['content']
            timestamp = msg.get('timestamp', 'Unknown')
            print(f"\n{role} [{timestamp[:10]}]:")
            print(f"   {content}")
    
    def list_all_patients(self) -> None:
        """List all patients with conversation history"""
        patients = self.memory_manager.get_all_patients()
        
        print(f"\n{'='*60}")
        print(f"📂 Patients with Conversation History ({len(patients)})")
        print(f"{'='*60}")
        
        if not patients:
            print("No patients yet.")
            return
        
        for patient_id in patients:
            summary = self.memory_manager.get_patient_summary(patient_id)
            marker = " 👤" if patient_id == self.memory_manager.current_patient else ""
            print(f"\n{patient_id}{marker}")
            print(f"   Messages: {summary['total_messages']} ({summary['human_messages']} questions, {summary['ai_messages']} responses)")
            print(f"   Last: {summary['last_updated']}")


# ============================================================================
# CLI INTERFACE
# ============================================================================

def show_welcome():
    """Display welcome message"""
    print(f"\n{'='*60}")
    print("🏥 Clinical AI Assistant - Patient Memory System")
    print("Persistent conversation history per patient")
    print(f"{'='*60}")
    print("\n📝 Commands:")
    print("   /list              - Show all patients")
    print("   /history PT000001   - Show patient history")
    print("   /clear PT000001     - Clear patient history")
    print("   /help              - Show this help")
    print("   /quit              - Exit")
    print("\n💡 Try these:")
    print("   'Find patient PT000001'")
    print("   'PT000001 what is my medical history'")
    print("   'Check PT000001 PT000002'  (then ask questions)")
    print("\n💡 First message MUST have patient ID (PT######)")
    print(f"{'='*60}\n")


def main():
    """Main CLI loop"""
    show_welcome()
    
    agent = LangChainPatientAgent()
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if not user_input:
                continue
            
            # Commands
            if user_input.lower() == "/quit":
                print("\n👋 Goodbye!")
                break
            
            elif user_input.lower() == "/help":
                show_welcome()
                continue
            
            elif user_input.lower() == "/list":
                agent.list_all_patients()
                continue
            
            elif user_input.lower().startswith("/history "):
                parts = user_input.split()
                if len(parts) > 1:
                    patient_id = parts[1]
                    agent.show_patient_history(patient_id)
                continue
            
            elif user_input.lower().startswith("/clear "):
                parts = user_input.split()
                if len(parts) > 1:
                    patient_id = parts[1]
                    agent.memory_manager.clear_patient_history(patient_id)
                continue
            
            # Process query
            response = agent.process_input(user_input)
            print(f"\n🤖 Agent: {response}\n")
        
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}\n")


if __name__ == "__main__":
    main()
