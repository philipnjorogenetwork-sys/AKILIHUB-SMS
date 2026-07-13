import express, { Router } from "express";
import { body, param, validationResult } from "express-validator";
import { asyncHandler, APIError } from "../middleware/error";
import { authMiddleware, roleMiddleware, ownershipMiddleware } from "../middleware/auth";
import { Logger } from "../middleware/logger";
import StudentService from "../services/StudentService";

const router: Router = express.Router();
const logger = new Logger("StudentRoutes");

/**
 * GET /api/v1/students/by-school-admission
 * Lookup student by school_code + admission_no (for student portal login)
 */
router.get(
  "/by-school-admission",
  asyncHandler(async (req, res) => {
    const schoolCode = (req.query.schoolCode as string) || "";
    const admissionNo = (req.query.admissionNo as string) || "";

    if (!schoolCode.trim() || !admissionNo.trim()) {
      res.status(400).json({
        success: false,
        message: "schoolCode and admissionNo are required",
      });
      return;
    }

    const student = await StudentService.getStudentBySchoolCodeAndAdmissionNo(
      schoolCode.trim(),
      admissionNo.trim()
    );

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
      return;
    }

    // Return shape expected by frontend
    res.json({
      success: true,
      student: {
        personId: String(student.personId),
        role: "student",
      },
    });
  })
);

/**
 * POST /api/v1/students
 * Create a new student (Admin only)
 */
router.post(
  "/",

  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [
    body("personId").isInt(),
    body("admissionNo").trim(),
    body("gradeLevel").trim(),
    body("section").trim(),
    body("parentId").optional().isInt(),
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

    const student = await StudentService.createStudent(req.body);

    logger.info(`Student created: ${student.admissionNo}`);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student,
    });
  })
);

/**
 * GET /api/v1/students
 * Get all students with pagination
 */
router.get(
  "/",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { students, total } = await StudentService.getAllStudents(page, limit);

    res.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  })
);

/**
 * GET /api/v1/students/:id
 * Get student by ID
 */
router.get(
  "/:id",
  authMiddleware,
  [param("id").isInt()],
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

    const student = await StudentService.getStudentById(parseInt(req.params.id));

    if (!student) {
      throw new APIError(404, "Student not found");
    }

    res.json({
      success: true,
      student,
    });
  })
);

/**
 * GET /api/v1/students/grade/:gradeLevel
 * Get students by grade level
 */
router.get(
  "/grade/:gradeLevel",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const students = await StudentService.getStudentsByGrade(req.params.gradeLevel);

    res.json({
      success: true,
      data: students,
      count: students.length,
    });
  })
);

/**
 * PUT /api/v1/students/:id
 * Update student
 */
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "secretary"),
  [param("id").isInt()],
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

    const student = await StudentService.updateStudent(
      parseInt(req.params.id),
      req.body
    );

    logger.info(`Student updated: ${student.id}`);

    res.json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  })
);

/**
 * GET /api/v1/students/stats
 * Get student statistics
 */
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("Admin"),
  asyncHandler(async (req, res) => {
    const stats = await StudentService.getStudentStats();

    res.json({
      success: true,
      stats,
    });
  })
);

export default router;
