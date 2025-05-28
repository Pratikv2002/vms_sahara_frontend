import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../authAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./ApproveReject.css";

export default function ApproveReject() {
  const { id, token } = useParams();
  const [isApproved, setIsApproved] = useState(false);
  const [visitDetails, setVisitDetails] = useState();
  const navigate = useNavigate();
  console.log(id);
  console.log(token);

  useEffect(() => {
    fetchVisitData();
  }, []);

  const fetchVisitData = () => {
    try {
      axios
        .get("/get-visitlog/" + id + "/" + token)
        .then((response) => {
          if (response.data.status) {
            setVisitDetails(response.data.data);
            console.log(response.data.data);
            return;
          }
        })
        .catch((error) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error in getting visitor details",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error in getting visitor details",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  function formatTimestamp(timestamp) {
    // Convert string to Date object
    var date = new Date(timestamp);

    // Array of month names
    var months = [
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

    // Get the month, day, year, hours, and minutes
    var month = months[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Convert hours to 12-hour format
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Format the time and date
    var formattedTime =
      hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm;
    var formattedDate = day + " " + month + " " + year;

    // Return the formatted string
    return formattedTime + " - " + formattedDate;
  }

  const handleApproveClick = () => {
    try {
      axios
        .get("/approve/" + token)
        .then((response) => {
          if (response.data.status) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Approved Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchVisitData();
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Error",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const handleRejectClick = () => {
    try {
      axios
        .get("/reject/" + token)
        .then((response) => {
          if (response.data.status) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Reject Successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            fetchVisitData();
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Error",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((error) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  const formatStatusColor = (status) => {
    if (status == "PENDING") {
      return "#184CCF";
    } else if (status == "APPROVED") {
      return "green";
    } else if (status == "REJECTED") {
      return "red";
    }
    return "black";
  };
  return (
    <div className="approve-reject-container">
      <div className="approve-reject-content">
        <div className="visitor-card">
          <div className="visitor-header">
            <h2>Visitor Details</h2>
            <div className="status-badge" style={{ backgroundColor: formatStatusColor(visitDetails?.visit_status) }}>
              {visitDetails?.visit_status}
            </div>
          </div>

          <div className="visitor-info">
            <div className="info-section">
              <div className="info-item">
                <label>Request Time</label>
                <p>{formatTimestamp(visitDetails?.request_time)}</p>
              </div>

              <div className="visitor-image-container">
                <img
                  className="visitor-image"
                  src={visitDetails?.visitor_image}
                  alt="Visitor"
                />
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <p>{visitDetails?.visitor_name}</p>
                </div>
                <div className="info-item">
                  <label>Mobile</label>
                  <p>{visitDetails?.visitor_phone_no}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{visitDetails?.visitor_email}</p>
                </div>
                <div className="info-item">
                  <label>Reason to Meet</label>
                  <p>{visitDetails?.reason}</p>
                </div>
              </div>

              {visitDetails?.visitor_type === "POLICE" && (
                <div className="info-grid">
                  <div className="info-item">
                    <label>Aadhar Number</label>
                    <p>{visitDetails?.aadhar_number}</p>
                  </div>
                  <div className="info-item">
                    <label>ID Card Number</label>
                    <p>{visitDetails?.id_card_number}</p>
                  </div>
                  <div className="info-item">
                    <label>Designation</label>
                    <p>{visitDetails?.designation_name}</p>
                  </div>
                </div>
              )}

              {visitDetails?.visitor_type === "CITIZEN" && (
                <div className="info-item">
                  <label>Aadhar Number</label>
                  <p>{visitDetails?.aadhar_number}</p>
                </div>
              )}
            </div>

            {visitDetails?.visit_status === "PENDING" && (
              <div className="action-buttons">
                <button
                  onClick={handleApproveClick}
                  className="approve-button"
                >
                  Grant Access
                </button>
                <button
                  onClick={handleRejectClick}
                  className="reject-button"
                >
                  Reject Request
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Back
        </button>
      </div>
    </div>
  );
}
