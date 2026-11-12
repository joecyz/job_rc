import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("LOGIN DIKLIK");

    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      console.log(response.data);

      const role = response.data.role;

      localStorage.setItem(
        "access_token",
        response.data.access
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh
      );

      localStorage.setItem(
        "role",
        role
      );

      localStorage.setItem(
        "username",
        username
      );

      window.dispatchEvent(new Event("login"));

      // =========================
      // REDIRECT BERDASARKAN ROLE
      // =========================

      if (role === "Applicant") {
        navigate("/");
      } else if (role === "HR") {
        navigate("/hr/dashboard");
      } else if (role === "Team Event") {
        navigate("/event/dashboard");
      } else {
        // kalau role tidak dikenali
        navigate("/");
      }

    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);

      showToast(
        JSON.stringify(error.response?.data),
        "error"
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
      }}
    >
      <h1>Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default Login;