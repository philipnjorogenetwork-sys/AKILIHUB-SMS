import { executeQuery, executeQueryOne, executeUpdate } from "../config/database";
import { Logger } from "../middleware/logger";

const logger = new Logger("AttendanceService");

export interface Attendance {
  id: number;
  studentId: number;
  classId: number;
  date: Date;
  status: "Present" | "Absent" | "Late" | "Excused";
  remarks?: string;
  createdAt?: Date;
}

export interface CreateAttendanceDTO {
  studentId: number;
  classId: number;
  date: Date;
  status: "Present" | "Absent" | "Late" | "Excused";
  remarks?: string;
}

export class AttendanceService {
  /**
   * Create attendance record
   */
  static async createAttendance(data: CreateAttendanceDTO): Promise<Attendance> {
    try {
      const result = await executeUpdate(
        `INSERT INTO attendance (student_id, class_id, date, status, remarks)
         VALUES (?, ?, ?, ?, ?)`,
        [data.studentId, data.classId, data.date, data.status, data.remarks || null]
      );

      const attendance = await this.getAttendanceById(result.lastInsertId);
      if (!attendance) {
        throw new Error("Failed to retrieve created attendance");
      }

      logger.info(`Attendance recorded: student ${data.studentId}`);
      return attendance;
    } catch (error) {
      logger.error("Error creating attendance", { error, studentId: data.studentId });
      throw error;
    }
  }

  /**
   * Bulk create attendance records (for performance with many students)
   */
  static async bulkCreateAttendance(records: CreateAttendanceDTO[]): Promise<void> {
    try {
      const placeholders = records
        .map(() => "(?, ?, ?, ?, ?)")
        .join(",");
      const values = records.flatMap((r) => [
        r.studentId,
        r.classId,
        r.date,
        r.status,
        r.remarks || null,
      ]);

      await executeUpdate(
        `INSERT INTO attendance (student_id, class_id, date, status, remarks)
         VALUES ${placeholders}`,
        values
      );

      logger.info(`Bulk attendance created: ${records.length} records`);
    } catch (error) {
      logger.error("Error creating bulk attendance", { error, count: records.length });
      throw error;
    }
  }

  /**
   * Get attendance by ID
   */
  static async getAttendanceById(id: number): Promise<Attendance | null> {
    try {
      return await executeQueryOne<Attendance>(
        `SELECT id, student_id as studentId, class_id as classId, date, status, remarks, 
                created_at as createdAt FROM attendance WHERE id = ?`,
        [id]
      );
    } catch (error) {
      logger.error("Error fetching attendance", { error, id });
      throw error;
    }
  }

  /**
   * Get student attendance records
   */
  static async getStudentAttendance(
    studentId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<Attendance[]> {
    try {
      let query = `SELECT id, student_id as studentId, class_id as classId, date, status, remarks,
                          created_at as createdAt FROM attendance WHERE student_id = ?`;
      const params: any[] = [studentId];

      if (startDate) {
        query += " AND date >= ?";
        params.push(startDate);
      }

      if (endDate) {
        query += " AND date <= ?";
        params.push(endDate);
      }

      query += " ORDER BY date DESC";

      return await executeQuery<Attendance>(query, params);
    } catch (error) {
      logger.error("Error fetching student attendance", { error, studentId });
      throw error;
    }
  }

  /**
   * Get class attendance for a specific date
   */
  static async getClassAttendance(classId: number, date: Date): Promise<Attendance[]> {
    try {
      return await executeQuery<Attendance>(
        `SELECT id, student_id as studentId, class_id as classId, date, status, remarks,
                created_at as createdAt FROM attendance WHERE class_id = ? AND date = ?`,
        [classId, date]
      );
    } catch (error) {
      logger.error("Error fetching class attendance", { error, classId });
      throw error;
    }
  }

  /**
   * Get attendance statistics for student
   */
  static async getStudentAttendanceStats(studentId: number): Promise<{
    totalDays: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendancePercentage: number;
  }> {
    try {
      const stats = await executeQueryOne<any>(
        `SELECT 
          COUNT(*) as totalDays,
          SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
          SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent,
          SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late,
          SUM(CASE WHEN status = 'Excused' THEN 1 ELSE 0 END) as excused
         FROM attendance WHERE student_id = ?`,
        [studentId]
      );

      const totalDays = stats?.totalDays || 0;
      const present = stats?.present || 0;

      return {
        totalDays,
        present,
        absent: stats?.absent || 0,
        late: stats?.late || 0,
        excused: stats?.excused || 0,
        attendancePercentage: totalDays > 0 ? (present / totalDays) * 100 : 0,
      };
    } catch (error) {
      logger.error("Error fetching attendance statistics", { error, studentId });
      throw error;
    }
  }

  /**
   * Update attendance record
   */
  static async updateAttendance(
    id: number,
    status: "Present" | "Absent" | "Late" | "Excused",
    remarks?: string
  ): Promise<Attendance> {
    try {
      await executeUpdate(
        `UPDATE attendance SET status = ?, remarks = ?, updated_at = NOW() WHERE id = ?`,
        [status, remarks || null, id]
      );

      const attendance = await this.getAttendanceById(id);
      if (!attendance) {
        throw new Error("Attendance record not found");
      }

      logger.info(`Attendance updated: ${id}`);
      return attendance;
    } catch (error) {
      logger.error("Error updating attendance", { error, id });
      throw error;
    }
  }
}

export default AttendanceService;
