import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, UserCheck, FileText, ShieldCheck, Wallet, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { students as initialStudents, type Student } from "@/data/schoolData";
import { toast } from "sonner";
import { createStudent } from "@/services/backendSync";

type EnrollmentStep = 1 | 2 | 3 | 4 | 5 | 6;

interface StudentEnrollmentForm {
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  religion: string;
  phone: string;
  email: string;
  address: string;
  admissionDate: string;
  admissionNo: string;
  grade: string;
  section: string;
  previousSchool: string;
  entryMode: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  motherEmail: string;
  motherOccupation: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  medicalConditions: string;
  allergies: string;
  doctorName: string;
  doctorPhone: string;
  academicStrengths: string;
  learningSupport: string;
  transportMode: string;
  busRoute: string;
  dormitory: string;
  feePlan: string;
  feeBalance: string;
  scholarship: string;
  birthCertificate: string;
  immunization: string;
  reportCard: string;
  photoConsent: string;
  medicalConsent: string;
  dataConsent: string;
}

const blankForm: StudentEnrollmentForm = {
  fullName: "",
  dob: "",
  gender: "",
  nationality: "Kenyan",
  religion: "",
  phone: "",
  email: "",
  address: "",
  admissionDate: "",
  admissionNo: "",
  grade: "Form 1",
  section: "East",
  previousSchool: "",
  entryMode: "New Admission",
  fatherName: "",
  fatherPhone: "",
  fatherEmail: "",
  fatherOccupation: "",
  motherName: "",
  motherPhone: "",
  motherEmail: "",
  motherOccupation: "",
  guardianName: "",
  guardianRelation: "",
  guardianPhone: "",
  medicalConditions: "",
  allergies: "",
  doctorName: "",
  doctorPhone: "",
  academicStrengths: "",
  learningSupport: "",
  transportMode: "School Bus",
  busRoute: "",
  dormitory: "Day Scholar",
  feePlan: "Annual",
  feeBalance: "",
  scholarship: "No",
  birthCertificate: "",
  immunization: "",
  reportCard: "",
  photoConsent: "Yes",
  medicalConsent: "Yes",
  dataConsent: "Yes",
};

const steps = [
  { id: 1, title: "Basic information", description: "Identity and contact details" },
  { id: 2, title: "Admission", description: "Academic placement and intake" },
  { id: 3, title: "Parents", description: "Primary caregivers and contacts" },
  { id: 4, title: "Health & academic", description: "Support needs and medical profile" },
  { id: 5, title: "Logistics & finance", description: "Transport, dormitory and fee plan" },
  { id: 6, title: "Documents & consent", description: "Required records and approvals" },
];

