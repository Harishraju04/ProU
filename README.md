# 🚀 ProU – Team Management & Task Tracking System  
A full-stack collaborative team, task, and productivity management system built with **Next.js**, **Express**, **Prisma**, and **PostgreSQL**.

---

## 📌 Overview

ProU is a productivity and team management platform where:

- **Team Leads** can create teams, add members, and assign tasks.
- **Employees** can view tasks, update status, and track activity.
- **Admins** can manage the platform.
- **Analytics** provide insights into productivity and team performance.

This project demonstrates a clean, scalable, production-ready architecture.

---

## 🧱 Tech Stack

### **Frontend**
- Next.js (App Router)
- React.js
- TailwindCSS
- Axios

### **Backend**
- Node.js  
- Express.js  
- Prisma ORM  
- PostgreSQL  
- Zod validation  
- JWT Authentication  

---

## Demo Video
 https://drive.google.com/file/d/1VeOzIPyN6iHUk_OgdF-P5iA-ZShTSalE/view?usp=sharing

<img width="1272" height="757" alt="image" src="https://github.com/user-attachments/assets/e490a33c-b4b6-488c-8099-919624456717" />
<img width="1877" height="805" alt="image" src="https://github.com/user-attachments/assets/67cf22cb-7ecf-4fd6-a12d-c7c6db5064a3" />
<img width="1895" height="700" alt="image" src="https://github.com/user-attachments/assets/4c048b3e-10f5-4adc-a88e-ce3e58a6ba8a" />
<img width="1798" height="835" alt="image" src="https://github.com/user-attachments/assets/b818944d-0588-4e28-9771-c30098b8ddf6" />
<img width="1892" height="864" alt="image" src="https://github.com/user-attachments/assets/a210b082-05d4-49d0-8fe1-a04902bd9297" />
<img width="1773" height="782" alt="image" src="https://github.com/user-attachments/assets/52eaea2c-07d0-4945-8766-1bfd4bfc47c8" />

<img width="1845" height="537" alt="image" src="https://github.com/user-attachments/assets/918fcc5d-0a84-4672-baf7-74d451dbff45" />
<img width="897" height="577" alt="image" src="https://github.com/user-attachments/assets/1046c7be-b2d4-43d9-8691-e92bdd297fa7" />





---

## 🔑 Features

### 👤 User Authentication
- Register & Login using JWT  
- Role-based access (`ADMIN`, `TEAM_LEAD`, `EMPLOYEE`)  
- Secure protected APIs  

---

### 👥 Team Management
- Team leads can create teams  
- Add/remove team members  
- Auto-assign team lead  
- Employees can view teams they belong to  

---

### 📌 Task Management
- Team leads assign tasks to team members  
- Employees update status (`TODO`, `IN_PROGRESS`, `DONE`)  
- Each task has:
  - Priority
  - Due date
  - Creator
  - Assignee
  - Status timeline (started, completed)

---

### 📊 Analytics
#### **User Productivity Analytics**
- Tasks completed in last 7 days  
- Total completed tasks  
- Average completion time  

#### **Team Analytics**
- Total tasks  
- Tasks grouped by status  
- Overdue tasks  
- Number of members  

---

## 🗄️ Prisma Database Schema

Includes:
- **User**
- **Team**
- **Membership**
- **Task**
- **AuditLog**

Each team:
- Has multiple members  
- Has one team lead (`isLead = true`)  
- Tasks belong to a team and are assigned to a user  

---

## 🛠️ Setup Instructions

Follow the steps below to run the project locally.

---

# 📦 Prerequisites

Make sure you have installed:

- **Node.js** (v18+ recommended)
- **PostgreSQL** (v14+)
- **npm** or **yarn**
- **Git**
- **VS Code** (optional but recommended)

---

# 🗄️ 1. Clone the Repository

```bash
git clone https://github.com/your-username/ProU.git
cd ProU

cd backend
npm install

DATABASE_URL="postgresql://<username>:<password>@localhost:5432/prou"
JWT_SECRET="your-secret-key"
PORT=3000

Replace <username> and <password> with your PostgreSQL credentials.
npx prisma generate
npx prisma migrate dev
npm run dev

backend will run at
http://localhost:3000


Frontend Setup

cd ../frontend
npm install
export const BACKEND_URL = "http://localhost:3000/api/v1";

npm run dev
frontend will start at
http://localhost:3001


