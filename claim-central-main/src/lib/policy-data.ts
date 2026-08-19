// Mock "policy master" lookup — in production this would be an API call
// (e.g. GET /api/policy/lookup?cardOrCnic=...) that hits the underwriting DB.

export interface dependent {
  id: string;
  name: string;
  relation: "Self" | "Spouse" | "Son" | "Daughter" | "Parent";
  dob: string;
  age: number;
  gender: "Male" | "Female";
  healthcareNo: string;
  balanceLimit: string;
  roomEntitlement: string;
}

export interface policy {
  cardOrCnic: string;
  clientId: string;
  clientName: string;
  policyNo: string;
  policyPeriod: string;
  employeeInfo: {
    empId: string;
    empName: string;
    designation: string;
  };
  deptList: string[];
  underwritingTerms: string[];
  dependent: dependent[];
}

export const causeOfLossOptions = [
  "OPD",
  "IPD",
  "Emergency",
  "Maternity",
  "Special Case",
  "Other",
] as const;

export const benefitsByCause: Record<(typeof causeOfLossOptions)[number], string[]> = {
  OPD: ["Consultation", "Diagnostics", "Medicines", "Dental Services"],
  IPD: ["Room & Board", "Surgery", "Diagnostics", "Specialist Services"],
  Emergency: ["Emergency Room", "Ambulance", "Accident Treatment", "Emergency Surgery"],
  Maternity: ["DNC", "Abortion", "Normal Delivery", "C-Section", "Prenatal Care"],
  "Special Case": ["PET Scan", "Dentistry Services", "Physiotherapy", "Rehabilitation"],
  Other: ["PET Scan", "Dentistry Services", "Diagnostics", "Custom Treatment"],
};

export const policyDatabase: policy[] = [
  {
    cardOrCnic: "000046",
    clientId: "CL-1042",
    clientName: "Expert Hazard and Waste Management Solutions",
    policyNo: "PIHGCDP00011/25",
    policyPeriod: "01/12/2025 – 30/11/2026",
    employeeInfo: {
      empId: "EHW-0046",
      empName: "Ajmal Kausar",
      designation: "Site Supervisor",
    },
    deptList: ["Operations", "Field Services", "HSE"],
    underwritingTerms: ["PET Scan", "Dentistry Services", "Physiotherapy", "Pre-authorization required"],
    dependent: [
      {
        id: "FM-0046-0",
        name: "Ajmal Kausar",
        relation: "Self",
        dob: "14/03/1985",
        age: 41,
        gender: "Male",
        healthcareNo: "GC25-EHWM-1100-0046",
        balanceLimit: "80,000",
        roomEntitlement: "10,000",
      },
      {
        id: "FM-0046-1",
        name: "Atifa Ajmal",
        relation: "Spouse",
        dob: "23/12/1989",
        age: 36,
        gender: "Female",
        healthcareNo: "GC25-EHWM-1100-0046-1",
        balanceLimit: "80,000",
        roomEntitlement: "10,000",
      },
      {
        id: "FM-0046-2",
        name: "Zara Ajmal",
        relation: "Daughter",
        dob: "05/06/2015",
        age: 11,
        gender: "Female",
        healthcareNo: "GC25-EHWM-1100-0046-2",
        balanceLimit: "40,000",
        roomEntitlement: "10,000",
      },
    ],
  },
  {
    cardOrCnic: "42101-1234567-9",
    clientId: "CL-1187",
    clientName: "Ocean Network Express Pakistan (Private) Limited",
    policyNo: "PIHGCDP00002/25",
    policyPeriod: "01/01/2026 – 31/12/2026",
    employeeInfo: {
      empId: "ONE-0231",
      empName: "Sana Tariq",
      designation: "Logistics Coordinator",
    },
    deptList: ["Logistics", "Customer Service", "Finance"],
    underwritingTerms: ["PET Scan", "Dental services", "Pre-existing condition review"],
    dependent: [
      {
        id: "FM-0231-0",
        name: "Sana Tariq",
        relation: "Self",
        dob: "02/09/1992",
        age: 34,
        gender: "Female",
        healthcareNo: "GC25-ONEP-0231-0000",
        balanceLimit: "30,000",
        roomEntitlement: "Semi-private",
      },
      {
        id: "FM-0231-1",
        name: "Ibrahim Tariq",
        relation: "Son",
        dob: "17/02/2018",
        age: 8,
        gender: "Male",
        healthcareNo: "GC25-ONEP-0231-0001",
        balanceLimit: "30,000",
        roomEntitlement: "Semi-private",
      },
    ],
  },
];

export function lookupPolicy(cardOrCnic: string): policy | null {
  const q = cardOrCnic.trim().toLowerCase();
  if (!q) return null;
  return (
    policyDatabase.find(
      (p) => p.cardOrCnic.toLowerCase() === q || p.cardOrCnic.toLowerCase().replace(/-/g, "") === q.replace(/-/g, ""),
    ) ?? null
  );
}

export const hospitalList = [
  "Al-Hamd Medical Centre (KHI)",
  "South City Hospital (KHI)",
  "Liaquat National Hospital (KHI)",
  "Shifa International Hospital (ISB)",
  "Doctors Hospital (LHE)",
];

export const claimStatusOptions = ["Approve", "Reject", "Requirement Needed"] as const;

// Checklist of documents that can be requested / marked as received for a claim
export const requiredDocumentOptions = [
  "CNIC",
  "Card",
  "Intimation Form",
  "Prescription",
  "Lab Reports",
  "CT Scan",
  "Ultrasound",
  "X-Ray",
  "MRI",
  "Discharge Summary",
] as const;
