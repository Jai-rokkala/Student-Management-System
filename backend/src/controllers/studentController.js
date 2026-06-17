const pool = require('../config/db');

// auto-generated for admission number
const generateAdmissionNumber = async () => {
  const year = new Date().getFullYear();
  const result = await pool.query(
    `SELECT COUNT(*) AS count FROM students WHERE admission_number LIKE $1`,
    [`ADM-${year}-%`]
  );
  const count = parseInt(result.rows[0].count) + 1;
  return `ADM-${year}-${String(count).padStart(4, '0')}`;
};

//logs 
const logActivity = async (action, studentId, description) => {
    await pool.query(
        'INSERT INTO activity_logs (action, student_id, description) VALUES ($1, $2, $3)',
        [action, studentId, description]
    );
};

//GET
exports.getAllStudents = async (req, res) => {
    try {
        const { search = '', course = '', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const query = `
      SELECT * FROM students
      WHERE (name ILIKE $1 OR email ILIKE $1 OR admission_number ILIKE $1)
      AND ($2 = '' OR course ILIKE $2)
      ORDER BY created_at DESC
      LIMIT $3 OFFSET $4
    `;
        const countQuery = `
      SELECT COUNT(*) FROM students
      WHERE (name ILIKE $1 OR email ILIKE $1 OR admission_number ILIKE $1)
      AND ($2 = '' OR course ILIKE $2)
    `;

        const searchTerm = `%${search}%`;
        const [students, total] = await Promise.all([
            pool.query(query, [searchTerm, course, limit, offset]),
            pool.query(countQuery, [searchTerm, course])
        ]);

        res.json({
            students: students.rows,
            total: parseInt(total.rows[0].count),
            page: parseInt(page),
            totalPages: Math.ceil(total.rows[0].count / limit)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Get by id
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`SELECT * FROM students WHERE id = $1`, [id]);
        if (result.rows.length === 0)
            return res.status(404).json({ error: 'Student not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//POST
exports.createStudent = async (req, res) => {
    try {
        const {
            name, course, year, date_of_birth,
            email, mobile_number, gender, address,
        } = req.body;

        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
        const admission_number = await generateAdmissionNumber();

        const result = await pool.query(
            `INSERT INTO students 
        (admission_number, name, course, year, date_of_birth, email, mobile_number, gender, address, photo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
            [admission_number, name, course, year, date_of_birth, email, mobile_number, gender, address, photo_url]
        );

        await logActivity('CREATE', result.rows[0].id, `Student ${name} added with ${admission_number}`);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') // unique violation
            return res.status(400).json({ error: 'Email already exists' });
        res.status(500).json({ error: err.message });
    }
};

//PUT
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, course, year, date_of_birth,
            email, mobile_number, gender, address
        } = req.body;

        const existing = await pool.query(`SELECT * FROM students WHERE id = $1`, [id]);
        if (existing.rows.length === 0)
            return res.status(404).json({ error: 'Student not found' });

        const photo_url = req.file
            ? `/uploads/${req.file.filename}`
            : existing.rows[0].photo_url;

        const result = await pool.query(
            `UPDATE students SET
        name=$1, course=$2, year=$3, date_of_birth=$4,
        email=$5, mobile_number=$6, gender=$7, address=$8,
        photo_url=$9, updated_at=NOW()
       WHERE id=$10 RETURNING *`,
            [name, course, year, date_of_birth, email, mobile_number, gender, address, photo_url, id]
        );

        await logActivity('UPDATE', id, `Student ${name} updated`);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//DELETE
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await pool.query(`SELECT * FROM students WHERE id = $1`, [id]);
        if (existing.rows.length === 0)
            return res.status(404).json({ error: 'Student not found' });

        await pool.query(`DELETE FROM students WHERE id = $1`, [id]);
        await logActivity('DELETE', id, `Student ${existing.rows[0].name} deleted`);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};