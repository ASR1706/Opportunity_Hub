import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function DeadlineAlerts() {

    const [deadlines, setDeadlines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {

        let cancelled = false;

        const fetchDeadlines = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    if (!cancelled) {
                        setError("You are not logged in.");
                        setLoading(false);
                    }
                    return;
                }

                const response = await fetch(
                    "http://localhost:8080/api/deadlines",
                    {
                        method: "GET",
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
                    localStorage.removeItem("userId");

                    if (!cancelled) {
                        setError("Your login session has expired. Please login again.");
                        setLoading(false);
                    }

                    return;
                }

                if (!response.ok) {
                    if (!cancelled) {
                        setError("Unable to load upcoming deadlines.");
                        setLoading(false);
                    }
                    return;
                }

                const data = await response.json();

                if (!cancelled) {
                    setDeadlines(data);
                    setError("");
                    setLoading(false);
                }

            } catch (err) {

                console.error("Deadline error:", err);

                if (!cancelled) {
                    setError("Unable to connect to the backend.");
                    setLoading(false);
                }
            }
        };

        fetchDeadlines();

        return () => {
            cancelled = true;
        };

    }, []);


    // =========================================================
    // COMPANY LETTER
    // =========================================================

    const getCompanyLetter = (organization) => {

        if (!organization) {
            return "?";
        }

        return organization.charAt(0).toUpperCase();
    };


    // =========================================================
    // COMPANY STYLE
    // =========================================================

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


    // =========================================================
    // URGENCY STYLE
    // =========================================================

    const getUrgencyClass = (urgency) => {

        if (!urgency) {
            return "deadline-normal";
        }

        const value = urgency.toLowerCase();

        if (
            value.includes("urgent") ||
            value.includes("critical")
        ) {
            return "deadline-urgent";
        }

        if (value.includes("soon")) {
            return "deadline-soon";
        }

        return "deadline-normal";
    };


    // =========================================================
    // APPLY
    // =========================================================

    const handleApply = async (opportunity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login before applying.");
            window.location.assign("/");
            return;
        }

        try {
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
                alert(text || "Unable to submit application.");
                return;
            }

            alert(`Application submitted successfully for ${opportunity.title}!`);

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
            console.error("Application error:", err);
            alert("Unable to submit application.");
        }
    };

    return (

        <div className="dashboard">

            {/* ================================
                NAVBAR
            ================================= */}

            <Navbar />


            {/* ================================
                MAIN
            ================================= */}

            <main className="dashboard-content">


                {/* ================================
                    HERO
                ================================= */}

                <section className="welcome-section">

                    <div>

                        <p className="welcome-label">
                            DEADLINE ALERTS
                        </p>

                        <h1>
                            Don't Miss Your Deadlines ⏰
                        </h1>

                        <p className="welcome-text">
                            Keep track of upcoming opportunity
                            deadlines and apply before time runs out.
                        </p>

                    </div>


                    <div className="welcome-illustration">
                        ⏰
                    </div>

                </section>


                {/* ================================
                    DEADLINE CARD
                ================================= */}

                <section className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <p className="card-label">
                                UPCOMING DEADLINES
                            </p>

                            <h2>
                                {deadlines.length} Opportunities
                            </h2>

                        </div>

                    </div>


                    {/* LOADING */}

                    {loading && (

                        <p style={{ marginTop: "25px" }}>
                            Loading upcoming deadlines...
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
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>

                        </div>

                    )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        deadlines.length === 0 && (

                            <p
                                style={{
                                    marginTop: "25px"
                                }}
                            >
                                No upcoming deadlines found.
                            </p>

                        )}


                    {/* DEADLINES */}

                    {!loading &&
                        !error &&
                        deadlines.length > 0 && (

                            <div className="opportunity-list">

                                {deadlines.map((item) => {

                                    const opportunity =
                                        item.opportunity;

                                    return (

                                        <div
                                            className="opportunity-item"
                                            key={
                                                opportunity?.id
                                            }
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


                                            {/* OPPORTUNITY INFO */}

                                            <div className="opportunity-info">

                                                <h3>
                                                    {
                                                        opportunity?.title
                                                    }
                                                </h3>


                                                <p>
                                                    {
                                                        opportunity?.organization
                                                    }
                                                    {" · "}
                                                    {
                                                        opportunity?.location
                                                    }
                                                </p>


                                                {/* TAGS */}

                                                <div className="tags">

                                                    {opportunity?.type && (

                                                        <span>
                                                            {
                                                                opportunity.type
                                                            }
                                                        </span>

                                                    )}


                                                    {opportunity?.skills &&

                                                        opportunity.skills
                                                            .split(",")
                                                            .slice(0, 3)
                                                            .map(
                                                                (skill) => (

                                                                    <span
                                                                        key={
                                                                            skill
                                                                        }
                                                                    >
                                                                        {
                                                                            skill.trim()
                                                                        }
                                                                    </span>

                                                                )
                                                            )

                                                    }

                                                </div>


                                                {/* DAYS LEFT */}

                                                <p
                                                    style={{
                                                        marginTop: "10px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    ⏳{" "}
                                                    {
                                                        item.daysLeft
                                                    }{" "}
                                                    days left
                                                </p>


                                                {/* DEADLINE */}

                                                {opportunity?.deadline && (

                                                    <small>
                                                        Deadline:{" "}
                                                        {
                                                            opportunity.deadline
                                                        }
                                                    </small>

                                                )}

                                            </div>


                                            {/* RIGHT SIDE */}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-end",
                                                    gap: "10px"
                                                }}
                                            >

                                                <span
                                                    className={getUrgencyClass(
                                                        item.urgency
                                                    )}
                                                >
                                                    {
                                                        item.urgency
                                                    }
                                                </span>


                                                <button
                                                    className="apply-btn"
                                                    onClick={() =>
                                                        handleApply(
                                                            opportunity
                                                        )
                                                    }
                                                >
                                                    Apply
                                                </button>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        )}

                </section>

            </main>


            {/* ================================
                FOOTER
            ================================= */}

            <footer className="dashboard-footer">

                © 2026 OpportunityHub · Your future starts here 🚀

            </footer>

        </div>
    );
}

export default DeadlineAlerts;
