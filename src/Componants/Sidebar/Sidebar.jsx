import React from "react";
import { MdDashboard, MdSettings } from "react-icons/md";
import { GrDocumentTime } from "react-icons/gr";
import { useNavigate, useLocation } from "react-router-dom";
import { SlLogout } from "react-icons/sl";
import saharaLogo from "../../Assets/saharaLogo.png"


import Cookies from "js-cookie";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const handleListItemClick = (path) => {
    navigate(path);
  };

  const SidebarOptionList = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <MdDashboard />,
    },
    {
      title: "Visit Logs",
      path: "/visit-logs",
      icon: <GrDocumentTime />,
    },
    {
      title: "Setting",
      path: "/setting",
      icon: <MdSettings />,
    },
  ];

  const handleLogoutClicked = () => {
    Cookies.remove("auth");
    navigate("/");
  };

  function getCurrentISTDate() {
    let currentDate = new Date();
    let ISTOffset = 330 * 60 * 1000;
    currentDate.setTime(currentDate.getTime() + ISTOffset);

    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let day = days[currentDate.getUTCDay()];
    let date = currentDate.getUTCDate();
    let month = months[currentDate.getUTCMonth()];
    let year = currentDate.getUTCFullYear();

    let formattedDate = `${day}, ${date} ${month} ${year}`;

    return formattedDate;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "250px",
        background: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "1px 1px 5px #888888",
      }}
    >
      <div>
        <div style={{ textAlign: "center", padding: "0px 10px" }}>
        <img src={saharaLogo} alt="Maersk Logo" style={{ height: "40px", marginTop: "15px" }} />
          <h1 style={{ margin: "0px", paddingTop: "15px" }}>VMS</h1>
          <h5 style={{ margin: "0px", color: "#666666" }}>
            {getCurrentISTDate()}
          </h5>
          <hr />
        </div>
        <div>
          {SidebarOptionList.map((item) => {
            const isActive = location.pathname === item.path; // Check if the current route matches the item's path
            return (
              <div
                key={item.title}
                onClick={() => {
                  handleListItemClick(item.path);
                }}
                style={{
                  display: "flex",
                  padding: "10px 3em",
                  alignItems: "center",
                  cursor: "pointer",
                  borderLeft: isActive
                    ? "8px solid var(--secondary-color)"
                    : "8px solid transparent", // Add border conditionally
                  background: isActive ? "#F3F4F6" : "transparent", // Optional: Highlight the background of the active item
                }}
              >
                <span
                  style={{
                    color: "#6B7280",
                    marginRight: "7px",
                  }}
                >
                  {item.icon}
                </span>
                <span style={{ color: "#999999" }}>{item.title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <hr style={{margin:"10px 10px"}} />

        <div
          onClick={() => {
            handleLogoutClicked();
          }}
          style={{
            display: "flex",
            // padding: "10px 3em",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",

            // background: "#F3F4F6",
          }}
        >
          <span
            style={{
              color: "black",
              background: "#CCCCCC",
              cursor: "pointer",
              padding: "10px 3em",
              borderRadius: "5px",
              border: "1px solid #808080",
            }}
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
