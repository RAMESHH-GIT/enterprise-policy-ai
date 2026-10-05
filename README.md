# Enterprise Policy Intelligence Assistant 🤖

An AI-powered enterprise application that allows employees to upload company policy documents and ask questions using natural language.

The application uses Retrieval-Augmented Generation (RAG), AI tool calling, and an agent-based workflow to retrieve relevant policy information and provide contextual answers.
### Tech Stack

* React (Create React App)
* Node.js + Express
* MongoDB Atlas
* Gemini API
* LangChain / LangGraph
* RAG + Embeddings
* AI Tool Calling
* JWT Authentication
* Vercel + Render

### Key Features

* 🔐 JWT-based login
* 📄 Upload company policy PDFs
* 🔎 RAG-based policy search
* 🤖 AI policy assistant
* 🛠️ AI tool calling
* 🧠 Gemini LLM + embeddings
* 💬 Natural-language policy questions
* ☁️ Vercel frontend + Render backend

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
Answer
```

### Run Locally

**Backend**

```bash
cd backend
npm install
npm start
```

**Frontend**

```bash
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

### Environment Variables

Backend `.env`:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Frontend deployment:

```env
REACT_APP_API_URL=https://enterprise-policy-ai.onrender.com/api
```

### Demo Login

```text
Email: ramesh@example.com
Password: 123456
```

> For a public GitHub repository, avoid publishing real credentials. Use a dedicated demo account or remove this section before making the repository public.

### Deployment

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

### Author

**Ramesh**
React Developer | JavaScript | TypeScript | Generative AI
