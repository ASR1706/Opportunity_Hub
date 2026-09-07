import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./App.css";

function Opportunities() {

    const [opportunities, setOpportunities] = useState([]);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [savingId, setSavingId] = useState(null);
    const [savedIds, setSavedIds] = useState([]);

    const userId = Number(localStorage.getItem("userId"));


    // =====================================================
    // LOAD OPPORTUNITIES
    // =====================================================

    useEffect(() => {

        let cancelled = false;

        const loadOpportunities = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    "https://opportunityhub-backend-shiw.onrender.com/api/opportunities",
                    {
                        method: "GET",
                        headers: token
                            ? new Headers({
                                Authorization:
                                    `Bearer ${token}`
                            })
                            : undefined
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Unable to load opportunities"
                    );
                }

                const data =
                    await response.json();

                if (!cancelled) {
                    setOpportunities(data);
                }

            } catch (err) {

                console.error(
                    "Opportunities error:",
                    err
                );

                if (!cancelled) {
                    setError(
                        "Unable to load opportunities."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadOpportunities();

        return () => {
            cancelled = true;
        };

    }, []);


    // =====================================================
    // LOAD SAVED OPPORTUNITIES
    // =====================================================

    useEffect(() => {

        let cancelled = false;

        const loadSaved = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {

                const response =
                    await fetch(
                        `https://opportunityhub-backend-shiw.onrender.com/api/saved/${userId}`,
                        {
                            method: "GET",
                            headers: new Headers({
                                Authorization:
                                    `Bearer ${token}`
                            })
                        }
                    );

                if (!response.ok) {
                    return;
                }

                const data =
                    await response.json();

                if (!cancelled) {

                    const ids =
                        data
                            .map(
                                item =>
                                    item.opportunity?.id
                            )
                            .filter(Boolean);

                    setSavedIds(ids);
                }

            } catch (err) {

                console.error(
                    "Saved opportunities error:",
                    err
                );
            }
        };

        loadSaved();

        return () => {
            cancelled = true;
        };

    }, []);


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filtered =
        opportunities.filter(
            (opportunity) => {

                const value =
                    search.trim().toLowerCase();

                const matchesSearch =
                    !value ||
                    opportunity.title
                        ?.toLowerCase()
                        .includes(value) ||
                    opportunity.organization
                        ?.toLowerCase()
                        .includes(value) ||
                    opportunity.location
                        ?.toLowerCase()
                        .includes(value) ||
                    opportunity.skills
                        ?.toLowerCase()
                        .includes(value);

                const matchesType =
                    type === "ALL" ||
                    opportunity.type
                        ?.toLowerCase() ===
                    type.toLowerCase();

                return (
                    matchesSearch &&
                    matchesType
                );
            }
        );


    // =====================================================
    // COMPANY LETTER
    // =====================================================

    const getCompanyLetter =
        (organization) => {

            if (!organization) {
                return "?";
            }

            return organization
                .charAt(0)
                .toUpperCase();
        };


    // =====================================================
    // COMPANY STYLE
    // =====================================================

    const getCompanyClass =
        (organization) => {

            if (!organization) {
                return "company-default";
            }

            const name =
                organization.toLowerCase();

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
                `https://opportunityhub-backend-shiw.onrender.com/api/applications/${userId}/${opportunity.id}`,
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

    // =====================================================
    // SAVE
    // =====================================================

    const handleSave =
        async (opportunity) => {

            const token =
                localStorage.getItem("token");

            if (!token) {

                alert(
                    "Please login before saving."
                );

                window.location.assign("/");

                return;
            }

            if (
                savedIds.includes(
                    opportunity.id
                )
            ) {

                alert(
                    "Opportunity is already saved."
                );

                return;
            }

            try {

                setSavingId(
                    opportunity.id
                );

                const response =
                    await fetch(
                        `https://opportunityhub-backend-shiw.onrender.com/api/saved/${userId}/${opportunity.id}`,
                        {
                            method: "POST",
                            headers: new Headers({
                                Authorization:
                                    `Bearer ${token}`
                            })
                        }
                    );

                const text =
                    await response.text();

                if (!response.ok) {

                    alert(
                        text ||
                        "Unable to save opportunity."
                    );

                    return;
                }

                setSavedIds(
                    previous => [
                        ...previous,
                        opportunity.id
                    ]
                );

            } catch (err) {

                console.error(
                    "Save error:",
                    err
                );

                alert(
                    "Unable to save opportunity."
                );

            } finally {

                setSavingId(null);
            }
        };

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="dashboard">

            {/* =================================================
                NAVBAR
            ================================================= */}

            <Navbar />


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="dashboard-content">


                {/* =================================================
                    WELCOME
                ================================================= */}

                <section className="welcome-section">

                    <div>

                        <p className="welcome-label">
                            EXPLORE YOUR FUTURE
                        </p>

                        <h1>
                            Find Opportunities 🚀
                        </h1>

                        <p className="welcome-text">
                            Discover internships and jobs
                            that match your skills and
                            career goals.
                        </p>

                    </div>


                    <div className="welcome-illustration">
                        💼
                    </div>

                </section>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <section className="dashboard-card">

                    <div className="card-header">

                        <div>

                            <p className="card-label">
                                SEARCH
                            </p>

                            <h2>
                                Find your next opportunity
                            </h2>

                        </div>

                    </div>


                    <div
                        style={{
                            display: "flex",
                            gap: "15px",
                            marginTop: "20px",
                            flexWrap: "wrap"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Search by title, company, location or skill..."
                            value={search}
                            onChange={
                                (e) =>
                                    setSearch(
                                        e.target.value
                                    )
                            }
                            style={{
                                flex: "1",
                                minWidth: "280px",
                                padding:
                                    "14px 18px",
                                borderRadius:
                                    "12px",
                                border:
                                    "1px solid #ddd",
                                fontSize: "15px",
                                outline: "none"
                            }}
                        />


                        <select
                            value={type}
                            onChange={
                                (e) =>
                                    setType(
                                        e.target.value
                                    )
                            }
                            style={{
                                padding:
                                    "14px 18px",
                                borderRadius:
                                    "12px",
                                border:
                                    "1px solid #ddd",
                                fontSize: "15px",
                                background:
                                    "white",
                                minWidth:
                                    "160px"
                            }}
                        >

                            <option value="ALL">
                                All Types
                            </option>

                            <option value="Internship">
                                Internship
                            </option>

                            <option value="Full Time">
                                Full Time
                            </option>

                            <option value="Part Time">
                                Part Time
                            </option>

                        </select>

                    </div>

                </section>


                {/* =================================================
                    OPPORTUNITY LIST
                ================================================= */}

                <section
                    className="dashboard-card"
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <div className="card-header">

                        <div>

                            <p className="card-label">
                                AVAILABLE OPPORTUNITIES
                            </p>

                            <h2>
                                {filtered.length}
                                {" "}
                                Opportunities
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
                            Loading opportunities...
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


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        filtered.length === 0 && (

                            <p
                                style={{
                                    marginTop:
                                        "25px"
                                }}
                            >
                                No opportunities found.
                            </p>

                        )}


                    {/* LIST */}

                    {!loading &&
                        !error &&
                        filtered.length > 0 && (

                            <div className="opportunity-list">

                                {filtered.map(
                                    (opportunity) => (

                                        <div
                                            className="opportunity-item"
                                            key={
                                                opportunity.id
                                            }
                                        >

                                            {/* COMPANY */}

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


                                            {/* DETAILS */}

                                            <div className="opportunity-info">

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
                                                            .slice(
                                                                0,
                                                                3
                                                            )
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
                                                    display:
                                                        "flex",
                                                    gap:
                                                        "10px",
                                                    alignItems:
                                                        "center",
                                                    flexWrap:
                                                        "wrap"
                                                }}
                                            >

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


                                                <button
                                                    className="apply-btn"
                                                    onClick={() =>
                                                        handleSave(
                                                            opportunity
                                                        )
                                                    }
                                                    disabled={
                                                        savingId ===
                                                        opportunity.id
                                                    }
                                                >

                                                    {savingId ===
                                                    opportunity.id
                                                        ? "Saving..."
                                                        : savedIds.includes(
                                                            opportunity.id
                                                        )
                                                            ? "Saved ✓"
                                                            : "Save"}

                                                </button>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </section>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="dashboard-footer">

                © 2026 OpportunityHub · Your future starts here 🚀

            </footer>

        </div>
    );
}

export default Opportunities;
