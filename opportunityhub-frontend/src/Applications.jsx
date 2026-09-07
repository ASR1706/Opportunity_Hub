import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Current user
    const userId = Number(localStorage.getItem("userId"));

    // ==========================================
    // LOAD APPLICATIONS
    // ==========================================

    useEffect(() => {
        const loadApplications = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `https://opportunityhub-backend-shiw.onrender.com/api/applications/user/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.status === 401 || response.status === 403) {
                    setError(
                        "Your login session has expired. Please login again."
                    );
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    throw new Error("Unable to load applications.");
                }

                const data = await response.json();

                setApplications(data);
                setError("");

            } catch (err) {
                console.error("Applications error:", err);

                setError(
                    err.message ||
                    "Unable to load your applications."
                );

            } finally {
                setLoading(false);
            }
        };

        loadApplications();
    }, []);

    // ==========================================
    // COMPANY LETTER
    // ==========================================

    const getCompanyLetter = (organization) => {
        if (!organization) {
            return "?";
        }

        return organization
            .charAt(0)
            .toUpperCase();
    };

    // ==========================================
    // COMPANY STYLE
    // ==========================================

    const getCompanyClass = (organization) => {
        if (!organization) {
            return "company-default";
        }

        const name = organization.toLowerCase();

        if (name.includes("google")) {
            return "company-google";
        }

        if (name.includes("amazon")) {
            return "company-amazon";
        }

        if (name.includes("microsoft")) {
            return "company-microsoft";
        }

                    if (name.includes("ibm")) {
                return "company-ibm";
            }

            if (name.includes("adobe")) {
                return "company-adobe";
            }

            if (name.includes("tcs")) {
                return "company-tcs";
            }

            if (name.includes("infosys")) {
                return "company-infosys";
            }

            if (name.includes("oracle")) {
                return "company-oracle";
            }

            if (name.includes("wipro")) {
                return "company-wipro";
            }

            return "company-default";
    };

    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusClass = (status) => {
        if (!status) {
            return "status-applied";
        }

        return `status-${status
            .toLowerCase()
            .replaceAll("_", "-")}`;
    };

    // ==========================================
    // FORMAT STATUS
    // ==========================================

    const formatStatus = (status) => {
        if (!status) {
            return "APPLIED";
        }

        return status.replaceAll("_", " ");
    };

    // ==========================================
    // DELETE APPLICATION
    // ==========================================

    const deleteApplication = async (applicationId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            window.location.assign("/");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to remove this application?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(applicationId);

            const response = await fetch(
                `https://opportunityhub-backend-shiw.onrender.com/api/applications/${applicationId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("email");

                alert(
                    "Your session has expired. Please login again."
                );

                window.location.assign("/");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    "Unable to remove application."
                );
            }

            setApplications((currentApplications) =>
                currentApplications.filter(
                    (application) =>
                        application.id !== applicationId
                )
            );

        } catch (err) {
            console.error(
                "Delete application error:",
                err
            );

            alert(
                err.message ||
                "Unable to remove application."
            );

        } finally {
            setDeletingId(null);
        }
    };

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="dashboard">

            {/* COMMON NAVBAR */}

            <Navbar />

            {/* MAIN CONTENT */}

            <main className="dashboard-content">

                {/* WELCOME */}

                <section className="welcome-section">

                    <div>

                        <p className="welcome-label">
                            APPLICATION TRACKER
                        </p>

                        <h1>
                            My Applications 📋
                        </h1>

                        <p className="welcome-text">
                            Track the opportunities you have
                            applied for and monitor your progress.
                        </p>

                    </div>

                    <div className="welcome-illustration">
                        📋
                    </div>

                </section>

                {/* APPLICATION CARD */}

                <section className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <p className="card-label">
                                YOUR APPLICATIONS
                            </p>

                            <h2>
                                {applications.length} Applications
                            </h2>

                        </div>

                    </div>

                    {/* LOADING */}

                    {loading && (
                        <p
                            style={{
                                marginTop: "25px"
                            }}
                        >
                            Loading your applications...
                        </p>
                    )}

                    {/* ERROR */}

                    {!loading && error && (
                        <div
                            style={{
                                marginTop: "25px"
                            }}
                        >

                            <p>
                                {error}
                            </p>

                            <button
                                className="apply-btn"
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>

                        </div>
                    )}

                    {/* NO APPLICATIONS */}

                    {!loading &&
                        !error &&
                        applications.length === 0 && (

                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "50px 20px"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: "50px",
                                        marginBottom: "15px"
                                    }}
                                >
                                    📭
                                </div>

                                <h3>
                                    No applications yet
                                </h3>

                                <p>
                                    Start exploring opportunities
                                    and apply for the ones that
                                    match your career goals.
                                </p>

                                <a
                                    href="/opportunities"
                                    className="apply-btn"
                                    style={{
                                        display: "inline-block",
                                        marginTop: "15px",
                                        textDecoration: "none"
                                    }}
                                >
                                    Explore Opportunities
                                </a>

                            </div>
                        )}

                    {/* APPLICATION LIST */}

                    {!loading &&
                        !error &&
                        applications.length > 0 && (

                            <div className="opportunity-list">

                                {applications.map((application) => {

                                    const opportunity =
                                        application.opportunity;

                                    return (

                                        <div
                                            className="opportunity-item"
                                            key={application.id}
                                        >

                                            {/* COMPANY LOGO */}

                                            <div
                                                className={`company-logo ${getCompanyClass(
                                                    opportunity?.organization
                                                )}`}
                                            >
                                                {getCompanyLetter(
                                                    opportunity?.organization
                                                )}
                                            </div>

                                            {/* DETAILS */}

                                            <div className="opportunity-info">

                                                <h3>
                                                    {opportunity?.title ||
                                                        "Opportunity"}
                                                </h3>

                                                <p>
                                                    {opportunity?.organization ||
                                                        "Organization"}
                                                    {" · "}
                                                    {opportunity?.location ||
                                                        "Location"}
                                                </p>

                                                <div className="tags">

                                                    {opportunity?.type && (
                                                        <span>
                                                            {opportunity.type}
                                                        </span>
                                                    )}

                                                    {opportunity?.skills &&
                                                        opportunity.skills
                                                            .split(",")
                                                            .slice(0, 3)
                                                            .map((skill) => (

                                                                <span
                                                                    key={skill.trim()}
                                                                >
                                                                    {skill.trim()}
                                                                </span>

                                                            ))
                                                    }

                                                </div>

                                                {opportunity?.deadline && (
                                                    <small>
                                                        Deadline:{" "}
                                                        {opportunity.deadline}
                                                    </small>
                                                )}

                                            </div>

                                            {/* STATUS */}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-end",
                                                    gap: "10px"
                                                }}
                                            >

                                                <span
                                                    className={`application-status ${getStatusClass(
                                                        application.status
                                                    )}`}
                                                >
                                                    {formatStatus(
                                                        application.status
                                                    )}
                                                </span>

                                                <p className="status-note">
                                                    Status is updated by the recruiter/admin.
                                                </p>

                                                {/* DELETE BUTTON */}

                                                <button
                                                    className="secondary-btn"
                                                    onClick={() =>
                                                        deleteApplication(
                                                            application.id
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId ===
                                                        application.id
                                                    }
                                                >
                                                    {deletingId ===
                                                    application.id
                                                        ? "Removing..."
                                                        : "Remove"}
                                                </button>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                </section>

            </main>

            {/* FOOTER */}

            <footer className="dashboard-footer">
                © 2026 OpportunityHub · Your future starts here 🚀
            </footer>

        </div>
    );
}

export default Applications;
