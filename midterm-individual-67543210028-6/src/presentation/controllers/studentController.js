const studentService = require('../../business/services/studentService');

class StudentController {
    // 1. GET /api/students - ดึงนักศึกษาทั้งหมด (รองรับ filter)
    async getAllStudents(req, res, next) {
        try {
            const { major, status } = req.query;
            const result = await studentService.getAllStudents(major, status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // 2. GET /api/students/:id - ดึงนักศึกษาตาม ID
    async getStudentById(req, res, next) {
        try {
            const result = await studentService.getStudentById(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // 3. POST /api/students - สร้างนักศึกษาใหม่
    async createStudent(req, res, next) {
        try {
            const result = await studentService.createStudent(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    // 4. PUT /api/students/:id - อัพเดทข้อมูลนักศึกษา
    async updateStudent(req, res, next) {
        try {
            const result = await studentService.updateStudent(req.params.id, req.body);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // 5. PATCH /api/students/:id/gpa - อัพเดท GPA
    async updateGPA(req, res, next) {
        try {
            const { gpa } = req.body;
            const result = await studentService.updateGPA(req.params.id, gpa);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // 6. PATCH /api/students/:id/status - เปลี่ยนสถานะ
    async updateStatus(req, res, next) {
        try {
            const { status } = req.body;
            const result = await studentService.updateStatus(req.params.id, status);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // 7. DELETE /api/students/:id - ลบนักศึกษา
    async deleteStudent(req, res, next) {
        try {
            const result = await studentService.deleteStudent(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StudentController();