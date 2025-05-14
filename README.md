
# 🧠 XENO CRM - Customer Relationship Management System

This is a full-stack CRM (Customer Relationship Management) system built as part of a project assignment. It allows vendors to manage campaigns, customers, orders, and communications in a centralized dashboard.

---

## 🚀 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Harsh1428rao/CRM.git
cd CRM
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder with the following content:

```env
PORT=5000
MONGODB_URI=<Your MongoDB Atlas URI>
SESSION_SECRET=your-secret-key
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend/xenocrm-frontend
npm install
npm start
```

This will launch the frontend on `http://localhost:3000`

---

## 🏗️ Architecture Diagram

```
┌───────────────────────┐     ┌───────────────────────────────┐
│     Frontend (React)  │     │     Backend (Express.js)      │
│    Vercel Deployment  │ <--►│  Render Deployment (Node.js)  │
└───────────────────────┘     └──────────────┬────────────────┘
                                             │
                                    ┌────────▼────────┐
                                    │  MongoDB Atlas   │
                                    └──────────────────┘
                                             │
                                    ┌────────▼───────┐
                                    │     Redis      │
                                    └────────────────┘
```

---

## 🧠 Summary of AI Tools and Technologies Used

### 🛠️ Tech Stack

* **Frontend**: React.js, Axios, Bootstrap
* **Backend**: Node.js, Express.js, Passport.js
* **Database**: MongoDB Atlas (Cloud-hosted)
* **Session Handling**: express-session + Redis
* **Deployment**:

  * Frontend: Vercel
  * Backend: Render
* **Authentication**: Google OAuth 2.0

---

## 🧠 AI Tools Used

* **ChatGPT (OpenAI)**: For code debugging, architectural planning, and solving deployment issues.
* **YouTube Tutorials & Blogs**: For understanding CRM concepts and MongoDB integration.

---

## 🗃️ Redis in the Project

* **Purpose**: Redis is used to manage session storage for authenticated users. This enhances performance and ensures persistent user sessions.
* **Local Development**: Redis runs on your local machine (default port `6379`). Make sure Redis is installed and running when working locally.
* **Production**: Render doesn’t natively support Redis instances. To use Redis in production, a hosted Redis service like **Redis Cloud**, **Upstash**, or **Render Private Services** can be configured and connected using a secure Redis URL.
* **Integration**: Integrated via the `connect-redis` package to store Express session data.

---

## 🚧 Known Limitations & Assumptions

* ❗ **MongoDB Connection Issues**: During the demo, MongoDB Atlas wasn't accessible due to IP whitelisting and SSL issues, affecting dynamic functionality like login and dashboard data.
* ❗ **Redis Configuration**: Redis works locally, but additional steps are required to make it functional in production environments.
* ❗ **Single Role Focus**: The CRM is currently vendor-focused. Multi-role (admin, customer, etc.) support can be added in future versions.
* ⚠️ **Not Fully Responsive**: The UI is optimized for desktop use; mobile responsiveness is minimal.
* ✅ **Assumes** a stable internet connection and modern browser (latest Chrome/Edge/Firefox).

---

## 💬 Acknowledgment

This project was built under tight deadlines during academic schedules. From battling deployment issues to connecting distributed services, it offered a complete practical view of web development. As a student with 2 years of web development experience, this project pushed me further and gave me real-world insight into building and deploying full-stack applications. Most of the learning came from online sources, especially YouTube and documentation.

---

## 📬 Contact

Harsh Rao – [GitHub](https://github.com/Harsh1428rao)
Feel free to reach out for suggestions, improvements, or collaborations!

---

![CRM\_Project\_DFD\_Level1\_Improved\_Diagram](https://github.com/user-attachments/assets/a50539b0-48c7-48ba-ae8b-847b6b5771dc)

---

