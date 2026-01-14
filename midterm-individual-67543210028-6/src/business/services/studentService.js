const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    async getAllStudents(major = null, status = null) {
        const rows = await studentRepository.findAll(major, status);
        
        // Business logic: คำนวณสถิติ
        const active = rows.filter(s => s.status === 'active').length;
        const graduated = rows.filter(s => s.status === 'graduated').length;
        const suspended = rows.filter(s => s.status === 'suspended').length;
        const avgGPA = rows.length > 0 
            ? (rows.reduce((sum, s) => sum + s.gpa, 0) / rows.length).toFixed(2)
            : 0;
            
        return {
            students: rows,
            statistics: { 
                active, 
                graduated, 
                suspended, 
                total: rows.length,
                averageGPA: parseFloat(avgGPA)
            }
        };
    }

    async getStudentById(id) {
        const validId = studentValidator.validateId(id);
        const student = await studentRepository.findById(validId);
        if (!student) {
            throw new Error('Student not found'); // จะถูกดักจับว่าเป็น 404 ใน controller/errorHandler ถ้าปรับปรุงเพิ่ม
        }
        return student;
    }

    async createStudent(studentData) {
        studentValidator.validateStudentData(studentData);
        return await studentRepository.create(studentData);
    }

    async updateStudent(id, studentData) {
        const validId = studentValidator.validateId(id);
        
        // เช็คว่ามีนักศึกษาอยู่จริงไหม
        const existingStudent = await studentRepository.findById(validId);
        if (!existingStudent) {
            throw new Error('Student not found');
        }

        studentValidator.validateStudentData(studentData);
        return await studentRepository.update(validId, studentData);
    }

    async updateGPA(id, gpa) {
        const validId = studentValidator.validateId(id);
        studentValidator.validateGPA(gpa);

        const existingStudent = await studentRepository.findById(validId);
        if (!existingStudent) {
            throw new Error('Student not found');
        }

        return await studentRepository.updateGPA(validId, gpa);
    }

    async updateStatus(id, status) {
        const validId = studentValidator.validateId(id);
        studentValidator.validateStatus(status);

        const existingStudent = await studentRepository.findById(validId);
        if (!existingStudent) {
            throw new Error('Student not found');
        }

        // Business rule: ไม่สามารถเปลี่ยนสถานะ withdrawn ได้
        if (existingStudent.status === 'withdrawn') {
            throw new Error('Cannot change status of withdrawn student');
        }

        return await studentRepository.updateStatus(validId, status);
    }

    async deleteStudent(id) {
        const validId = studentValidator.validateId(id);
        
        const existingStudent = await studentRepository.findById(validId);
        if (!existingStudent) {
            throw new Error('Student not found');
        }

        // Business rule: ไม่สามารถลบ active student
        if (existingStudent.status === 'active') {
            throw new Error('Cannot delete active student. Change status first.');
        }

        return await studentRepository.delete(validId);
    }
}

module.exports = new StudentService();