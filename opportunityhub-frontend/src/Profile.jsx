import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function Profile() {

    const userId = Number(localStorage.getItem("userId"));

    const emptyProfile = {
        fullName: "",
        phone: "",
        college: "",
        degree: "",
        graduationYear: "",
        skills: "",
        preferredLocation: ""
    };

    const [profile, setProfile] = useState(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exists, setExists] = useState(false);
    const [editing, setEditing] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        let cancelled = false;

        const loadProfile = async () => {
            if (!token) {
                if (!cancelled) {
                    setError("Please login first.");
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/profile/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.status === 404) {
                    if (!cancelled) {
                        setProfile(emptyProfile);
                        setExists(false);
                        setEditing(false);
                        setError("");
                    }
                    return;
                }

                if (!response.ok) {
                    throw new Error("Unable to load profile.");
                }

                const data = await response.json();

                if (!cancelled) {
                    setProfile({
                        fullName: data.fullName || "",
                        phone: data.phone || "",
                        college: data.college || "",
                        degree: data.degree || "",
                        graduationYear: data.graduationYear || "",
                        skills: data.skills || "",
                        preferredLocation: data.preferredLocation || ""
                    });
                    setExists(true);
                    setEditing(false);
                    setError("");
                }
            } catch (err) {
                console.error("Profile loading error:", err);
                if (!cancelled) {
                    setError(err.message || "Unable to load your profile.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
        setMessage("");
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!token) {
            setError("Please login first.");
            return;
        }

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const method = exists ? "PUT" : "POST";

            const response = await fetch(
                `http://localhost:8080/api/profile/${userId}`,
                {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(profile)
                }
            );

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "Unable to save profile.");
            }

            let data = null;
            try {
                data = JSON.parse(text);
            } catch {
                // Backend may return an empty/text response.
            }

            if (data) {
                setProfile({
                    fullName: data.fullName || profile.fullName,
                    phone: data.phone || profile.phone,
                    college: data.college || profile.college,
                    degree: data.degree || profile.degree,
                    graduationYear: data.graduationYear || profile.graduationYear,
                    skills: data.skills || profile.skills,
                    preferredLocation: data.preferredLocation || profile.preferredLocation
                });
            }

            setExists(true);
            setEditing(false);
            setMessage("Profile saved successfully!");
        } catch (err) {
            console.error("Profile save error:", err);
            setError(err.message || "Unable to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        setMessage("");
        setError("");
        setEditing(true);
    };

    const handleCancel = () => {
        setMessage("");
        setError("");
        setEditing(false);
    };


    const renderValue = (value) => value || "Not provided";

    return (
        <div className="dashboard">
            <Navbar />

            <main className="dashboard-content">
                <section className="welcome-section">
                    <div>
                        <p className="welcome-label">YOUR CAREER PROFILE</p>
                        <h1>My Profile 👤</h1>
                        <p className="welcome-text">
                            Keep your profile updated so OpportunityHub can find better opportunities for you.
                        </p>
                    </div>

                    <div className="welcome-illustration">👤</div>
                </section>

                <section className="dashboard-card">
                    <div className="card-header">
                        <div>
                            <p className="card-label">PROFILE INFORMATION</p>
                            <h2>{editing ? "Edit your profile" : "Your profile"}</h2>
                        </div>

                        {!loading && exists && !editing && (
                            <button className="apply-btn" onClick={handleEdit}>
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {loading && (
                        <p style={{ marginTop: "25px" }}>
                            Loading your profile...
                        </p>
                    )}

                    {!loading && error && !editing && (
                        <div style={{ marginTop: "25px" }}>
                            <p>{error}</p>
                            <button
                                className="apply-btn"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && !editing && exists && (
                        <>
                            <div className="profile-summary-grid">
                                <div className="profile-summary-item">
                                    <p className="profile-summary-label">Full Name</p>
                                    <p className="profile-summary-value">{renderValue(profile.fullName)}</p>
                                </div>

                                <div className="profile-summary-item">
                                    <p className="profile-summary-label">Phone Number</p>
                                    <p className="profile-summary-value">{renderValue(profile.phone)}</p>
                                </div>

                                <div className="profile-summary-item">
                                    <p className="profile-summary-label">College / University</p>
                                    <p className="profile-summary-value">{renderValue(profile.college)}</p>
                                </div>

                                <div className="profile-summary-item">
                                    <p className="profile-summary-label">Degree</p>
                                    <p className="profile-summary-value">{renderValue(profile.degree)}</p>
                                </div>

                                <div className="profile-summary-item">
                                    <p className="profile-summary-label">Graduation Year</p>
                                    <p className="profile-summary-value">{renderValue(profile.graduationYear)}</p>
                                </div>

                                <div className="profile-summary-item">
                                    <p className="profile-summary-label">Preferred Location</p>
                                    <p className="profile-summary-value">{renderValue(profile.preferredLocation)}</p>
                                </div>

                                <div className="profile-summary-item full-width">
                                    <p className="profile-summary-label">Skills</p>
                                    <p className="profile-summary-value">{renderValue(profile.skills)}</p>
                                </div>
                            </div>

                            {message && (
                                <p style={{ marginTop: "18px" }}>
                                    {message}
                                </p>
                            )}
                        </>
                    )}

                    {!loading && !error && !editing && !exists && (
                        <div className="profile-empty">
                            <div className="profile-empty-icon">📝</div>
                            <h3>Your profile is not created yet</h3>
                            <p>
                                Add your education, skills and preferred location so OpportunityHub can personalize recommendations.
                            </p>
                            <button className="apply-btn" onClick={handleEdit}>
                                Create Profile
                            </button>
                        </div>
                    )}

                    {!loading && editing && (
                        <form onSubmit={handleSubmit} style={{ marginTop: "25px" }}>
                            <div style={{ marginBottom: "18px" }}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    style={{ width: "100%", marginTop: "8px", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    style={{ width: "100%", marginTop: "8px", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label>College / University</label>
                                <input
                                    type="text"
                                    name="college"
                                    value={profile.college}
                                    onChange={handleChange}
                                    placeholder="Enter your college"
                                    style={{ width: "100%", marginTop: "8px", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label>Degree</label>
                                <input
                                    type="text"
                                    name="degree"
                                    value={profile.degree}
                                    onChange={handleChange}
                                    placeholder="Example: B.Tech Computer Science"
                                    style={{ width: "100%", marginTop: "8px", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label>Graduation Year</label>
                                <input
                                    type="number"
                                    name="graduationYear"
                                    value={profile.graduationYear}
                                    onChange={handleChange}
                                    placeholder="Example: 2027"
                                    style={{ width: "100%", marginTop: "8px", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <label>Skills</label>
                                <textarea
                                    name="skills"
                                    value={profile.skills}
                                    onChange={handleChange}
                                    placeholder="Example: Java, Spring Boot, SQL, React"
                                    rows="4"
                                    style={{ width: "100%", marginTop: "8px", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", resize: "vertical", boxSizing: "border-box" }}
                                />
                            </div>

                            <div style={{ marginBottom: "25px" }}>
                                <label>Preferred Location</label>
                                <input
                                    type="text"
                                    name="preferredLocation"
                                    value={profile.preferredLocation}
                                    onChange={handleChange}
                                    placeholder="Example: Bengaluru, Hyderabad, Remote"
                                    style={{ width: "100%", marginTop: "8px", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "15px", boxSizing: "border-box" }}
                                />
                            </div>

                            {message && <p style={{ marginBottom: "15px" }}>{message}</p>}
                            {error && <p style={{ marginBottom: "15px" }}>{error}</p>}

                            <div className="profile-actions">
                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="apply-btn"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : exists ? "Update Profile" : "Save Profile"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>

            <footer className="dashboard-footer">
                © 2026 OpportunityHub · Your future starts here 🚀
            </footer>
        </div>
    );
}

export default Profile;
