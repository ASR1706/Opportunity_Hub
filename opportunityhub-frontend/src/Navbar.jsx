function Navbar() {
    const currentPath = window.location.pathname;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");

        window.location.href = "/";
    };

    const isActive = (path) => {
        return currentPath === path;
    };

    const navItemStyle = (active) => ({
        position: "relative",
        textDecoration: "none",
        color: active ? "#4f46e5" : "#475569",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.25s ease",
        padding: "28px 0",
        whiteSpace: "nowrap"
    });

    return (
        <nav
            className="navbar"
            style={{
                position: "relative",
                zIndex: 10,
                height: "76px",
                padding: "0 6%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255, 255, 255, 0.92)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
                boxShadow: "0 8px 30px rgba(31, 41, 55, 0.06)"
            }}
        >

            {/* BRAND */}

            <div
                className="brand"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    fontSize: "23px",
                    fontWeight: "800",
                    color: "#4f46e5",
                    whiteSpace: "nowrap"
                }}
            >

                <div
                    className="brand-icon"
                    style={{
                        width: "38px",
                        height: "38px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "11px",
                        color: "white",
                        fontWeight: "800",
                        background:
                            "linear-gradient(135deg, #4f46e5, #06b6d4)",
                        boxShadow:
                            "0 8px 20px rgba(79, 70, 229, 0.28)"
                    }}
                >
                    O
                </div>

                <span>
                    Opportunity
                    <span style={{ color: "#06b6d4" }}>
                        Hub
                    </span>
                </span>

            </div>


            {/* NAVIGATION */}

            <div
                className="nav-links"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "28px"
                }}
            >

                {/* HOME */}

                <a
                    href="/dashboard"
                    style={navItemStyle(
                        isActive("/dashboard")
                    )}
                >
                    Home

                    {isActive("/dashboard") && (
                        <span
                            style={{
                                position: "absolute",
                                height: "3px",
                                width: "100%",
                                left: "0",
                                bottom: "0",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(90deg, #4f46e5, #06b6d4)"
                            }}
                        />
                    )}
                </a>


                {/* OPPORTUNITIES */}

                <a
                    href="/opportunities"
                    style={navItemStyle(
                        isActive("/opportunities")
                    )}
                >
                    Opportunities

                    {isActive("/opportunities") && (
                        <span
                            style={{
                                position: "absolute",
                                height: "3px",
                                width: "100%",
                                left: "0",
                                bottom: "0",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(90deg, #4f46e5, #06b6d4)"
                            }}
                        />
                    )}
                </a>


                {/* APPLICATIONS */}

                <a
                    href="/applications"
                    style={navItemStyle(
                        isActive("/applications")
                    )}
                >
                    My Applications

                    {isActive("/applications") && (
                        <span
                            style={{
                                position: "absolute",
                                height: "3px",
                                width: "100%",
                                left: "0",
                                bottom: "0",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(90deg, #4f46e5, #06b6d4)"
                            }}
                        />
                    )}
                </a>


                {/* RECOMMENDATIONS */}

                <a
                    href="/recommendations"
                    style={navItemStyle(
                        isActive("/recommendations")
                    )}
                >
                    Recommendations

                    {isActive("/recommendations") && (
                        <span
                            style={{
                                position: "absolute",
                                height: "3px",
                                width: "100%",
                                left: "0",
                                bottom: "0",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(90deg, #4f46e5, #06b6d4)"
                            }}
                        />
                    )}
                </a>


                {/* DEADLINES */}

                <a
                    href="/deadlines"
                    style={navItemStyle(
                        isActive("/deadlines")
                    )}
                >
                    Deadlines

                    {isActive("/deadlines") && (
                        <span
                            style={{
                                position: "absolute",
                                height: "3px",
                                width: "100%",
                                left: "0",
                                bottom: "0",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(90deg, #4f46e5, #06b6d4)"
                            }}
                        />
                    )}
                </a>


                {/* SAVED JOBS */}

                <a
                    href="/saved"
                    style={navItemStyle(
                        isActive("/saved")
                    )}
                >
                    Saved Jobs

                    {isActive("/saved") && (
                        <span
                            style={{
                                position: "absolute",
                                height: "3px",
                                width: "100%",
                                left: "0",
                                bottom: "0",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(90deg, #4f46e5, #06b6d4)"
                            }}
                        />
                    )}
                </a>


                {/* PROFILE */}

                <a
                    href="/profile"
                    style={navItemStyle(
                        isActive("/profile")
                    )}
                >
                    Profile

                    {isActive("/profile") && (
                        <span
                            style={{
                                position: "absolute",
                                height: "3px",
                                width: "100%",
                                left: "0",
                                bottom: "0",
                                borderRadius: "10px",
                                background:
                                    "linear-gradient(90deg, #4f46e5, #06b6d4)"
                            }}
                        />
                    )}
                </a>


                {/* LOGOUT */}

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    style={{
                        border: "none",
                        padding: "11px 21px",
                        borderRadius: "10px",
                        background:
                            "linear-gradient(135deg, #4f46e5, #06b6d4)",
                        color: "white",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow:
                            "0 7px 18px rgba(79, 70, 229, 0.22)",
                        transition: "0.25s ease",
                        whiteSpace: "nowrap"
                    }}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;