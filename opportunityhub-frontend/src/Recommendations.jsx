import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function Recommendations() {

    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {

        let cancelled = false;

        const fetchRecommendations = async () => {

            try {

                if (!token) {

                    if (!cancelled) {
                        setError("You are not logged in.");
                        setLoading(false);
                    }

                    return;
                }

                const response = await fetch(
                    `http://localhost:8080/api/recommendations/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const text = await response.text();

                let data;

                try {
                    data = JSON.parse(text);
                } catch {
                    data = text;
                }

                if (!response.ok) {

                    throw new Error(
                        typeof data === "string"
                            ? data
                            : "Unable to load recommendations"
                    );
                }

                if (!cancelled) {

                    setRecommendations(
                        Array.isArray(data) ? data : []
                    );

                    setError("");
                    setLoading(false);
                }

            } catch (err) {

                console.error(
                    "Recommendation error:",
                    err
                );

                if (!cancelled) {

                    setError(
                        err.message ||
                        "Unable to load recommendations."
                    );

                    setLoading(false);
                }
            }
        };

        fetchRecommendations();

        return () => {
            cancelled = true;
        };

    }, [token]);

    const getCompanyLetter = (organization) => {

        if (!organization) {
            return "?";
        }

        return organization
            .charAt(0)
            .toUpperCase();
    };

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

            {/* ================= NAVBAR ================= */}

            <Navbar />

            {/* ================= MAIN ================= */}

            <main className="dashboard-content">

                {/* ================= HERO ================= */}

                <section className="welcome-section">

                    <div>

                        <p className="welcome-label">
                            SMART MATCHING
                        </p>

                        <h1>
                            Recommended For You 🎯
                        </h1>

                        <p className="welcome-text">
                            Discover opportunities matched to
                            your skills, interests and preferred
                            location.
                        </p>

                    </div>

                    <div className="welcome-illustration">
                        🎯
                    </div>

                </section>

                {/* ================= RECOMMENDATIONS ================= */}

                <section className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <p className="card-label">
                                SMART RECOMMENDATIONS
                            </p>

                            <h2>
                                Your Best Matches
                            </h2>

                        </div>

                    </div>

                    {/* LOADING */}

                    {loading && (

                        <div
                            style={{
                                marginTop: "30px",
                                textAlign: "center"
                            }}
                        >

                            <p>
                                Finding the best opportunities
                                for you...
                            </p>

                        </div>

                    )}

                    {/* ERROR */}

                    {!loading && error && (

                        <div
                            style={{
                                marginTop: "30px"
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

                    {/* NO RESULTS */}

                    {!loading &&
                        !error &&
                        recommendations.length === 0 && (

                            <div
                                style={{
                                    marginTop: "30px"
                                }}
                            >

                                <p>
                                    No recommendations available.
                                </p>

                            </div>

                        )}

                    {/* RESULTS */}

                    {!loading &&
                        !error &&
                        recommendations.length > 0 && (

                            <div className="opportunity-list">

                                {recommendations.map(
                                    (recommendation) => {

                                        const opportunity =
                                            recommendation.opportunity;

                                        if (!opportunity) {
                                            return null;
                                        }

                                        return (

                                            <div
                                                className="opportunity-item"
                                                key={
                                                    opportunity.id
                                                }
                                            >

                                                {/* COMPANY LOGO */}

                                                <div
                                                    className={
                                                        `company-logo ${
                                                            getCompanyClass(
                                                                opportunity.organization
                                                            )
                                                        }`
                                                    }
                                                >

                                                    {
                                                        getCompanyLetter(
                                                            opportunity.organization
                                                        )
                                                    }

                                                </div>

                                                {/* OPPORTUNITY DETAILS */}

                                                <div
                                                    className="opportunity-info"
                                                >

                                                    <h3>
                                                        {
                                                            opportunity.title
                                                        }
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

                                                    {/* TAGS */}

                                                    <div
                                                        className="tags"
                                                    >

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
                                                                .map(
                                                                    (
                                                                        skill
                                                                    ) => (

                                                                        <span
                                                                            key={
                                                                                skill.trim()
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

                                                    {/* MATCHED SKILLS */}

                                                    {recommendation
                                                        .matchedSkills
                                                        ?.length > 0 && (

                                                        <p
                                                            style={{
                                                                marginTop:
                                                                    "10px"
                                                            }}
                                                        >

                                                            <strong>
                                                                Matched Skills:
                                                            </strong>

                                                            {" "}

                                                            {
                                                                recommendation
                                                                    .matchedSkills
                                                                    .join(
                                                                        ", "
                                                                    )
                                                            }

                                                        </p>

                                                    )}

                                                    {/* DEADLINE */}

                                                    {opportunity.deadline && (

                                                        <small>

                                                            Deadline:{" "}
                                                            {
                                                                opportunity.deadline
                                                            }

                                                        </small>

                                                    )}

                                                </div>

                                                {/* MATCH SCORE */}

                                                <div
                                                    style={{
                                                        minWidth:
                                                            "110px",
                                                        textAlign:
                                                            "center"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            fontSize:
                                                                "28px",
                                                            fontWeight:
                                                                "bold"
                                                        }}
                                                    >

                                                        {
                                                            recommendation.matchScore
                                                        }%

                                                    </div>

                                                    <small>
                                                        Match
                                                    </small>

                                                    <br />

                                                    <button
                                                        className="apply-btn"
                                                        onClick={() =>
                                                            handleApply(
                                                                opportunity
                                                            )
                                                        }
                                                        style={{
                                                            marginTop:
                                                                "10px"
                                                        }}
                                                    >
                                                        Apply
                                                    </button>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                </section>

            </main>

            {/* ================= FOOTER ================= */}

            <footer className="dashboard-footer">

                © 2026 OpportunityHub · Your future starts here 🚀

            </footer>

        </div>
    );
}

export default Recommendations;
