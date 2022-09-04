import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Create from "./pages/create/Create";
import Project from "./pages/project/Project";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import OnlineUsers from "./components/OnlineUsers";
import "./App.css";
import { useAuthContext } from "./hooks/useAuthContext";

function App() {
  const { user, authIsReady } = useAuthContext();

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              {user && <Route path="/" element={<Dashboard />} />}
              {user && <Route path="/create" element={<Create />} />}
              {user && <Route path="/projects/:id" element={<Project />} />}
              {!user && <Route path="/login" element={<Login />} />}
              {!user && <Route path="/signup" element={<Signup />} />}
              {!user && (
                <Route
                  path="*"
                  element={<Navigate to="/login" replace={true} />}
                />
              )}
              {user && (
                <Route path="*" element={<Navigate to="/" replace={true} />} />
              )}
            </Routes>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
