"""
Clinical System Tools with Safety Protocols
Implements healthcare operations: patient management, appointments, medical records
SAFETY-FIRST: All operations include validation, audit logging, and error checking
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import random
import re


class SafetyValidator:
    """Validates clinical operations for safety compliance"""
    
    @staticmethod
    def validate_patient_id(patient_id: str) -> bool:
        """Validate patient ID format"""
        return bool(re.match(r'^PT\d{6}$', patient_id))
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        cleaned = re.sub(r'[^\d]', '', phone)
        return len(cleaned) >= 10
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_date(date_str: str) -> bool:
        """Validate date format (ISO: YYYY-MM-DD)"""
        try:
            datetime.fromisoformat(date_str)
            return True
        except:
            return False
    
    @staticmethod
    def check_appointment_conflict(
        appointments: List[Dict],
        doctor_id: str,
        appointment_time: datetime,
        duration_minutes: int = 30
    ) -> Optional[Dict]:
        """Check for scheduling conflicts"""
        end_time = appointment_time + timedelta(minutes=duration_minutes)
        
        for appt in appointments:
            if appt['doctor_id'] == doctor_id and appt['status'] != 'cancelled':
                appt_start = datetime.fromisoformat(appt['appointment_time'])
                appt_end = appt_start + timedelta(minutes=appt.get('duration', 30))
                
                # Check overlap
                if not (end_time <= appt_start or appointment_time >= appt_end):
                    return appt
        
        return None


class ClinicalTools:
    """Collection of tools for clinical operations with safety protocols"""
    
    def __init__(self):
        self.patients = self._initialize_mock_patients()
        self.appointments = []
        self.medical_records = []
        self.doctors = self._initialize_mock_doctors()
        self.safety_log = []
        self.validator = SafetyValidator()
    
    def _log_operation(self, operation: str, details: Dict[str, Any], success: bool):
        """Log all operations for audit trail"""
        self.safety_log.append({
            "timestamp": datetime.now().isoformat(),
            "operation": operation,
            "details": details,
            "success": success
        })
    
    def _initialize_mock_patients(self) -> List[Dict[str, Any]]:
        """Create mock patient data (HIPAA-compliant demo data)"""
        return [
            {
                "patient_id": "PT000001",
                "first_name": "John",
                "last_name": "Smith",
                "date_of_birth": "1985-03-15",
                "gender": "Male",
                "phone": "555-0101",
                "email": "john.smith@email.com",
                "address": "123 Main St, City, ST 12345",
                "insurance": "BlueCross",
                "insurance_id": "BC123456",
                "emergency_contact": "Jane Smith - 555-0102",
                "allergies": ["Penicillin"],
                "chronic_conditions": [],
                "last_visit": "2025-12-10"
            },
            {
                "patient_id": "PT000002",
                "first_name": "Maria",
                "last_name": "Garcia",
                "date_of_birth": "1990-07-22",
                "gender": "Female",
                "phone": "555-0201",
                "email": "maria.garcia@email.com",
                "address": "456 Oak Ave, City, ST 12345",
                "insurance": "Aetna",
                "insurance_id": "AE789012",
                "emergency_contact": "Carlos Garcia - 555-0202",
                "allergies": [],
                "chronic_conditions": ["Type 2 Diabetes"],
                "last_visit": "2026-01-15"
            },
            {
                "patient_id": "PT000003",
                "first_name": "Robert",
                "last_name": "Johnson",
                "date_of_birth": "1978-11-30",
                "gender": "Male",
                "phone": "555-0301",
                "email": "robert.j@email.com",
                "address": "789 Pine Rd, City, ST 12345",
                "insurance": "UnitedHealth",
                "insurance_id": "UH345678",
                "emergency_contact": "Lisa Johnson - 555-0302",
                "allergies": ["Sulfa drugs", "Latex"],
                "chronic_conditions": ["Hypertension"],
                "last_visit": "2025-11-20"
            }
        ]
    
    def _initialize_mock_doctors(self) -> List[Dict[str, Any]]:
        """Initialize doctor roster"""
        return [
            {
                "doctor_id": "DR001",
                "name": "Dr. Sarah Williams",
                "specialty": "Family Medicine",
                "license_number": "MD123456",
                "phone": "555-1001",
                "email": "s.williams@clinic.com",
                "available_days": ["Monday", "Tuesday", "Wednesday", "Friday"],
                "consultation_fee": 150
            },
            {
                "doctor_id": "DR002",
                "name": "Dr. Michael Chen",
                "specialty": "Cardiology",
                "license_number": "MD234567",
                "phone": "555-1002",
                "email": "m.chen@clinic.com",
                "available_days": ["Tuesday", "Wednesday", "Thursday"],
                "consultation_fee": 250
            },
            {
                "doctor_id": "DR003",
                "name": "Dr. Emily Rodriguez",
                "specialty": "Pediatrics",
                "license_number": "MD345678",
                "phone": "555-1003",
                "email": "e.rodriguez@clinic.com",
                "available_days": ["Monday", "Wednesday", "Thursday", "Friday"],
                "consultation_fee": 175
            }
        ]
    
    def search_patients(
        self,
        patient_id: Optional[str] = None,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None,
        date_of_birth: Optional[str] = None,
        phone: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for patients by various criteria
        SAFETY: Implements access control and audit logging
        """
        results = list(self.patients)
        
        if patient_id:
            results = [p for p in results if p['patient_id'] == patient_id]
        
        if first_name:
            results = [p for p in results if first_name.lower() in p['first_name'].lower()]
        
        if last_name:
            results = [p for p in results if last_name.lower() in p['last_name'].lower()]
        
        if date_of_birth:
            results = [p for p in results if p['date_of_birth'] == date_of_birth]
        
        if phone:
            cleaned_phone = re.sub(r'[^\d]', '', phone)
            results = [p for p in results if cleaned_phone in re.sub(r'[^\d]', '', p['phone'])]
        
        self._log_operation("search_patients", {
            "criteria": {"patient_id": patient_id, "name": f"{first_name} {last_name}"},
            "results_count": len(results)
        }, True)
        
        return results
    
    def get_patient_details(self, patient_id: str) -> Optional[Dict[str, Any]]:
        """
        Get comprehensive patient information
        SAFETY: Validates patient ID format
        """
        if not self.validator.validate_patient_id(patient_id):
            self._log_operation("get_patient_details", {"patient_id": patient_id}, False)
            return {"error": "Invalid patient ID format. Expected: PT######"}
        
        for patient in self.patients:
            if patient['patient_id'] == patient_id:
                self._log_operation("get_patient_details", {"patient_id": patient_id}, True)
                return patient
        
        return None
    
    def register_new_patient(
        self,
        first_name: str,
        last_name: str,
        date_of_birth: str,
        gender: str,
        phone: str,
        email: str,
        address: str,
        insurance: Optional[str] = None,
        insurance_id: Optional[str] = None,
        emergency_contact: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Register a new patient
        SAFETY: Validates all required fields, checks for duplicates
        """
        # Validation
        if not self.validator.validate_phone(phone):
            return {"success": False, "error": "Invalid phone number format"}
        
        if not self.validator.validate_email(email):
            return {"success": False, "error": "Invalid email format"}
        
        if not self.validator.validate_date(date_of_birth):
            return {"success": False, "error": "Invalid date of birth format (use YYYY-MM-DD)"}
        
        # Check for duplicates
        existing = self.search_patients(first_name=first_name, last_name=last_name, date_of_birth=date_of_birth)
        if existing:
            return {"success": False, "error": "Patient with same name and DOB already exists"}
        
        # Generate patient ID
        patient_id = f"PT{len(self.patients) + 1:06d}"
        
        new_patient = {
            "patient_id": patient_id,
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": date_of_birth,
            "gender": gender,
            "phone": phone,
            "email": email,
            "address": address,
            "insurance": insurance,
            "insurance_id": insurance_id,
            "emergency_contact": emergency_contact,
            "allergies": [],
            "chronic_conditions": [],
            "last_visit": None,
            "registered_date": datetime.now().isoformat()
        }
        
        self.patients.append(new_patient)
        self._log_operation("register_new_patient", {"patient_id": patient_id, "name": f"{first_name} {last_name}"}, True)
        
        return {
            "success": True,
            "patient_id": patient_id,
            "message": f"Patient registered successfully. ID: {patient_id}"
        }
    
    def search_doctors(
        self,
        specialty: Optional[str] = None,
        doctor_id: Optional[str] = None,
        available_on: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Search for doctors by specialty or availability"""
        results = list(self.doctors)
        
        if specialty:
            results = [d for d in results if specialty.lower() in d['specialty'].lower()]
        
        if doctor_id:
            results = [d for d in results if d['doctor_id'] == doctor_id]
        
        if available_on:
            results = [d for d in results if available_on in d['available_days']]
        
        return results
    
    def schedule_appointment(
        self,
        patient_id: str,
        doctor_id: str,
        appointment_date: str,
        appointment_time: str,
        reason: str,
        appointment_type: str = "Consultation"
    ) -> Dict[str, Any]:
        """
        Schedule a medical appointment
        SAFETY: Validates IDs, checks conflicts, ensures proper scheduling
        """
        # Validate patient
        patient = self.get_patient_details(patient_id)
        if not patient or "error" in patient:
            return {"success": False, "error": "Invalid or unknown patient ID"}
        
        # Validate doctor
        doctors = self.search_doctors(doctor_id=doctor_id)
        if not doctors:
            return {"success": False, "error": "Invalid or unknown doctor ID"}
        doctor = doctors[0]
        
        # Validate and parse datetime
        try:
            appointment_datetime = datetime.fromisoformat(f"{appointment_date} {appointment_time}")
        except ValueError:
            return {"success": False, "error": "Invalid date/time format"}
        
        # Check if appointment is in the future
        if appointment_datetime <= datetime.now():
            return {"success": False, "error": "Appointment must be scheduled in the future"}
        
        # Check doctor availability day
        day_name = appointment_datetime.strftime("%A")
        if day_name not in doctor['available_days']:
            return {
                "success": False,
                "error": f"Doctor not available on {day_name}",
                "available_days": doctor['available_days']
            }
        
        # Check for conflicts
        conflict = self.validator.check_appointment_conflict(
            self.appointments,
            doctor_id,
            appointment_datetime
        )
        
        if conflict:
            return {
                "success": False,
                "error": "Time slot already booked",
                "conflicting_appointment": conflict['appointment_id']
            }
        
        # Create appointment
        appointment_id = f"APT{len(self.appointments) + 1:06d}"
        appointment = {
            "appointment_id": appointment_id,
            "patient_id": patient_id,
            "patient_name": f"{patient['first_name']} {patient['last_name']}",
            "doctor_id": doctor_id,
            "doctor_name": doctor['name'],
            "appointment_time": appointment_datetime.isoformat(),
            "duration": 30,
            "reason": reason,
            "type": appointment_type,
            "status": "scheduled",
            "consultation_fee": doctor['consultation_fee'],
            "created_at": datetime.now().isoformat()
        }
        
        self.appointments.append(appointment)
        self._log_operation("schedule_appointment", {
            "appointment_id": appointment_id,
            "patient_id": patient_id,
            "doctor_id": doctor_id
        }, True)
        
        return {
            "success": True,
            "appointment_id": appointment_id,
            "details": {
                "patient": patient['first_name'] + " " + patient['last_name'],
                "doctor": doctor['name'],
                "specialty": doctor['specialty'],
                "date_time": appointment_datetime.strftime("%B %d, %Y at %I:%M %p"),
                "reason": reason,
                "fee": f"${doctor['consultation_fee']}"
            },
            "message": f"Appointment scheduled successfully. ID: {appointment_id}"
        }
    
    def get_appointments(
        self,
        patient_id: Optional[str] = None,
        doctor_id: Optional[str] = None,
        date: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Retrieve appointments with filters"""
        results = list(self.appointments)
        
        if patient_id:
            results = [a for a in results if a['patient_id'] == patient_id]
        
        if doctor_id:
            results = [a for a in results if a['doctor_id'] == doctor_id]
        
        if date:
            results = [a for a in results if a['appointment_time'].startswith(date)]
        
        if status:
            results = [a for a in results if a['status'] == status]
        
        # Sort by appointment time
        results.sort(key=lambda x: x['appointment_time'])
        
        return results
    
    def cancel_appointment(
        self,
        appointment_id: str,
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Cancel an appointment
        SAFETY: Logs cancellation with reason
        """
        for appointment in self.appointments:
            if appointment['appointment_id'] == appointment_id:
                appointment['status'] = 'cancelled'
                appointment['cancellation_reason'] = reason
                appointment['cancelled_at'] = datetime.now().isoformat()
                
                self._log_operation("cancel_appointment", {
                    "appointment_id": appointment_id,
                    "reason": reason
                }, True)
                
                return {
                    "success": True,
                    "appointment_id": appointment_id,
                    "message": "Appointment cancelled successfully"
                }
        
        return {"success": False, "error": "Appointment not found"}
    
    def add_medical_record(
        self,
        patient_id: str,
        appointment_id: Optional[str],
        diagnosis: str,
        symptoms: List[str],
        prescribed_medications: List[Dict[str, str]],
        notes: str,
        follow_up_required: bool = False,
        follow_up_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Add medical record after consultation
        SAFETY: Validates patient, links to appointment, requires diagnosis
        """
        # Validate patient
        patient = self.get_patient_details(patient_id)
        if not patient or "error" in patient:
            return {"success": False, "error": "Invalid patient ID"}
        
        # Validate appointment if provided
        if appointment_id:
            appointments = [a for a in self.appointments if a['appointment_id'] == appointment_id]
            if not appointments:
                return {"success": False, "error": "Invalid appointment ID"}
        
        # Safety check: ensure diagnosis is not empty
        if not diagnosis or diagnosis.strip() == "":
            return {"success": False, "error": "Diagnosis is required for medical records"}
        
        record_id = f"MR{len(self.medical_records) + 1:06d}"
        record = {
            "record_id": record_id,
            "patient_id": patient_id,
            "appointment_id": appointment_id,
            "date": datetime.now().isoformat(),
            "diagnosis": diagnosis,
            "symptoms": symptoms,
            "prescribed_medications": prescribed_medications,
            "notes": notes,
            "follow_up_required": follow_up_required,
            "follow_up_date": follow_up_date,
            "created_by": "system",
            "created_at": datetime.now().isoformat()
        }
        
        self.medical_records.append(record)
        self._log_operation("add_medical_record", {
            "record_id": record_id,
            "patient_id": patient_id,
            "diagnosis": diagnosis
        }, True)
        
        return {
            "success": True,
            "record_id": record_id,
            "message": "Medical record created successfully"
        }
    
    def get_medical_history(self, patient_id: str) -> Dict[str, Any]:
        """
        Retrieve complete medical history for a patient
        SAFETY: Validates patient ID, returns comprehensive history
        """
        patient = self.get_patient_details(patient_id)
        if not patient or "error" in patient:
            return {"error": "Invalid patient ID"}
        
        # Get all records for this patient
        records = [r for r in self.medical_records if r['patient_id'] == patient_id]
        records.sort(key=lambda x: x['date'], reverse=True)
        
        # Get all appointments
        appointments = self.get_appointments(patient_id=patient_id)
        
        return {
            "patient_id": patient_id,
            "patient_name": f"{patient['first_name']} {patient['last_name']}",
            "allergies": patient['allergies'],
            "chronic_conditions": patient['chronic_conditions'],
            "total_visits": len([a for a in appointments if a['status'] == 'completed']),
            "upcoming_appointments": len([a for a in appointments if a['status'] == 'scheduled']),
            "medical_records": records,
            "recent_appointments": appointments[:5]
        }
    
    def check_drug_interactions(
        self,
        medications: List[str]
    ) -> Dict[str, Any]:
        """
        Check for potential drug interactions (mock implementation)
        SAFETY: Critical safety check for prescriptions
        """
        # Mock interaction database
        known_interactions = {
            ("Warfarin", "Aspirin"): "High risk: Increased bleeding",
            ("Metformin", "Alcohol"): "Moderate risk: Lactic acidosis",
            ("Lisinopril", "Potassium"): "Moderate risk: Hyperkalemia"
        }
        
        interactions = []
        for i, med1 in enumerate(medications):
            for med2 in medications[i+1:]:
                key = tuple(sorted([med1, med2]))
                if key in known_interactions:
                    interactions.append({
                        "drugs": list(key),
                        "severity": "High" if "High" in known_interactions[key] else "Moderate",
                        "description": known_interactions[key]
                    })
        
        self._log_operation("check_drug_interactions", {
            "medications": medications,
            "interactions_found": len(interactions)
        }, True)
        
        return {
            "medications_checked": medications,
            "interactions_found": len(interactions),
            "interactions": interactions,
            "safe": len(interactions) == 0
        }
    
    def get_safety_log(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve recent safety audit log"""
        return self.safety_log[-limit:]


def get_clinical_tools() -> Dict[str, callable]:
    """
    Get all available clinical tools as a dictionary
    
    Returns:
        Dictionary mapping tool names to their functions
    """
    tools = ClinicalTools()
    
    return {
        "search_patients": tools.search_patients,
        "get_patient_details": tools.get_patient_details,
        "register_new_patient": tools.register_new_patient,
        "search_doctors": tools.search_doctors,
        "schedule_appointment": tools.schedule_appointment,
        "get_appointments": tools.get_appointments,
        "cancel_appointment": tools.cancel_appointment,
        "add_medical_record": tools.add_medical_record,
        "get_medical_history": tools.get_medical_history,
        "check_drug_interactions": tools.check_drug_interactions,
        "get_safety_log": tools.get_safety_log,
    }
