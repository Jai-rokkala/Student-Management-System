const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

router.get('/',         getAllStudents);
router.get('/:id',      getStudentById);
router.post('/',        upload.single('photo'), createStudent);
router.put('/:id',      upload.single('photo'), updateStudent);
router.delete('/:id',   deleteStudent);

module.exports = router;