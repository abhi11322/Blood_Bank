"use client";
import { useState } from "react";

export default function Page() {
  const [view, setView] = useState("login");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ----- Login -----
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
          setView("profile");
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
          <label>Name</label>
          <input type="text" value={name} required onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>USN</label>
          <input type="text" value={usn} required onChange={e => setUsn(e.target.value)} />
        </div>
        <div className="row">
          <button className="btn" type="submit">Login</button>
          <button className="btn secondary" type="button" onClick={() => setView("register")}>Register</button>
        </div>
      </form>
    );
  };

  // ----- Register -----
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
          <label>Name</label>
          <input type="text" value={name} required onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-row">
          <label>USN</label>
          <input type="text" value={usn} required onChange={e => setUsn(e.target.value)} />
        </div>
        <div className="row">
          <button className="btn" type="submit">Register</button>
          <button className="btn secondary" type="button" onClick={() => setView("login")}>Back to Login</button>
        </div>
      </form>
    );
  };

  // ----- Profile VIEW -----
const ProfileView = () => (
  <div className="profile-card">
    <h2>Your Profile</h2>
    <div className="profile-item">
      <span className="profile-label">Name:</span>
      <span className="profile-value">{user?.name || "N/A"}</span>
    </div>
    <div className="profile-item">
      <span className="profile-label">USN:</span>
      <span className="profile-value">{user?.usn || "N/A"}</span>
    </div>
    {/* Add more fields below if needed */}
  </div>
);


  // ----- Update Profile -----
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
            usn: user?.usn, dob, gender, bloodgroup, contact, location, role,
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
        <input type="date" value={dob} required onChange={e => setDob(e.target.value)} />
        <select value={gender} required onChange={e => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select value={bloodgroup} required onChange={e => setBloodGroup(e.target.value)}>
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
        <input type="text" placeholder="Contact" value={contact} required onChange={e => setContact(e.target.value)} />
        <input type="text" placeholder="Location" value={location} required onChange={e => setLocation(e.target.value)} />
        <input type="text" placeholder="Role (optional, e.g. donar)" value={role} onChange={e => setRole(e.target.value)} />
        <div className="row">
          <button className="btn" type="submit">Save</button>
          <button className="btn secondary" type="button" onClick={() => setView("profile")}>Back</button>
        </div>
      </form>
    );
  };

  // ----- Donors -----
  const Donors = () => {
    const [bloodgroup, setBloodGroup] = useState("");
    const [donors, setDonors] = useState([]);
    const [localError, setLocalError] = useState("");
    const [loading, setLoading] = useState(false);

    const calculateAge = (dob) => {
      if (!dob) return null;
      const birthDate = new Date(String(dob).trim());
      if (isNaN(birthDate.getTime())) return null;
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
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
        if (!Array.isArray(data) || data.length === 0) {
          setLocalError("No donors found");
        } else {
          const mapped = data.map((row) => ({
            name: row[1],
            age: calculateAge(row[2]),
            gender: row[3],
            contact: row[5],
            location: row[6],
          }));
          setDonors(mapped);
        }
      } catch {
        setLocalError("Error fetching donors");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <form onSubmit={searchDonors} className="panel form">
          <h2>Find Donors</h2>
          <select value={bloodgroup} required onChange={e => setBloodGroup(e.target.value)}>
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
          <div className="row">
            <button className="btn" type="submit" disabled={loading}>{loading ? "Searching..." : "Search"}</button>
            <button className="btn ghost" type="button" onClick={() => setView("profile")}>Back</button>
          </div>
          {localError && <div className="alert error">{localError}</div>}
        </form>
        {donors.length > 0 && (
          <div className="panel" style={{ marginTop: "20px" }}>
            <div className="donor-cards">
              {donors.map((d, i) => (
                <div key={i} className="donor-card">
                  <div><strong>{d.name}</strong> ({d.gender || "N/A"}, {d.age != null ? `${d.age} yrs` : "N/A"})</div>
                  <div>Contact: {d.contact || "N/A"}</div>
                  <div>Location: {d.location || "N/A"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ----- DeleteAccount -----
  const DeleteAccount = () => {
    const [delMsg, setDelMsg] = useState("");
    const [delError, setDelError] = useState("");

    const deleteUser = async () => {
      setDelMsg("");
      setDelError("");
      try {
        const res = await fetch("http://localhost:5000/delete_user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usn: user?.usn }),
        });
        const text = await res.text();
        if (res.ok && text.toLowerCase().includes("deleted")) {
          setDelMsg("Account deleted.");
          setUser(null);
          setView("login");
        } else setDelError(text || "Deletion failed");
      } catch {
        setDelError("Error deleting account");
      }
    };

    return (
      <div className="panel" style={{ maxWidth: 400, margin: "2rem auto" }}>
        <h2>Delete your account?</h2>
        <p>Are you sure you want to delete your account?</p>
        {delMsg && <div className="alert success">{delMsg}</div>}
        {delError && <div className="alert error">{delError}</div>}
        <button className="btn danger" onClick={deleteUser}>Yes, Delete</button>
        <button className="btn" onClick={() => setView("profile")}>Cancel</button>
      </div>
    );
  };

  // ----- Navbar -----
  const Navbar = () => (
    <nav className="navbar">
      <button className="btn" onClick={() => setView("profile")}>Profile</button>
      <button className="btn" onClick={() => setView("update")}>Update Profile</button>
      <button className="btn" onClick={() => setView("donors")}>Find Donors</button>
      <button className="btn" onClick={() => setView("delete")}>Delete Account</button>
      <button className="btn secondary" onClick={() => { setUser(null); setView("login"); }}>Logout</button>
    </nav>
  );

  // ----- Main Render -----
  return (
    <div className="page">
      <div className="app">
      <div className="site-wrapper">
        <header className="header">
          <h1 className="title">Blood Donor System</h1>
          <p className="subtitle">Find and manage donors easily</p>
        </header>
        {user && <Navbar />}
        <main>
          {!user && view === "login" && <Login />}
          {!user && view === "register" && <Register />}
          {user && view === "profile" && <ProfileView />}
          {user && view === "update" && <Profile />}
          {user && view === "donors" && <Donors />}
          {user && view === "delete" && <DeleteAccount />}
        </main>
      </div>
    </div>
    </div>
  );
}
// 