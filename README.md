# Student Management System - Layered Architecture

## 📋 Project Information
- **Student Name:** [ตรัยัรตน์ วงษ์สิทธิ์]
- **Student ID:** [67543210028-6]
- **Course:** ENGSE207 Software Architecture

## 🏗️ Architecture Style
Layered Architecture (3-tier)

## 📂 Project Structure
- `src/presentation`: Handles HTTP requests, routes, and JSON responses.
- `src/business`: Contains business logic, rules, and data validation.
- `src/data`: Manages database connections and SQL queries.

## 🎯 Refactoring Summary

### ปัญหาของ Monolithic (เดิม):
1. **Separation of Concerns:** Logic ทุกอย่างปนกันในไฟล์เดียว (Validation, DB, HTTP).
2. **Maintainability:** แก้ไขยาก เพราะแก้จุดหนึ่งอาจกระทบจุดอื่น
3. **Collaboration:** ทีมงานทำงานไฟล์เดียวกันพร้อมกันไม่ได้

### วิธีแก้ไขด้วย Layered Architecture:
1. แยก **Controller** รับผิดชอบเฉพาะ HTTP interaction
2. แยก **Service** รับผิดชอบ Business Logic และกฎต่างๆ
3. แยก **Repository** รับผิดชอบการคุยกับ Database

### ประโยชน์ที่ได้รับ:
1. โค้ดอ่านง่าย เป็นระเบียบ
2. สามารถเขียน Unit Test แยกแต่ละ Layer ได้ง่าย
3. ทีม Frontend, Backend, Database ทำงานแยกกันได้ชัดเจน

## 🚀 How to Run

```bash
# 1. Install dependencies
npm install

# 2. Run server
npm start

# 3. Test API
# Server runs on http://localhost:3000