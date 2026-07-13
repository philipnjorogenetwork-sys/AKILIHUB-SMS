import express, { Router } from "express";
import { body, param, validationResult, query } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import AttendanceService from "../services/AttendanceService";

const router: Router = express.Router();
const logger = new Logger("AttendanceRoutes");

/**
 * POST /api/v1/attendance
 * Record attendance
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "teacher", "secretary"),
  [
    body("studentId").isInt(),
    body("classId").isInt(),
    body("date").isISO8601(),
    body("status").isIn(["Present", "Absent", "Late", "Excused"]),
    body("remarks").optional().trim(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const attendance = await AttendanceService.createAttendance({
      ...req.body,
      date: new Date(req.body.date),
    });

    logger.info(`Attendance recorded for student ${req.body.studentId}`);

    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully",
      attendance,
    });
  })
);

/**
 * POST /api/v1/attendance/bulk
 * Bulk record attendance
 */
router.post(
  "/bulk",
  authMiddleware,
  roleMiddleware("Admin", "teacher", "secretary"),
  [body().isArray()],
  asyncHandler(async (req, res) => {
    if (!Array.isArray(req.body)) {
      res.status(400).json({
        success: false,
        message: "Request body must be an array",
      });
      return;
    }

    const records = req.body.map((r) => ({
      ...r,
      date: new Date(r.date),
    }));

    await AttendanceService.bulkCreateAttendance(records);

    logger.info(`Bulk attendance recorded: ${records.length} records`);

    res.status(201).json({
      success: true,
      message: `${records.length} attendance records created successfully`,
      count: records.length,
    });
  })
);

/**
 * GET /api/v1/attendance/student/:studentId
 * Get student attendance records
 */
router.get(
  "/student/:studentId",
  authMiddleware,
  [param("studentId").isInt()],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : undefined;
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : undefined;

    const attendance = await AttendanceService.getStudentAttendance(
      parseInt(req.params.studentId),
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: attendance,
      count: attendance.length,
    });
  })
);

/**
 * GET /api/v1/attendance/class/:classId/date/:date
 * Get class attendance for a specific date
 */
router.get(
  "/class/:classId/date/:date",
  authMiddleware,
  roleMiddleware("Admin", "teacher", "secretary"),
  asyncHandler(async (req, res) => {
    const { classId, date } = req.params;

    const attendance = await AttendanceService.getClassAttendance(
      parseInt(classId),
      new Date(date)
    );

    res.json({
      success: true,
      data: attendance,
      count: attendance.length,
    });
  })
);

/**
 * GET /api/v1/attendance/stats/student/:studentId
 * Get student attendance statistics
 */
router.get(
  "/stats/student/:studentId",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const stats = await AttendanceService.getStudentAttendanceStats(
      parseInt(req.params.studentId)
    );

    res.json({
      success: true,
      stats,
    });
  })
);

/**
 * PUT /api/v1/attendance/:id
 * Update attendance record
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "teacher", "secretary"),
  [
    param("id").isInt(),
    body("status").isIn(["Present", "Absent", "Late", "Excused"]),
    body("remarks").optional().trim(),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const attendance = await AttendanceService.updateAttendance(
      parseInt(req.params.id),
      req.body.status,
      req.body.remarks
    );

    logger.info(`Attendance updated: ${req.params.id}`);

    res.json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  })
);

export default router;
