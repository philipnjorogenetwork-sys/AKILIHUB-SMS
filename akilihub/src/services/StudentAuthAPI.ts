pm ruexport type StudentLookupResult = {
  success: boolean;
  message?: string;
  student?: {
    personId: string;
    role: "student";
  };
};

const API_BASE = import.meta.env.VITE_API_BASE?.toString().replace(/\/$/, "") || "http://localhost:3000";

/**
 * Backend endpoint expected:
 * GET /api/v1/students/by-school-admission?schoolCode=...&admissionNo=...
 */
export async function lookupStudentBySchoolCodeAndAdmissionNo(
  schoolCode: string,
  admissionNo: string
): Promise<StudentLookupResult> {
  const url = new URL(`${API_BASE}/api/v1/students/by-school-admission`);
  url.searchParams.set("schoolCode", schoolCode);
  url.searchParams.set("admissionNo", admissionNo);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    return {
      success: false,
      message: (json && (json.message as string)) || `Request failed (${res.status})`,
    };
  }

  if (!json?.success || !json?.student?.personId) {
    return {
      success: false,
      message: json?.message || "Student not found",
    };
  }

  return {
    success: true,
    student: json.student,
  };
}

