# EmotiBite – Complete Installation & Setup Guide

This guide covers the setup for the full **EmotiBite AI Ecosystem**.

## ⚡ Quick Start (Demo Mode)
If you want to run the application **immediately** without setting up databases or Python:
1.  **Install Base Dependencies**: `npm run setup`
2.  **Launch Frontend**: `npm run client`
3.  **Result**: The app will launch at `localhost:3000` and automatically use the **Hybrid Fallback Mode** (Simulated AI & Local Storage).

---

## 🛠️ Full-Stack Setup (Production Mode)

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **Python**: v3.10.x (with `pip`)
- **MongoDB**: Local Community Server OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git**

### 2. Automated Installation
From the project root, run:
```bash
npm run setup
```
*This command installs Node packages for the Root, Client, and Server, and triggers the Python `pip` installation for the AI Service.*

### 3. Environment Configuration
You MUST create separate `.env` files for the backend services:

#### **A. Server (.env)** -> `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/moodfood
JWT_SECRET=demo_key_99
CLIENT_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
```

#### **B. AI Service (.env)** -> `ai-service/.env`
```env
PORT=8000
DEBUG=True
```

---

## 🚀 Running the Ecosystem

### **Option 1: Concurrent Mode (Recommended)**
Start all services with a single command:
```bash
npm run dev
```

### **Option 2: Individual Terminals**
1.  **Backend (Node)**: `cd server && npm run dev` (Port 5000)
2.  **AI Service (Python)**: `cd ai-service && python app.py` (Port 8000)
3.  **Frontend (React)**: `cd client && npm start` (Port 3000)

---

## 📁 Repository Structure
- `/client`: React Application (TypeScript + Tailwind)
- `/server`: Express.js API (Controllers, Routes, Mongoose Models)
- `/ai-service`: Python Microservice (ML Models, Sentiment Logic)
- `/images`: Architectural Diagrams & UI Previews

---

## 🐛 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Port 3000/5000/8000 Busy** | Previous session crashed | `npx kill-port 3000 5000 8000` |
| **Python: ModuleNotFound** | Pip install failed | `cd ai-service && pip install -r requirements.txt` |
| **MongoDB Connection Error** | Service not running | Ensure `mongod` is active OR use Atlas URI |
| **Voice Input not working** | Browser Permissions | Allow Mic access in browser; use Chrome/Edge (Web Speech API) |

## 🧪 Verification
To verify the setup:
1.  Go to `http://localhost:3000`
2.  Type "I am very happy" in the mood log.
3.  If the intensity bar moves and "Happy" appears, the **Heuristic AI** is working.
4.  Check the browser console (F12). If you see `API SUCCESS`, the **Full-Stack AI** is active.
