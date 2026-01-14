const express = require('express');
const studentRoutes = require('./src/presentation/routes/studentRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.use('/api/students', studentRoutes);

app.use(errorHandler);

// เปลี่ยนเป็น Port 4000 เพื่อหนีปัญหา Port ชนกัน
const PORT = 4000;
app.listen(PORT, () => {
    console.log('Student Management System running on http://localhost:' + PORT);
});
