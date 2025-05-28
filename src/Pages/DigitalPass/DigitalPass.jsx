import React, { useEffect, useState, useRef } from "react";
import "./DigitalPass.css";
import axios from "../../authAxios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { MdPassword } from "react-icons/md";

export default function () {
  const navigate = useNavigate();
  const { token } = useParams();
  const [passDetails, setPassDetails] = useState();
  const qrCodeRef = useRef(null); // Ref for QR code image
  const visitorImageRef = useRef(null); // Ref for visitor image

  useEffect(() => {
    fetchVisitData();
  }, []);

  useEffect(() => {
    // Dynamically set the visitor image height equal to the QR code's height
    if (qrCodeRef.current && visitorImageRef.current) {
      visitorImageRef.current.style.height = `${qrCodeRef.current.offsetHeight}px`;
    }
  }, [passDetails]); // Run this effect when passDetails updates

  const fetchVisitData = () => {
    try {
      axios
        .get("/get-digital-pass/" + token)
        .then((response) => {
          if (response.data.status) {
            setPassDetails(response.data.data.digitalPass);
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

    var month = months[date.getMonth()];
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    var formattedTime =
      hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + ampm;
    var formattedDate = day + " " + month + " " + year;

    return formattedTime + " - " + formattedDate;
  }

  const formatStatusColor = (status) => {
    if (status === "PENDING") {
      return "#184CCF";
    } else if (status === "APPROVED") {
      return "green";
    } else if (status === "REJECTED") {
      return "red";
    }
    return "black";
  };

  return (
    <div className="digital-pass-container">
      <div className="digital-pass-content">
        <div className="pass-card">
          <div className="pass-header">
            <h2>Digital Pass</h2>
            <div className="status-badge" style={{ backgroundColor: formatStatusColor(passDetails?.visit_status) }}>
              {passDetails?.visit_status}
            </div>
          </div>

          <div className="pass-info">
            <div className="info-section">
              <div className="info-item">
                <label>Clock In Time</label>
                <p>{formatTimestamp(passDetails?.checkin_time)}</p>
              </div>

              <div className="visitor-qr-container">
                <div className="visitor-image-wrapper">
                  <img
                    ref={visitorImageRef}
                    className="visitor-image"
                    src={passDetails?.visitor_image}
                    alt="Visitor"
                  />
                  <div className="image-label">Visitor Photo</div>
                </div>
                <div className="qr-code-wrapper">
                  <img
                    ref={qrCodeRef}
                    className="qr-code"
                    src={passDetails?.qrCode}
                    alt="QR Code"
                  />
                  <div className="image-label">QR Code</div>
                </div>
              </div>

              <div className="section-divider">
                <h3>Visitor Information</h3>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <p>{passDetails?.visitor_name}</p>
                </div>
                <div className="info-item">
                  <label>Mobile</label>
                  <p>{passDetails?.visitor_phone_no}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{passDetails?.visitor_email}</p>
                </div>
                <div className="info-item">
                  <label>Reason to Meet</label>
                  <p>{passDetails?.reason}</p>
                </div>
              </div>

              {passDetails?.visitor_type === "POLICE" && (
                <div className="info-grid">
                  <div className="info-item">
                    <label>Aadhar Number</label>
                    <p>{passDetails?.aadhar_number}</p>
                  </div>
                  <div className="info-item">
                    <label>ID Card Number</label>
                    <p>{passDetails?.id_card_number}</p>
                  </div>
                  <div className="info-item">
                    <label>Designation</label>
                    <p>{passDetails?.designation_name}</p>
                  </div>
                </div>
              )}

              {passDetails?.visitor_type === "CITIZEN" && (
                <div className="info-item">
                  <label>Aadhar Number</label>
                  <p>{passDetails?.aadhar_number}</p>
                </div>
              )}

              <div className="section-divider">
                <h3>Meeting With</h3>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <p>{passDetails?.employeeName}</p>
                </div>
                <div className="info-item">
                  <label>Employee ID</label>
                  <p>{passDetails?.employee_id}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{passDetails?.employeeEmail}</p>
                </div>
              </div>
            </div>
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
