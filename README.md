# Enterprise Policy Intelligence Assistant

A full-stack enterprise policy application built with **React, Node.js, Express, MongoDB, Gemini API, LangChain, LangGraph, and JWT Authentication**.

The project allows employees to upload company policy documents and ask questions using natural language. It demonstrates **Generative AI, Retrieval-Augmented Generation (RAG), AI tool calling, agent-based workflows, embeddings, and contextual policy search**.

## 🚀 Live Application

**Frontend:** https://enterprise-policy-ai.vercel.app/

**Backend API:** https://enterprise-policy-ai.onrender.com/

> The production frontend is hosted on Vercel and the backend API is hosted on Render. Policy documents and application data are stored in MongoDB Atlas.

## 🔐 Demo Login

**Email:** `ramesh@example.com`
**Password:** `123456`

## 🏗️ Project Architecture

```text
React Frontend
      ↓
Node.js + Express API
      ↓
JWT Authentication
      ↓
AI Agent
      ↓
LangChain / LangGraph
      ↓
RAG + Embeddings
      ↓
MongoDB Atlas
      ↓
Gemini API
```

### AI Flow

```text
User Question
      ↓
AI Agent
      ↓
searchPolicies Tool
      ↓
RAG / Vector Search
      ↓
Relevant Policy Content
      ↓
Gemini
      ↓
Contextual Answer
```
## 📄 Policy Upload & Search

### 1. Login

Login using the demo credentials:

```text
Email: ramesh@example.com
Password: 123456
```

### 2. Upload Policy

* After login, open the **Policy Upload** section.
* Select a company policy PDF document.
* Upload the PDF.
* The backend extracts the policy content and splits it into smaller chunks.
* Embeddings are generated and stored for semantic policy search.

### 3. Search Policies

* Open the **AI Assistant**.
* Ask questions in natural language, for example:

```text
What is the leave policy?
How many days of annual leave are allowed?
What is the work-from-home policy?
What is the reimbursement policy?
```

* The AI agent searches the uploaded policy documents using **RAG and semantic search**.
* Relevant policy content is retrieved and provided to **Gemini**.
* The assistant returns a contextual answer based on the uploaded company policies.

> Upload the required policy document before asking questions related to that policy.

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RAMESHH-GIT/enterprise-policy-ai.git
cd enterprise-policy-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

## 🔐 Environment Variables

### Backend

Create `.env` inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Frontend

Create `.env` inside the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

For production:

```env
REACT_APP_API_URL=https://enterprise-policy-ai.onrender.com/api
```

