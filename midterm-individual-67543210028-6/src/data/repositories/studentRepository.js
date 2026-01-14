const db = require('../database/connection');

class StudentRepository {
    async findAll(major = null, status = null) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM students';
            let params = [];
            let conditions = [];
            
            if (major) {
                conditions.push('major = ?');
                params.push(major);
            }
            
            if (status) {
                conditions.push('status = ?');
                params.push(status);
            }
            
            if (conditions.length > 0) {
                sql += ' WHERE ' + conditions.join(' AND ');
            }
            
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async create(studentData) {
        const { student_code, first_name, last_name, email, major } = studentData;
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO students (student_code, first_name, last_name, email, major) VALUES (?, ?, ?, ?, ?)';
            // ใช้ function(err) เพื่อเข้าถึง this.lastID
            db.run(sql, [student_code, first_name, last_name, email, major], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Return the created student
                    db.get('SELECT * FROM students WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    async update(id, studentData) {
        const { student_code, first_name, last_name, email, major } = studentData;
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE students SET student_code = ?, first_name = ?, last_name = ?, email = ?, major = ? WHERE id = ?';
            db.run(sql, [student_code, first_name, last_name, email, major, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    async updateGPA(id, gpa) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE students SET gpa = ? WHERE id = ?', [gpa, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    async updateStatus(id, status) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE students SET status = ? WHERE id = ?', [status, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM students WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ message: 'Student deleted successfully' });
            });
        });
    }
}

module.exports = new StudentRepository();