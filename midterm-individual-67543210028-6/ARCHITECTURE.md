# Architecture Documentation

## 1. C1 Context Diagram (System Context)

**Description:**
ระบบ Student Management System คือระบบบริหารจัดการข้อมูลนักศึกษาที่ช่วยให้ Admin หรือเจ้าหน้าที่สามารถจัดการข้อมูลต่างๆ ได้ เช่น การลงทะเบียน, การบันทึกสถานะการเรียน และการบันทึกเกรดเฉลี่ย (GPA)

```mermaid
graph TD
    User[Admin / Staff] -- Uses --> System[Student Management System]
    System -- Stores Data --> DB[(SQLite Database)]



    C2 Container Diagram (Layered Architecture)
ระบบถูกออกแบบโดยใช้ Layered Architecture (3-Tier) เพื่อแยกส่วนรับผิดชอบ (Separation of Concerns) ทำให้โค้ดเป็นระเบียบและดูแลรักษาง่าย

┌─────────────────────────────────────────────────────────────┐
│                   Presentation Layer                        │
│                                                             │
│   ┌────────────────┐      ┌─────────────────────────┐       │
│   │   Routes       │─────►│      Controllers        │       │
│   │ (API Endpoint) │      │ (Req/Res & HTTP Logic)  │       │
│   └────────────────┘      └────────────┬────────────┘       │
│                                        │                    │
└────────────────────────────────────────┼────────────────────┘
                                         │ Calls
                                         ▼
┌────────────────────────────────────────┼────────────────────┐
│                   Business Logic Layer |                    │
│                                        │                    │
│   ┌────────────────┐      ┌────────────┴────────────┐       │
│   │   Validators   │◄─────│        Services         │       │
│   │ (Data Check)   │      │ (Business Rules & Logic)│       │
│   └────────────────┘      └────────────┬────────────┘       │
│                                        │                    │
└────────────────────────────────────────┼────────────────────┘
                                         │ Calls
                                         ▼
┌────────────────────────────────────────┼────────────────────┐
│                    Data Access Layer   |                    │
│                                        │                    │
│                           ┌────────────┴────────────┐       │
│                           │      Repositories       │       │
│                           │ (SQL Query Construction)│       │
│                           └────────────┬────────────┘       │
│                                        │                    │
└────────────────────────────────────────┼────────────────────┘
                                         │ SQL
                                         ▼
                                  ┌─────────────┐
                                  │   SQLite    │
                                  │  Database   │
                                  └─────────────┘

3. Layer Responsibilities (หน้าที่ของแต่ละ Layer)
1. Presentation Layer (src/presentation)

Role: เป็นด่านหน้าสุดสำหรับรับ HTTP Request และส่งคืน Response กลับไปให้ Client

Components:

Routes: กำหนด URL Endpoints และจับคู่กับ Controller function

Controllers: รับ Request, ดึงข้อมูลจาก Body/Params, เรียกใช้งาน Service, และจัดการ HTTP Status Code (เช่น 200, 400, 500)

Middlewares: จัดการ Error Handling แบบรวมศูนย์

2. Business Logic Layer (src/business)

Role: เป็นสมองของระบบ จัดการเงื่อนไขและกฎเกณฑ์ทางธุรกิจทั้งหมด (Business Rules)

Components:

Services: ประมวลผล Logic หลัก (เช่น การคำนวณ GPA, การตรวจสอบสิทธิ์การลบข้อมูล)

Validators: ตรวจสอบความถูกต้องของข้อมูล (เช่น รหัสนักศึกษาต้องมี 10 หลัก, Email ต้องถูก format)

3. Data Access Layer (src/data)

Role: จัดการการติดต่อกับฐานข้อมูลโดยตรง ซ่อนรายละเอียดของ SQL Query ไว้

Components:

Repositories: เก็บฟังก์ชันสำหรับ CRUD (Create, Read, Update, Delete)

Database Connection: จัดการการเชื่อมต่อไฟล์ students.db

4. Data Flow (ตัวอย่างการทำงาน)
Scenario: การสร้างนักศึกษาใหม่ (Create Student)

Request: Client ส่ง POST /api/students พร้อมข้อมูล JSON

Presentation (Route): Router ส่งคำขอไปที่ studentController.createStudent

Presentation (Controller): Controller รับข้อมูลและส่งต่อให้ studentService.createStudent()

Business (Service):

เรียก studentValidator เพื่อตรวจสอบข้อมูล (เช่น รูปแบบรหัสนักศึกษา)

หากข้อมูลถูกต้อง จะเรียก studentRepository.create()

Data (Repository): สร้างคำสั่ง SQL INSERT INTO ... และบันทึกลงฐานข้อมูล

Database: SQLite บันทึกข้อมูลและคืนค่า ID ของแถวที่สร้างใหม่

Response: ผลลัพธ์ถูกส่งย้อนกลับขึ้นมา Repository → Service → Controller

Reply: Controller ส่ง HTTP 201 Created กลับไปให้ Client