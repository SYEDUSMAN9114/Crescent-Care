export type ApprovalLetterCase = {
  claimNo: string;
  revisionNo: number;
  approvalNo: string;
  issueDate: string;
  validityDate: string;
  patientName: string;
  employeeName: string;
  relationship: string;
  dateOfBirth: string;
  age: number;
  cardNumber: string;
  policyNo: string;
  plan: string;
  participantName: string;
  employeeId: string;
  designation: string;
  hospitalName: string;
  hospitalAddress: string;
  doctorOrSupervisor: string;
  hospitalEmail: string;
  admissionDate: string;
  diagnosis: string;
  treatment: string;
  benefit: string;
  approvedHospitalizationLimit: number;
  roomAndBoardEntitlement: string;
  approvedLengthOfStay: number;
  previousApprovedAmount: number | null;
  additionalEnhancementAmount: number | null;
  currentTotalApprovedAmount: number;
  approvalRemarks: string[];
  conditions: string[];
  exclusions: string[];
  approvingOfficer: string;
  approvingDepartment: string;
};

// This is the approved-case projection returned by the claims service. It is
// intentionally separate from the editable claim form: this workflow only
// receives the current approved revision and never writes the decision back.
const currentApprovedCase: ApprovalLetterCase = {
  claimNo: "SHGCI00470/26",
  revisionNo: 2,
  approvalNo: "CCA-26-00470-R02",
  issueDate: "13 Aug 2026",
  validityDate: "20 Aug 2026",
  patientName: "Atifa Ajmal",
  employeeName: "Ajmal Kausar",
  relationship: "Spouse",
  dateOfBirth: "23 Dec 1989",
  age: 36,
  cardNumber: "GC25-EHWM-1100-0046-1",
  policyNo: "PIHGCDP00011/25",
  plan: "Plan A — Hospitalization & Maternity",
  participantName: "Expert Hazard and Waste Management Solutions",
  employeeId: "EHW-0046",
  designation: "Site Supervisor",
  hospitalName: "South City Hospital (KHI)",
  hospitalAddress: "St-1, Block 3, Clifton, Karachi 75600",
  doctorOrSupervisor: "Dr. Sana M. Ali, Panel Coordinator",
  hospitalEmail: "authorizations@southcityhospital.com.pk",
  admissionDate: "14 Aug 2026",
  diagnosis: "Lower segment caesarean section (LSCS)",
  treatment: "Surgical delivery with inpatient care",
  benefit: "Maternity — C-Section",
  approvedHospitalizationLimit: 100000,
  roomAndBoardEntitlement: "Private room up to PKR 10,000 per day",
  approvedLengthOfStay: 3,
  previousApprovedAmount: 80000,
  additionalEnhancementAmount: 20000,
  currentTotalApprovedAmount: 100000,
  approvalRemarks: [
    "This revised approval supersedes approval CCA-26-00470-R01.",
    "Final settlement remains subject to original bills, policy terms and verification.",
  ],
  conditions: [
    "Cashless treatment is approved only for the stated admission and approved benefit.",
    "Any extension of stay or treatment outside the approved scope requires prior written approval.",
  ],
  exclusions: [
    "Consumables, non-medical items and charges outside the applicable policy schedule are not covered.",
  ],
  approvingOfficer: "Faizan Khan",
  approvingDepartment: "Health Claims — Medical Authorization",
};

export async function fetchApprovedCaseForLetter(): Promise<ApprovalLetterCase> {
  // Replace with the approved case/current-revision endpoint when the claims API is connected.
  await new Promise((resolve) => setTimeout(resolve, 450));
  return currentApprovedCase;
}

export const formatPkr = (amount: number) =>
  `PKR ${amount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
