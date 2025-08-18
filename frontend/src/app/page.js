"use client";

import { useState } from "react";

export default function Page() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const Login = () => {
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");

  const login = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, usn }),
      });
      const text = await res.text();
      if (res.ok && text.trim().toLowerCase() === "you logged in") {
        setUser({ name, usn });
        setView("dashboard");
      } else {
        setError(text || "Invalid credentials");
      }
    } catch {
      setError("Login error");
    }
  };

  return (
    <form onSubmit={login} className="panel form">
      <h2>Login</h2>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <div className="form-row">
        <label className="label">Name</label>
        <input
          className="input"
          type="text"
          placeholder="Enter your name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label">USN</label>
        <input
          className="input"
          type="text"
          placeholder="Enter your USN"
          value={usn}
          required
          onChange={(e) => setUsn(e.target.value)}
        />
      </div>

      <div className="row">
        <button className="btn" type="submit">Login</button>
        <button className="btn secondary" type="button" onClick={() => setView("register")}>
          Register
        </button>
      </div>
    </form>
  );
};


const Register = () => {
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, usn }),
      });
      const text = await res.text();
      if (res.ok && text.trim().toLowerCase() === "you registered") {
        setMessage(text);
        setName("");
        setUsn("");
      } else {
        setError(text || "Registration failed");
      }
    } catch {
      setError("Registration error");
    }
  };

  return (
    <form onSubmit={register} className="panel form">
      <h2>Register</h2>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="form-row">
        <label className="label">Name</label>
        <input
          className="input"
          type="text"
          placeholder="Enter your name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label">USN</label>
        <input
          className="input"
          type="text"
          placeholder="Enter your USN"
          value={usn}
          required
          onChange={(e) => setUsn(e.target.value)}
        />
      </div>

      <div className="row">
        <button className="btn" type="submit">Register</button>
        <button className="btn secondary" type="button" onClick={() => setView("login")}>
          Back to Login
        </button>
      </div>
    </form>
  );
};



  const Dashboard = () => {
  return (
    <div className="panel">
      <h2>Welcome, {user?.name}!</h2>
      <p className="subtitle">USN: {user?.usn}</p>

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn" onClick={() => setView("profile")}>Update Profile</button>
        <button className="btn" onClick={() => setView("donors")}>Find Donors</button>
        <button
          className="btn secondary"
          onClick={() => {
            setUser(null);
            setView("login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};


  const Profile = () => {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [bloodgroup, setBloodGroup] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");

  const updateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/profile_update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usn: user?.usn,
          dob,
          gender,
          bloodgroup,
          contact,
          location,
          role,
        }),
      });
      const text = await res.text();
      if (res.ok) setMessage(text);
      else setError(text || "Update failed");
    } catch {
      setError("Update failed");
    }
  };

  return (
    <form onSubmit={updateProfile} className="panel form">
      <h2>Update Profile</h2>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="grid-2">
        <div className="form-row">
          <label className="label">Date of Birth</label>
          <input
            className="input"
            type="date"
            value={dob}
            required
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="label">Gender</label>
          <select
            className="select"
            value={gender}
            required
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-row">
          <label className="label">Blood Group</label>
          <select
            className="select"
            value={bloodgroup}
            required
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option value="">Select...</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </div>

        <div className="form-row">
          <label className="label">Contact</label>
          <input
            className="input"
            type="text"
            value={contact}
            required
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
      </div>

      <div className="form-row">
        <label className="label">Location</label>
        <input
          className="input"
          type="text"
          value={location}
          required
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label className="label">Role (optional)</label>
        <input
          className="input"
          type="text"
          value={role}
          placeholder="donar"
          onChange={(e) => setRole(e.target.value)}
        />
      </div>

      <div className="row">
        <button className="btn" type="submit">Save</button>
        <button className="btn secondary" type="button" onClick={() => setView("dashboard")}>
          Back
        </button>
      </div>
    </form>
  );
};


  // --------------- Donors (card view) -----------------


const Donors = () => {
  const [bloodgroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  // Calculate age from DOB string (YYYY-MM-DD)
const calculateAge = (dob) => {
  if (!dob) return null;
  
  const dobStr = String(dob).trim();
  
  const birthDate = new Date(dobStr);
  if (isNaN(birthDate.getTime())) {
    console.log("Invalid date format:", dobStr);
    return null;
  }
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};



  const searchDonors = async (e) => {
    e.preventDefault();
    setLocalError("");
    setDonors([]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/get_donar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bloodgroup }),
      });
      const data = await res.json();

      console.log("Raw donor data from backend:", data);

      if (!res.ok) {
        setLocalError("Error fetching donors");
        setLoading(false);
        return;
      }
      if (!Array.isArray(data) || data.length === 0) {
        setLocalError("No donors found");
      } else {
        const mapped = data.map((row) => {
          console.log("Calculating age for DOB:", row[2]);
          return {
            name: row[1],
            age: calculateAge(row[2]),
            gender: row[3],
            contact: row[5],
            location: row[6],
          };
        });
        console.log("Mapped donor objects:", mapped);
        setDonors(mapped);
      }
    } catch (error) {
      console.error(error);
      setLocalError("Error fetching donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={searchDonors} className="panel form">
        <h2>Find Donors</h2>

        <div className="form-row">
          <label className="label">Blood Group</label>
          <select
            className="select"
            value={bloodgroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
          >
            <option value="">Select...</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </div>

        <div className="row">
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => setView("dashboard")}
          >
            Back
          </button>
        </div>

        {localError && (
          <div className="alert error" style={{ marginTop: "12px" }}>
            {localError}
          </div>
        )}
      </form>

      {donors.length > 0 && (
        <div className="panel" style={{ marginTop: "20px" }}>
          <div className="cards">
            {donors.map((d, i) => (
              <div key={i} className="card">
                <div className="card-h">
                  <div className="badge">Available</div>
                  <div>
                    <div className="card-name">{d.name}</div>
                    <div className="card-meta">
                      {d.gender || "N/A"}{" "}
                      {d.age != null ? `• ${d.age} yrs` : ""}
                    </div>
                  </div>
                </div>
                <div className="card-l">
                  <div>Contact: {d.contact || "N/A"}</div>
                  <div>Location: {d.location || "N/A"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


  return (
    <div className="page">
      <div className="app">
        <header className="header">
           <h1 className="title">Blood Donor System</h1> 
           <p className="subtitle">Find and manage donors easily</p> </header>
      {view === "login" && <Login />}
      {view === "register" && <Register />}
      {view === "dashboard" && user && <Dashboard />}
      {view === "profile" && user && <Profile />}
      {view === "donors" && <Donors />}
      <div className="footer">
        <p>© 2023 Blood Donor System</p></div>
    </div>
    </div>
  );
}
