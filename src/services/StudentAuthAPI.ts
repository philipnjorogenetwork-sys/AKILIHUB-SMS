import { students } from "@/data/schoolData";
import { getBackendOrigin } from "@/lib/apiConfig";

export type StudentLookupResult = {
  success: boolean;
  message?: string;
  student?: {
    personId: string;
    role: "student";
  };
};

const API_BASE = getBackendOrigin();

function findLocalStudentByCredentials(schoolCode: string, admissionNo: string) {
  const normalizedSchoolCode = schoolCode.trim().toLowerCase();
  const normalizedAdmissionNo = admissionNo.trim().toLowerCase();

  return students.find((student) => {
    return (
      student.schoolCode.trim().toLowerCase() === normalizedSchoolCode &&
      student.admissionNo.trim().toLowerCase() === normalizedAdmissionNo
    );
  });
}

/**
 * Expected backend endpoint:
 * GET /api/v1/students/by-school-admission?schoolCode=...&admissionNo=...
 */
export async function lookupStudentBySchoolCodeAndAdmissionNo(
  schoolCode: string,
  admissionNo: string
): Promise<StudentLookupResult> {
  const normalizedSchoolCode = schoolCode.trim();
  const normalizedAdmissionNo = admissionNo.trim();

  try {
    const url = new URL(`${API_BASE}/api/v1/students/by-school-admission`);
    url.searchParams.set("schoolCode", normalizedSchoolCode);
    url.searchParams.set("admissionNo", normalizedAdmissionNo);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json().catch(() => null);

    if (res.ok && json?.success && json?.student?.personId) {
      return {
        success: true,
        student: json.student,
      };
    }
  } catch (error) {
    console.warn("Student backend lookup failed, using local student data instead.", error);
  }

  const localStudent = findLocalStudentByCredentials(normalizedSchoolCode, normalizedAdmissionNo);

  if (localStudent) {
    return {
      success: true,
      student: {
        personId: localStudent.id,
        role: "student",
      },
    };
  }

  return {
    success: false,
    message: "No student record matches the provided School Code and Admission Number.",
  };
}

