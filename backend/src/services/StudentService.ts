import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";
import { Logger } from "../middleware/logger";

const logger = new Logger("StudentService");

export interface Student {
  id: number;
  personId: number;
  schoolCode: string;
  admissionNo: string;
  gradeLevel: string;
  section: string;
  parentId?: number;
  status: "Active" | "Graduated" | "Suspended" | "Left";
  feeBalance: number;
  feePaid: number;
  enrolledCourses: string[];
  createdAt?: Date;
}

export interface CreateStudentDTO {
  personId: number;
  schoolCode: string;
  admissionNo: string;
  gradeLevel: string;
  section: string;
  parentId?: number;
  feeBalance?: number;
  feePaid?: number;
}

export interface UpdateStudentDTO {
  gradeLevel?: string;
  section?: string;
  status?: "Active" | "Graduated" | "Suspended" | "Left";
  feeBalance?: number;
  feePaid?: number;
}

export class StudentService {
  /**
   * Create a new student
   */
  static async createStudent(data: CreateStudentDTO): Promise<Student> {
    try {
      const result = await executeUpdate(
        `INSERT INTO students (person_id, school_code, admission_no, grade_level, section, parent_id, fee_balance, fee_paid, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.personId,
          data.schoolCode,
          data.admissionNo,
          data.gradeLevel,
          data.section,
          data.parentId || null,
          data.feeBalance || 0,
          data.feePaid || 0,
          "Active",
        ]
      );

      const student = await this.getStudentById(result.lastInsertId);
      if (!student) {
        throw new Error("Failed to retrieve created student");
      }

      logger.info(`Student created: ${data.admissionNo}`);
      return student;
    } catch (error) {
      logger.error("Error creating student", { error, admissionNo: data.admissionNo });
      throw error;
    }
  }

  /**
   * Get student by ID with pagination for courses
   */
  static async getStudentById(id: number): Promise<Student | null> {
    try {
      const student = await executeQueryOne<any>(
        `SELECT s.id, s.person_id as personId, s.school_code as schoolCode, s.admission_no as admissionNo,
                s.grade_level as gradeLevel, s.section, s.parent_id as parentId,
                s.status, s.fee_balance as feeBalance, s.fee_paid as feePaid,
                s.created_at as createdAt FROM students WHERE id = ?`,
        [id]
      );

      if (!student) return null;

      // Get enrolled courses
      const courses = await executeQuery<{ courseId: string }>(
        `SELECT course_id as courseId FROM student_enrollments WHERE student_id = ?`,
        [id]
      );

      return {
        ...student,
        enrolledCourses: courses.map((c) => c.courseId),
      };
    } catch (error) {
      logger.error("Error fetching student", { error, id });
      throw error;
    }
  }

  /**
   * Get student by school code and admission number
   */
  static async getStudentBySchoolCodeAndAdmissionNo(
    schoolCode: string,
    admissionNo: string
  ): Promise<Student | null> {
    try {
      const student = await executeQueryOne<any>(
        `SELECT s.id, s.person_id as personId, s.school_code as schoolCode, s.admission_no as admissionNo,
                s.grade_level as gradeLevel, s.section, s.parent_id as parentId,
                s.status, s.fee_balance as feeBalance, s.fee_paid as feePaid,
                s.created_at as createdAt FROM students
         WHERE LOWER(s.school_code) = LOWER(?) AND LOWER(s.admission_no) = LOWER(?)`,
        [schoolCode, admissionNo]
      );

      if (!student) return null;

      return {
        ...student,
        enrolledCourses: [],
      };
    } catch (error) {
      logger.error("Error fetching student by school code/admission no", {
        error,
        schoolCode,
        admissionNo,
      });
      throw error;
    }
  }

  /**
   * Get all students with pagination
   */
  static async getAllStudents(
    page: number = 1,
    limit: number = 50
  ): Promise<{ students: Student[]; total: number }> {
    try {
      const offset = (page - 1) * limit;

      const students = await executeQuery<any>(
        `SELECT s.id, s.person_id as personId, s.school_code as schoolCode, s.admission_no as admissionNo,
                s.grade_level as gradeLevel, s.section, s.parent_id as parentId,
                s.status, s.fee_balance as feeBalance, s.fee_paid as feePaid,
                s.created_at as createdAt FROM students
         ORDER BY s.created_at DESC LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const countResult = await executeQueryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM students"
      );

      return {
        students: students.map((s) => ({
          ...s,
          enrolledCourses: [],
        })),
        total: countResult?.count || 0,
      };
    } catch (error) {
      logger.error("Error fetching all students", { error });
      throw error;
    }
  }

  /**
   * Get students by grade level
   */
  static async getStudentsByGrade(gradeLevel: string): Promise<Student[]> {
    try {
      const students = await executeQuery<any>(
        `SELECT s.id, s.person_id as personId, s.school_code as schoolCode, s.admission_no as admissionNo,
                s.grade_level as gradeLevel, s.section, s.parent_id as parentId,
                s.status, s.fee_balance as feeBalance, s.fee_paid as feePaid,
                s.created_at as createdAt FROM students WHERE grade_level = ?`,
        [gradeLevel]
      );

      return students.map((s) => ({
        ...s,
        enrolledCourses: [],
      }));
    } catch (error) {
      logger.error("Error fetching students by grade", { error, gradeLevel });
      throw error;
    }
  }

  /**
   * Update student
   */
  static async updateStudent(id: number, data: UpdateStudentDTO): Promise<Student> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.gradeLevel) {
        updates.push("grade_level = ?");
        values.push(data.gradeLevel);
      }
      if (data.section) {
        updates.push("section = ?");
        values.push(data.section);
      }
      if (data.status) {
        updates.push("status = ?");
        values.push(data.status);
      }
      if (data.feeBalance !== undefined) {
        updates.push("fee_balance = ?");
        values.push(data.feeBalance);
      }
      if (data.feePaid !== undefined) {
        updates.push("fee_paid = ?");
        values.push(data.feePaid);
      }

      if (updates.length > 0) {
        updates.push("updated_at = NOW()");
        values.push(id);

        await executeUpdate(
          `UPDATE students SET ${updates.join(", ")} WHERE id = ?`,
          values
        );
      }

      const student = await this.getStudentById(id);
      if (!student) {
        throw new Error("Student not found after update");
      }

      logger.info(`Student updated: ${id}`);
      return student;
    } catch (error) {
      logger.error("Error updating student", { error, id });
      throw error;
    }
  }

  /**
   * Get student statistics
   */
  static async getStudentStats(): Promise<{
    totalStudents: number;
    studentsByGrade: { gradeLevel: string; count: number }[];
    totalFeeBalance: number;
    totalFeePaid: number;
  }> {
    try {
      const totalResult = await executeQueryOne<{ count: number }>(
        "SELECT COUNT(*) as count FROM students"
      );

      const gradeStats = await executeQuery<{ gradeLevel: string; count: number }>(
        "SELECT grade_level as gradeLevel, COUNT(*) as count FROM students GROUP BY grade_level"
      );

      const feeStats = await executeQueryOne<{ totalBalance: number; totalPaid: number }>(
        `SELECT SUM(fee_balance) as totalBalance, SUM(fee_paid) as totalPaid FROM students`
      );

      return {
        totalStudents: totalResult?.count || 0,
        studentsByGrade: gradeStats,
        totalFeeBalance: feeStats?.totalBalance || 0,
        totalFeePaid: feeStats?.totalPaid || 0,
      };
    } catch (error) {
      logger.error("Error fetching student statistics", { error });
      throw error;
    }
  }
}

export default StudentService;
