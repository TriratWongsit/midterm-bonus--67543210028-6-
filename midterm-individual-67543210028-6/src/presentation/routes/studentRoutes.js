const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// กำหนด Routes ให้ครบทั้ง 7 เส้น
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.patch('/:id/gpa', studentController.updateGPA);
router.patch('/:id/status', studentController.updateStatus);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;