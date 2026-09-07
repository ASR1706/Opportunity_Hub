import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userId = Number(localStorage.getItem("userId"));


    // ==========================================
    // LOAD DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        let cancelled = false;

        const loadData = async () => {

            const token = localStorage.getItem("token");

            if (!token) {

                if (!cancelled) {
                    setError("You are not logged in.");
                    setLoading(false);
                }

                return;
            }

            try {

                const [dashboardResponse, opportunitiesResponse] =
                    await Promise.all([
                        fetch(
                            `http://localhost:8080/api/dashboard/${userId}`,
                            {
                                method: "GET",
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json"
                                }
                            }
                        ),

                        fetch(
                            "http://localhost:8080/api/opportunities",
                            {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            }
                        )
                    ]);


                // ==========================================
                // CHECK LOGIN
                // ==========================================

                if (
                    dashboardResponse.status === 401 ||
                    dashboardResponse.status === 403
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    localStorage.removeItem("email");

                    if (!cancelled) {
                        setError(
                            "Your login session has expired. Please login again."
                        );
                        setLoading(false);
                    }

                    return;
                }


                // ==========================================
                // CHECK DASHBOARD RESPONSE
                // ==========================================

                if (!dashboardResponse.ok) {
                    throw new Error("Unable to load dashboard");
                }


                // ==========================================
                // READ DASHBOARD
                // ==========================================

                const dashboardData =
                    await dashboardResponse.json();


                // ==========================================
                // READ OPPORTUNITIES
                // ==========================================

                let opportunityData = [];

                if (opportunitiesResponse.ok) {

                    opportunityData =
                        await opportunitiesResponse.json();
                }


                // ==========================================
                // UPDATE STATE
                // ==========================================

                if (!cancelled) {

                    setDashboard(dashboardData);

                    setOpportunities(
                        Array.isArray(opportunityData)
                            ? opportunityData
                            : []
                    );

                    setLoading(false);
                }

            } catch (err) {

                console.error(
                    "Dashboard loading error:",
                    err
                );

                if (!cancelled) {

                    setError(
                        "Unable to load dashboard data."
                    );

                    setLoading(false);
                }
            }
        };


        loadData();


        return () => {
            cancelled = true;
        };

    }, []);


    // ==========================================
    // COMPANY LOGO LETTER
    // ==========================================

    const getCompanyLetter = (organization) => {

        if (!organization) {
            return "O";
        }

        const company =
            organization.toLowerCase();

        if (company.includes("google")) {
            return "G";
        }

        if (company.includes("amazon")) {
            return "A";
        }

        if (company.includes("microsoft")) {
            return "M";
        }

        return organization
            .charAt(0)
            .toUpperCase();
    };


    // ==========================================
    // COMPANY LOGO CLASS
    // ==========================================

    const getCompanyClass = (organization) => {

        if (!organization) {
            return "";
        }

        const company =
            organization.toLowerCase();

        if (company.includes("google")) {
            return "google";
        }

        if (company.includes("amazon")) {
            return "amazon";
        }

        if (company.includes("microsoft")) {
            return "microsoft";
        }

                if (company.includes("ibm")) {
            return "ibm";
        }

        if (company.includes("adobe")) {
            return "adobe";
        }

        if (company.includes("tcs")) {
            return "tcs";
        }

        if (company.includes("infosys")) {
            return "infosys";
        }

        if (company.includes("oracle")) {
            return "oracle";
        }

        if (company.includes("wipro")) {
            return "wipro";
        }

        return "default";
    };



    // =====================================================
    // APPLY
    // =====================================================

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
    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {

        return (
            <div className="dashboard">

                <Navbar />

                <main className="dashboard-content">

                    <section className="welcome-section">

                        <div>

                            <p className="welcome-label">
                                YOUR CAREER DASHBOARD
                            </p>

                            <h1>
                                Loading your dashboard...
                            </h1>

                            <p className="welcome-text">
                                Please wait while we load your OpportunityHub data.
                            </p>

                        </div>

                        <div className="welcome-illustration">
                            🚀
                        </div>

                    </section>

                </main>

            </div>
        );
    }


    // ==========================================
    // ERROR SCREEN
    // ==========================================

    if (error) {

        return (
            <div className="dashboard">

                <Navbar />

                <main className="dashboard-content">

                    <section className="welcome-section">

                        <div>

                            <p className="welcome-label">
                                OPPORTUNITYHUB
                            </p>

                            <h1>
                                Something went wrong
                            </h1>

                            <p className="welcome-text">
                                {error}
                            </p>

                            <button
                                className="apply-btn"
                                onClick={() => {
                                    window.location.href = "/";
                                }}
                            >
                                Login Again
                            </button>

                        </div>

                        <div className="welcome-illustration">
                            ⚠️
                        </div>

                    </section>

                </main>

            </div>
        );
    }


    // ==========================================
    // MAIN DASHBOARD
    // ==========================================

    return (

        <div className="dashboard">


            {/* ==========================================
                BACKGROUND DECORATION
            ========================================== */}

            <div className="dashboard-bg-circle circle-one"></div>

            <div className="dashboard-bg-circle circle-two"></div>

            <div className="dashboard-bg-circle circle-three"></div>


            {/* ==========================================
                NAVBAR
            ========================================== */}

            <Navbar />


            {/* ==========================================
                MAIN CONTENT
            ========================================== */}

            <main className="dashboard-content">


                {/* ==========================================
                    WELCOME
                ========================================== */}

                <section className="welcome-section">

                    <div>

                        <p className="welcome-label">
                            YOUR CAREER DASHBOARD
                        </p>

                        <h1>
                            Welcome back! 👋
                        </h1>

                        <p className="welcome-text">
                            Discover opportunities, build your career,
                            and take the next step toward your future.
                        </p>

                    </div>

                    <div className="welcome-illustration">
                        🚀
                    </div>

                </section>


                {/* ==========================================
                    STATISTICS
                ========================================== */}

                <section className="stats-grid">


                    {/* OPPORTUNITIES */}

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            💼
                        </div>

                        <div>

                            <h3>
                                {
                                    dashboard?.totalOpportunities ??
                                    opportunities.length
                                }
                            </h3>

                            <p>
                                Opportunities
                            </p>

                        </div>

                    </div>


                    {/* APPLICATIONS */}

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            📄
                        </div>

                        <div>

                            <h3>
                                {dashboard?.totalApplications ?? 0}
                            </h3>

                            <p>
                                Applications
                            </p>

                        </div>

                    </div>


                    {/* SAVED JOBS */}

                    <div className="stat-card">

                        <div className="stat-icon cyan">
                            ⭐
                        </div>

                        <div>

                            <h3>
                                {dashboard?.savedOpportunities ?? 0}
                            </h3>

                            <p>
                                Saved Jobs
                            </p>

                        </div>

                    </div>


                    {/* MATCHES */}

                    <div className="stat-card">

                        <div className="stat-icon pink">
                            🎯
                        </div>

                        <div>

                            <h3>
                                {dashboard?.shortlisted ?? 0}
                            </h3>

                            <p>
                                Matches
                            </p>

                        </div>

                    </div>

                </section>


                {/* ==========================================
                    DASHBOARD GRID
                ========================================== */}

                <section className="dashboard-grid">


                    {/* ==========================================
                        FEATURED OPPORTUNITIES
                    ========================================== */}

                    <div className="dashboard-card opportunities-card">

                        <div className="card-header">

                            <div>

                                <p className="card-label">
                                    RECOMMENDED FOR YOU
                                </p>

                                <h2>
                                    Featured Opportunities
                                </h2>

                            </div>

                            <button
                                className="view-all-btn"
                                onClick={() => {
                                    window.location.href =
                                        "/opportunities";
                                }}
                            >
                                View all →
                            </button>

                        </div>


                        <div className="opportunity-list">

                            {opportunities.length === 0 ? (

                                <div className="opportunity-item">

                                    <div className="opportunity-info">

                                        <h3>
                                            No opportunities available
                                        </h3>

                                        <p>
                                            Check back later for new opportunities.
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                opportunities
                                    .slice(0, 5)
                                    .map((opportunity) => (

                                        <div
                                            className="opportunity-item"
                                            key={opportunity.id}
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
                                                        opportunity.organization ||
                                                        "Organization"
                                                    }

                                                    {" · "}

                                                    {
                                                        opportunity.location ||
                                                        "Remote"
                                                    }

                                                </p>


                                                <div className="tags">

                                                    {opportunity.type && (

                                                        <span>
                                                            {opportunity.type}
                                                        </span>

                                                    )}


                                                    {opportunity.skills && (

                                                        opportunity.skills
                                                            .split(",")
                                                            .slice(0, 2)
                                                            .map(
                                                                (
                                                                    skill,
                                                                    index
                                                                ) => (

                                                                    <span
                                                                        key={index}
                                                                    >
                                                                        {
                                                                            skill.trim()
                                                                        }
                                                                    </span>

                                                                )
                                                            )

                                                    )}

                                                </div>

                                            </div>


                                            {/* APPLY */}

                                            <button className="apply-btn" onClick={() => handleApply(opportunity)}>
                                                Apply
                                            </button>

                                        </div>

                                    ))

                            )}

                        </div>

                    </div>


                    {/* ==========================================
                        QUICK ACTIONS
                    ========================================== */}

                    <div className="dashboard-card quick-card">

                        <p className="card-label">
                            QUICK ACTIONS
                        </p>

                        <h2>
                            What would you like to do?
                        </h2>


                        <div className="quick-actions">


                            {/* FIND OPPORTUNITIES */}

                            <button
                                className="quick-action"
                                onClick={() => {
                                    window.location.href =
                                        "/opportunities";
                                }}
                            >

                                <span>
                                    🔍
                                </span>

                                <div>

                                    <strong>
                                        Find Opportunities
                                    </strong>

                                    <small>
                                        Explore jobs & internships
                                    </small>

                                </div>

                                <b>
                                    →
                                </b>

                            </button>


                            {/* APPLICATIONS */}

                            <button
                                className="quick-action"
                                onClick={() => {
                                    window.location.href =
                                        "/applications";
                                }}
                            >

                                <span>
                                    📋
                                </span>

                                <div>

                                    <strong>
                                        My Applications
                                    </strong>

                                    <small>
                                        Track your applications
                                    </small>

                                </div>

                                <b>
                                    →
                                </b>

                            </button>


                            {/* SAVED */}

                            <button
                                className="quick-action"
                                onClick={() => {
                                    window.location.href =
                                        "/saved";
                                }}
                            >

                                <span>
                                    ⭐
                                </span>

                                <div>

                                    <strong>
                                        Saved Opportunities
                                    </strong>

                                    <small>
                                        View your saved jobs
                                    </small>

                                </div>

                                <b>
                                    →
                                </b>

                            </button>


                        </div>

                    </div>

                </section>


                {/* ==========================================
                    CAREER TIP
                ========================================== */}

                <section className="career-tip">

                    <div className="tip-icon">
                        💡
                    </div>

                    <div>

                        <p className="card-label">
                            CAREER TIP
                        </p>

                        <h3>
                            Keep your profile updated
                        </h3>

                        <p>
                            A complete profile helps you discover
                            opportunities that match your skills and interests.
                        </p>

                    </div>

                    <button
                        onClick={() => {
                            window.location.href =
                                "/profile";
                        }}
                    >
                        Complete Profile →
                    </button>

                </section>

            </main>


            {/* ==========================================
                FOOTER
            ========================================== */}

            <footer className="dashboard-footer">

                © 2026 OpportunityHub · Your future starts here 🚀

            </footer>

        </div>
    );
}

export default Dashboard;
