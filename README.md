
````markdown
# 🧠 XENO CRM - Customer Relationship Management System

This is a full-stack CRM (Customer Relationship Management) system built as part of a project assignment. It allows vendors to manage campaigns, customers, orders, and communications in a centralized dashboard.

---

## 🚀 Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Harsh1428rao/CRM.git
cd CRM
````

### 2. Backend Setup

```bash
cd backend
npm install
```

* Create a `.env` file in the `backend` folder with the following content:

```env
PORT=5000
MONGODB_URI=<Your MongoDB Atlas URI>
SESSION_SECRET=your-secret-key
```

* Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd ../frontend/xenocrm-frontend
npm install
npm start
```

* This will launch the frontend on `http://localhost:3000`

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
```

---

## 🧠 Summary of AI Tools and Technologies Used

### 🛠️ Tech Stack

* **Frontend:** React.js, Axios, Bootstrap
* **Backend:** Node.js, Express.js, Passport.js
* **Database:** MongoDB Atlas (Cloud-hosted)
* **Session Handling:** express-session
* **Deployment:**

  * Frontend: Vercel
  * Backend: Render
* **Authentication:** Google OAuth2.0

### 🧠 AI Tools Used

* **ChatGPT (OpenAI):** For code debugging assistance, architectural planning, and resolving deployment issues.
* **YouTube Tutorials & Blogs:** For understanding CRM features and MongoDB integration.

---

## 🚧 Known Limitations & Assumptions

* ❗ **MongoDB Connection Issues**: The MongoDB cluster was not accessible during the demo due to IP whitelisting and SSL errors, impacting dynamic features like login and data display.
* ❗ **Session Storage**: Redis is used locally for session storage, which may not work out-of-the-box on deployed versions like Render unless configured separately.
* ❗ **Single User Role**: The system currently assumes a vendor-centric CRM. Support for multiple roles (admin, user) could be added.
* ⚠️ **No Mobile Responsiveness**: UI is optimized for desktop, not yet mobile-friendly.
* ✅ Assumes a stable internet connection and modern browser for optimal use.

---

## 💬 Acknowledgment

This project was a valuable learning experience, especially under tight academic timelines. It involved real-world problem solving across deployment, database connectivity, and full-stack development.

---

## 📬 Contact

For feedback or collaboration:
**Harsh Rao** – [GitHub](https://github.com/Harsh1428rao)

```


```
