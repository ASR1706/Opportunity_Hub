import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function SavedOpportunities() {
    const [saved, setSaved] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [applyingId, setApplyingId] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    const userId = Number(localStorage.getItem("userId"));

    // ==========================================
    // LOAD SAVED OPPORTUNITIES
    // ==========================================

    const loadSavedOpportunities = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please login to view your saved opportunities.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/saved/${userId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load saved opportunities"
                );
            }

            const data = await response.json();

            setSaved(data);

        } catch (err) {
            console.error(
                "Saved opportunities error:",
                err
            );

            setError(
                "Unable to load saved opportunities."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        const load = async () => {
            await loadSavedOpportunities();
        };

        load();
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
    // COMPANY CLASS
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
    // REMOVE SAVED OPPORTUNITY
    // ==========================================

    const handleRemove = async (opportunityId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login again.");
            window.location.replace("/");
            return;
        }

        try {
            setRemovingId(opportunityId);

            const response = await fetch(
                `http://localhost:8080/api/saved/${userId}/${opportunityId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const text = await response.text();

            if (!response.ok) {
                throw new Error(
                    text ||
                    "Unable to remove saved opportunity"
                );
            }

            setSaved((previous) =>
                previous.filter(
                    (item) =>
                        item.opportunity?.id !== opportunityId
                )
            );

            alert(
                "Opportunity removed from saved jobs."
            );

        } catch (err) {
            console.error(
                "Remove saved error:",
                err
            );

            alert(
                err.message ||
                "Unable to remove opportunity."
            );

        } finally {
            setRemovingId(null);
        }
    };

    // ==========================================
    // APPLY
    // ==========================================

    const handleApply = async (opportunity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login before applying.");
            window.location.replace("/");
            return;
        }

        try {
            setApplyingId(opportunity.id);

            const response = await fetch(
                `http://localhost:8080/api/applications/${userId}/${opportunity.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const text = await response.text();

            if (!response.ok) {
                throw new Error(
                    text ||
                    "Unable to submit application"
                );
            }

            alert(
                "Application submitted successfully!"
            );

            if (
                opportunity.applicationLink &&
                !opportunity.applicationLink.toLowerCase().includes("example.com")
            ) {
                window.open(
                    opportunity.applicationLink,
                    "_blank",
                    "noopener,noreferrer"
                );
            }

        } catch (err) {
            console.error(
                "Application error:",
                err
            );

            alert(
                err.message ||
                "Unable to submit application."
            );

        } finally {
            setApplyingId(null);
        }
    };

    // =====================================================
    // PAGE
    // ==========================================

    return (
        <div className="dashboard">

            {/* NAVBAR */}

            <Navbar />

            {/* MAIN */}

            <main className="dashboard-content">

                {/* HEADER */}

                <section className="welcome-section">

                    <div>

                        <p className="welcome-label">
                            YOUR SAVED OPPORTUNITIES
                        </p>

                        <h1>
                            Saved Jobs ⭐
                        </h1>

                        <p className="welcome-text">
                            Keep track of opportunities you
                            want to explore later.
                        </p>

                    </div>

                    <div className="welcome-illustration">
                        ⭐
                    </div>

                </section>

                {/* SAVED LIST */}

                <section className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <p className="card-label">
                                SAVED OPPORTUNITIES
                            </p>

                            <h2>
                                {saved.length} Saved Jobs
                            </h2>

                        </div>

                    </div>

                    {/* LOADING */}

                    {loading && (
                        <p style={{ marginTop: "25px" }}>
                            Loading saved opportunities...
                        </p>
                    )}

                    {/* ERROR */}

                    {!loading && error && (

                        <div style={{ marginTop: "25px" }}>

                            <p>
                                {error}
                            </p>

                            <button
                                className="apply-btn"
                                onClick={loadSavedOpportunities}
                            >
                                Try Again
                            </button>

                        </div>

                    )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        saved.length === 0 && (

                            <div
                                style={{
                                    marginTop: "25px"
                                }}
                            >

                                <p>
                                    You haven't saved any
                                    opportunities yet.
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

                    {/* SAVED OPPORTUNITIES */}

                    {!loading &&
                        !error &&
                        saved.length > 0 && (

                            <div className="opportunity-list">

                                {saved.map((item) => {

                                    const opportunity =
                                        item.opportunity;

                                    if (!opportunity) {
                                        return null;
                                    }

                                    return (

                                        <div
                                            className="opportunity-item"
                                            key={item.id}
                                        >

                                            {/* COMPANY */}

                                            <div
                                                className={`company-logo ${getCompanyClass(
                                                    opportunity.organization
                                                )}`}
                                            >
                                                {getCompanyLetter(
                                                    opportunity.organization
                                                )}
                                            </div>

                                            {/* DETAILS */}

                                            <div className="opportunity-info">

                                                <h3>
                                                    {opportunity.title}
                                                </h3>

                                                <p>
                                                    {
                                                        opportunity.organization
                                                    }
                                                    {" · "}
                                                    {
                                                        opportunity.location
                                                    }
                                                </p>

                                                <div className="tags">

                                                    {opportunity.type && (
                                                        <span>
                                                            {
                                                                opportunity.type
                                                            }
                                                        </span>
                                                    )}

                                                    {opportunity.skills &&
                                                        opportunity.skills
                                                            .split(",")
                                                            .slice(0, 3)
                                                            .map((skill) => (

                                                                <span
                                                                    key={
                                                                        skill.trim()
                                                                    }
                                                                >
                                                                    {
                                                                        skill.trim()
                                                                    }
                                                                </span>

                                                            ))
                                                    }

                                                </div>

                                                {opportunity.deadline && (
                                                    <small>
                                                        Deadline:{" "}
                                                        {
                                                            opportunity.deadline
                                                        }
                                                    </small>
                                                )}

                                            </div>

                                            {/* ACTIONS */}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "10px",
                                                    alignItems: "center"
                                                }}
                                            >

                                                <button
                                                    className="apply-btn"
                                                    disabled={
                                                        applyingId ===
                                                        opportunity.id
                                                    }
                                                    onClick={() =>
                                                        handleApply(
                                                            opportunity
                                                        )
                                                    }
                                                >
                                                    {applyingId ===
                                                    opportunity.id
                                                        ? "Applying..."
                                                        : "Apply"}
                                                </button>

                                                <button
                                                    className="apply-btn"
                                                    disabled={
                                                        removingId ===
                                                        opportunity.id
                                                    }
                                                    onClick={() =>
                                                        handleRemove(
                                                            opportunity.id
                                                        )
                                                    }
                                                >
                                                    {removingId ===
                                                    opportunity.id
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

export default SavedOpportunities;
