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
      <form onSubmit={login}>
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="USN"
          value={usn}
          required
          onChange={(e) => setUsn(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
        <button type="button" onClick={() => setView("register")}>
          Register
        </button>
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
      <form onSubmit={register}>
        <h2>Register</h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <input placeholder="USN" value={usn} onChange={(e) => setUsn(e.target.value)} required />
        <br />
        <button type="submit">Register</button>
        <button type="button" onClick={() => setView("login")}>Back to Login</button>
      </form>
    );
  };


  const Dashboard = () => (
    <div>
      <h2>Welcome, {user?.name}!</h2>
      <p>USN: {user?.usn}</p>
      <button onClick={() => setView("profile")}>Update Profile</button>
      <button onClick={() => setView("donors")}>Find Donors</button>
      <button
        onClick={() => {
          setUser(null);
          setView("login");
        }}
      >
        Logout
      </button>
    </div>
  );

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
      <form onSubmit={updateProfile}>
        <h2>Update Profile</h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="date" value={dob} required onChange={(e) => setDob(e.target.value)} />
        <br />
        <select value={gender} required onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <br />
        <select value={bloodgroup} required onChange={(e) => setBloodGroup(e.target.value)}>
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>O+</option>
          <option>O-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
        <br />
        <input type="text" placeholder="Contact" value={contact} required onChange={(e) => setContact(e.target.value)} />
        <br />
        <input type="text" placeholder="Location" value={location} required onChange={(e) => setLocation(e.target.value)} />
        <br />
        <input type="text" placeholder="Role (optional, e.g., donar)" value={role} onChange={(e) => setRole(e.target.value)} />
        <br />
        <button type="submit">Save</button>
        <button type="button" onClick={() => setView("dashboard")}>Back</button>
      </form>
    );
  };

  // --------------- Donors (card view) -----------------
const Donors = () => {
  const [bloodgroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper: compute age from YYYY-MM-DD (dob)
  const getAge = (dobStr) => {
    if (!dobStr) return null;
    const dob = new Date(dobStr);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
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
      if (!res.ok) {
        setLocalError("Error fetching donors");
        setLoading(false);
        return;
      }

      // data is an array of tuples from SELECT * on users.
      // Adjust indices to your actual users table order.
      // Common order: [id, name, usn, dob, gender, bloodgroup, contact, location, role, ...]
      const mapped = (Array.isArray(data) ? data : []).map((row) => {
        // Safely access indices; tweak if your schema differs.
        const name = row[1];
        const usn = row[1];
        const dob = row[2];       // e.g., "2002-05-12"
        const gender = row[3];
        const bloodGroup = row[4];
        const contact = row[5];
        const location = row[6];
        const role = row[7];

        return {
          name,
          usn,
          age: getAge(dob),
          gender,
          contact,
          location,
          bloodGroup,
          role,
        };
      });

      if (mapped.length === 0) {
        setLocalError("No donors found");
      } else {
        setDonors(mapped);
      }
    } catch (err) {
      setLocalError("Error fetching donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Find Donors</h2>
      <form onSubmit={searchDonors}>
        <select
          required
          value={bloodgroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>O+</option>
          <option>O-</option>
          <option>AB+</option>
          <option>AB-</option>
        </select>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
        <button type="button" onClick={() => setView("dashboard")}>
          Back
        </button>
      </form>

      {localError && <p style={{ color: "red" }}>{localError}</p>}

      {donors.length > 0 && (
        <div style={{ marginTop: "1rem", display: "grid", gap: "12px" }}>
          {donors.map((d, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>{d.name}</div>
              <div style={{ color: "#555" }}>
                {d.age !== null ? `Age: ${d.age}` : "Age: N/A"}
              </div>
              <div>Gender: {d.gender || "N/A"}</div>
              <div>Contact: {d.contact || "N/A"}</div>
              <div>Location: {d.location || "N/A"}</div>
              {/* If you want to show blood group too, uncomment:
              <div>Blood Group: {d.bloodGroup || "N/A"}</div>
              */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
  

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Blood Donor System</h1>
      {view === "login" && <Login />}
      {view === "register" && <Register />}
      {view === "dashboard" && user && <Dashboard />}
      {view === "profile" && user && <Profile />}
      {view === "donors" && <Donors />}
    </div>
  );
}