export default function StudentProfiles() {
  const [students, setStudents] = useState<Student[]>(() => initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [step, setStep] = useState<EnrollmentStep>(1);
  const [form, setForm] = useState<StudentEnrollmentForm>(blankForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredStudents = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return students;

    return students.filter((student) =>
      [student.name, student.email, student.grade, student.section, student.admissionNo]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [searchQuery, students]);

  const handleFieldChange = (field: keyof StudentEnrollmentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const requiredFields: Record<number, Array<keyof StudentEnrollmentForm>> = {
      1: ["fullName", "dob", "gender", "phone", "address"],
      2: ["admissionDate", "grade", "section"],
      3: ["fatherName", "fatherPhone", "motherName", "motherPhone"],
      4: ["medicalConditions", "academicStrengths"],
      5: ["transportMode", "feePlan"],
      6: ["birthCertificate", "immunization", "reportCard", "photoConsent", "medicalConsent", "dataConsent"],
    };

    const missing = requiredFields[step].filter((field) => !String(form[field]).trim());
    const nextErrors = Object.fromEntries(missing.map((field) => [field, "This field is required"]));
    setErrors(nextErrors);
    return missing.length === 0;
  };

  const resetWizard = () => {
    setStep(1);
    setForm(blankForm);
    setIsWizardOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const admissionNo = form.admissionNo || `ADM2026${String(students.length + 1).padStart(3, "0")}`;
    const newStudent: Student = {
      id: `S${String(students.length + 1).padStart(3, "0")}`,
      name: form.fullName,
      age: new Date().getFullYear() - new Date(form.dob).getFullYear(),
      address: form.address,
      phone: form.phone,
      email: form.email,
      schoolCode: "AKHUB001",
      admissionNo,
      grade: form.grade,
      section: form.section,
      parentId: "",
      enrolledCourses: ["C001"],
      feeBalance: Number(form.feeBalance) || 0,
      feePaid: 0,
    };

    try {
      const response = await createStudent({
        personId: Date.now(),
        schoolCode: "AKHUB001",
        admissionNo,
        gradeLevel: form.grade,
        section: form.section,
        feeBalance: Number(form.feeBalance) || 0,
        feePaid: 0,
      });

      if (!response.ok) {
        throw new Error(response.data?.message || "Student could not be synced to the backend");
      }

      setStudents((prev) => [newStudent, ...prev]);
      toast.success(`${form.fullName} has been added to the student directory and synced to the backend.`);
      resetWizard();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sync student to backend");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Directory</h1>
          <p className="text-muted-foreground">Create and manage student profiles for the SIS across admin and secretary operations.</p>
        </div>
        <Button onClick={() => setIsWizardOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Student Profile
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Enrolled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter((student) => student.feeBalance > 0).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready for Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter((student) => student.grade).length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search students by name, grade or admission" className="pl-10" />
        </div>
      </div>

      {isWizardOpen ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xl">Student Enrollment Wizard</CardTitle>
                <p className="text-sm text-muted-foreground">Step {step} of {steps.length}: {steps[step - 1].title}</p>
              </div>
              <div className="flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-sm text-muted-foreground">
                <Sparkles className="mr-2 h-4 w-4 text-primary" /> {steps[step - 1].description}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {steps.map((item) => (
                  <div key={item.id} className={`rounded-full px-3 py-1 text-sm ${step === item.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                    {item.id}. {item.title}
                  </div>
                ))}
              </div>

              {step === 1 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Full name</label>
                    <Input placeholder="Full name" value={form.fullName} onChange={(event) => handleFieldChange("fullName", event.target.value)} required />
                    {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Date of birth</label>
                    <Input type="date" value={form.dob} onChange={(event) => handleFieldChange("dob", event.target.value)} required />
                    {errors.dob && <p className="text-xs text-red-500">{errors.dob}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Gender</label>
                    <select value={form.gender} onChange={(event) => handleFieldChange("gender", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Nationality</label>
                    <Input placeholder="Nationality" value={form.nationality} onChange={(event) => handleFieldChange("nationality", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Religion</label>
                    <Input placeholder="Religion" value={form.religion} onChange={(event) => handleFieldChange("religion", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Phone number</label>
                    <Input type="tel" placeholder="Phone number" value={form.phone} onChange={(event) => handleFieldChange("phone", event.target.value)} required />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Email address</label>
                    <Input type="email" placeholder="Email address" value={form.email} onChange={(event) => handleFieldChange("email", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3 md:col-span-2">
                    <label className="text-sm font-medium">Residential address</label>
                    <Textarea placeholder="Residential address" value={form.address} onChange={(event) => handleFieldChange("address", event.target.value)} className="min-h-24" />
                    {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Admission number</label>
                    <Input placeholder="Admission number" value={form.admissionNo} onChange={(event) => handleFieldChange("admissionNo", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Admission date</label>
                    <Input type="date" value={form.admissionDate} onChange={(event) => handleFieldChange("admissionDate", event.target.value)} required />
                    {errors.admissionDate && <p className="text-xs text-red-500">{errors.admissionDate}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Grade</label>
                    <select value={form.grade} onChange={(event) => handleFieldChange("grade", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="Form 1">Form 1</option>
                      <option value="Form 2">Form 2</option>
                      <option value="Form 3">Form 3</option>
                      <option value="Form 4">Form 4</option>
                    </select>
                    {errors.grade && <p className="text-xs text-red-500">{errors.grade}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Section</label>
                    <select value={form.section} onChange={(event) => handleFieldChange("section", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                    </select>
                    {errors.section && <p className="text-xs text-red-500">{errors.section}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Previous school</label>
                    <Input placeholder="Previous school" value={form.previousSchool} onChange={(event) => handleFieldChange("previousSchool", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Entry mode</label>
                    <select value={form.entryMode} onChange={(event) => handleFieldChange("entryMode", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="New Admission">New Admission</option>
                      <option value="Transfer">Transfer</option>
                      <option value="Re-entry">Re-entry</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Father's full name</label>
                    <Input placeholder="Father's full name" value={form.fatherName} onChange={(event) => handleFieldChange("fatherName", event.target.value)} />
                    {errors.fatherName && <p className="text-xs text-red-500">{errors.fatherName}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Father phone</label>
                    <Input type="tel" placeholder="Father phone" value={form.fatherPhone} onChange={(event) => handleFieldChange("fatherPhone", event.target.value)} />
                    {errors.fatherPhone && <p className="text-xs text-red-500">{errors.fatherPhone}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Father email</label>
                    <Input type="email" placeholder="Father email" value={form.fatherEmail} onChange={(event) => handleFieldChange("fatherEmail", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Father occupation</label>
                    <Input placeholder="Father occupation" value={form.fatherOccupation} onChange={(event) => handleFieldChange("fatherOccupation", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Mother's full name</label>
                    <Input placeholder="Mother's full name" value={form.motherName} onChange={(event) => handleFieldChange("motherName", event.target.value)} />
                    {errors.motherName && <p className="text-xs text-red-500">{errors.motherName}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Mother phone</label>
                    <Input type="tel" placeholder="Mother phone" value={form.motherPhone} onChange={(event) => handleFieldChange("motherPhone", event.target.value)} />
                    {errors.motherPhone && <p className="text-xs text-red-500">{errors.motherPhone}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Mother email</label>
                    <Input type="email" placeholder="Mother email" value={form.motherEmail} onChange={(event) => handleFieldChange("motherEmail", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Mother occupation</label>
                    <Input placeholder="Mother occupation" value={form.motherOccupation} onChange={(event) => handleFieldChange("motherOccupation", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Guardian name</label>
                    <Input placeholder="Guardian name" value={form.guardianName} onChange={(event) => handleFieldChange("guardianName", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Relationship</label>
                    <Input placeholder="Relationship" value={form.guardianRelation} onChange={(event) => handleFieldChange("guardianRelation", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Guardian phone</label>
                    <Input type="tel" placeholder="Guardian phone" value={form.guardianPhone} onChange={(event) => handleFieldChange("guardianPhone", event.target.value)} />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Medical conditions</label>
                    <Textarea placeholder="Medical conditions or chronic illnesses" value={form.medicalConditions} onChange={(event) => handleFieldChange("medicalConditions", event.target.value)} className="min-h-24" />
                    {errors.medicalConditions && <p className="text-xs text-red-500">{errors.medicalConditions}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Allergies</label>
                    <Textarea placeholder="Allergies and sensitivities" value={form.allergies} onChange={(event) => handleFieldChange("allergies", event.target.value)} className="min-h-24" />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Doctor or clinic name</label>
                    <Input placeholder="Doctor or clinic name" value={form.doctorName} onChange={(event) => handleFieldChange("doctorName", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Doctor phone</label>
                    <Input type="tel" placeholder="Doctor phone" value={form.doctorPhone} onChange={(event) => handleFieldChange("doctorPhone", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3 md:col-span-2">
                    <label className="text-sm font-medium">Academic strengths and interests</label>
                    <Textarea placeholder="Academic strengths and interests" value={form.academicStrengths} onChange={(event) => handleFieldChange("academicStrengths", event.target.value)} className="min-h-24" />
                    {errors.academicStrengths && <p className="text-xs text-red-500">{errors.academicStrengths}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3 md:col-span-2">
                    <label className="text-sm font-medium">Learning support needs</label>
                    <Textarea placeholder="Learning support needs" value={form.learningSupport} onChange={(event) => handleFieldChange("learningSupport", event.target.value)} className="min-h-24" />
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Transport mode</label>
                    <select value={form.transportMode} onChange={(event) => handleFieldChange("transportMode", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="School Bus">School Bus</option>
                      <option value="Private Car">Private Car</option>
                      <option value="Walking">Walking</option>
                    </select>
                    {errors.transportMode && <p className="text-xs text-red-500">{errors.transportMode}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Bus route / pickup point</label>
                    <Input placeholder="Bus route / pickup point" value={form.busRoute} onChange={(event) => handleFieldChange("busRoute", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Dormitory / boarding status</label>
                    <select value={form.dormitory} onChange={(event) => handleFieldChange("dormitory", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="Day Scholar">Day Scholar</option>
                      <option value="Boarder">Boarder</option>
                    </select>
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Fee plan</label>
                    <select value={form.feePlan} onChange={(event) => handleFieldChange("feePlan", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="Annual">Annual</option>
                      <option value="Termly">Termly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                    {errors.feePlan && <p className="text-xs text-red-500">{errors.feePlan}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Outstanding balance</label>
                    <Input type="number" placeholder="Outstanding balance" value={form.feeBalance} onChange={(event) => handleFieldChange("feeBalance", event.target.value)} />
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Scholarship status</label>
                    <select value={form.scholarship} onChange={(event) => handleFieldChange("scholarship", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="No">No</option>
                      <option value="Partial">Partial</option>
                      <option value="Full">Full</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Birth certificate reference</label>
                    <Input placeholder="Birth certificate reference" value={form.birthCertificate} onChange={(event) => handleFieldChange("birthCertificate", event.target.value)} />
                    {errors.birthCertificate && <p className="text-xs text-red-500">{errors.birthCertificate}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Immunization record reference</label>
                    <Input placeholder="Immunization record reference" value={form.immunization} onChange={(event) => handleFieldChange("immunization", event.target.value)} />
                    {errors.immunization && <p className="text-xs text-red-500">{errors.immunization}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Latest report card reference</label>
                    <Input placeholder="Latest report card reference" value={form.reportCard} onChange={(event) => handleFieldChange("reportCard", event.target.value)} />
                    {errors.reportCard && <p className="text-xs text-red-500">{errors.reportCard}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Photo consent</label>
                    <select value={form.photoConsent} onChange={(event) => handleFieldChange("photoConsent", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="Yes">Photo consent approved</option>
                      <option value="No">Photo consent declined</option>
                    </select>
                    {errors.photoConsent && <p className="text-xs text-red-500">{errors.photoConsent}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Medical consent</label>
                    <select value={form.medicalConsent} onChange={(event) => handleFieldChange("medicalConsent", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="Yes">Medical consent approved</option>
                      <option value="No">Medical consent declined</option>
                    </select>
                    {errors.medicalConsent && <p className="text-xs text-red-500">{errors.medicalConsent}</p>}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/80 bg-background p-3">
                    <label className="text-sm font-medium">Data privacy consent</label>
                    <select value={form.dataConsent} onChange={(event) => handleFieldChange("dataConsent", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="Yes">Data privacy consent approved</option>
                      <option value="No">Data privacy consent declined</option>
                    </select>
                    {errors.dataConsent && <p className="text-xs text-red-500">{errors.dataConsent}</p>}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-between gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => (step === 1 ? resetWizard() : setStep((step - 1) as EnrollmentStep))}>
                  {step === 1 ? <><ChevronLeft className="mr-2 h-4 w-4" /> Cancel</> : <><ChevronLeft className="mr-2 h-4 w-4" /> Back</>}
                </Button>
                {step < steps.length ? (
                  <Button type="button" onClick={() => {
                    if (validateStep()) {
                      setStep((step + 1) as EnrollmentStep);
                    }
                  }}>
                    Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">
                    <UserCheck className="mr-2 h-4 w-4" /> Save Student Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{student.admissionNo || "Pending admission"}</p>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{student.grade}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>{student.section} • {student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Fee balance: KSh {student.feeBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Health and consent forms ready</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
