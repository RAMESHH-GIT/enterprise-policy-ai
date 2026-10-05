import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import AIAssistant from "./components/AIAssistant";
import PolicyUpload from "./components/PolicyUpload";
import api from "./services/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
  };

  const fetchPolicies = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/policies", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("Policies from API:", response.data);

    setPolicies(response.data || []);

  } catch (error) {
    console.error(
      "Failed to fetch policies:",
      error
    );
  }
};

  useEffect(() => {
    if (isLoggedIn) {
      fetchPolicies();
    }
  }, [isLoggedIn]);

  const handlePolicyClick = async (policy) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/policies/${policy._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSelectedPolicy(response.data.policy);
    } catch (error) {
      console.error("Failed to load policy:", error);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* HEADER */}

      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 25px",
          borderBottom: "1px solid #ddd"
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Enterprise Policy AI
          </h2>

          <small>
            Welcome, {user?.name}
          </small>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "6px",
            background: "#dc2626",
            color: "white",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </header>


      {/* MAIN LAYOUT */}

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 75px)"
        }}
      >

        {/* LEFT SIDEBAR */}

        <aside
          style={{
            width: "240px",
            borderRight: "1px solid #ddd",
            padding: "20px",
            background: "#f8fafc"
          }}
        >

          <h3>
            Company Policies
          </h3>

         {policies.length === 0 ? (
  <p>No policies uploaded.</p>
) : (
  policies.map((policy) => (
    <div
      key={policy._id}
      onClick={() => handlePolicyClick(policy)}
      style={{
        padding: "12px",
        marginBottom: "8px",
        background:
          selectedPolicy?._id === policy._id
            ? "#e5e7eb"
            : "white",
        border: "1px solid #ddd",
        borderRadius: "6px",
        cursor: "pointer"
      }}
    >
      📄 {policy.fileName || policy.title}
    </div>
  ))
)}

        </aside>


        {/* CENTER PAGE */}

        <main
          style={{
            flex: 1,
            padding: "30px",
            overflowY: "auto"
          }}
        >

          {!selectedPolicy ? (

            <>
              <h1>
                Policy Intelligence Assistant
              </h1>

              <p>
                Upload a company policy PDF and ask
                questions using AI.
              </p>

              <PolicyUpload
                onUploadSuccess={fetchPolicies}
              />
            </>

          ) : (

            <>
              <h1>
                {selectedPolicy.title}
              </h1>

              <p>
                <strong>
                  File:
                </strong>{" "}
                {selectedPolicy.fileName}
              </p>

              <hr />

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  maxWidth: "900px"
                }}
              >
                {selectedPolicy.content}
              </div>

            </>

          )}

        </main>

      </div>


      {/* AI ASSISTANT */}

      <AIAssistant />

    </div>
  );
}

export default App;