import React, { useState, useEffect } from "react";
import logo from "../../Assets/Logo.png";
import { useNavigate } from "react-router-dom";
import HomePageImg from "../../Assets/loginPageBgImage.png";
import TextField from "@mui/material/TextField";
import Form from "../../Componants/Form/Form";
import { IoArrowBackOutline } from "react-icons/io5";
import axios from "../../authAxios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import sha256 from "sha256";
import "./Home.scss";
import HomePageBgImg from "../../Assets/homebgimg.png";
import PoweredBy from "../../Componants/PoweredBy/PoweredBy";

export default function Home() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setshowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLoginClick = () => {
    if (email === "" || password === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Fill input fields",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      axios
        .post("/gatekeeper-signin", { email, password: sha256(password) })
        .then((response) => {
          if (response.data.status) {
            Cookies.set("auth", response.data.data.token, { expires: 7 });
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Login Successfully",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate("/dashboard"); // Navigate only after successful login
            });
            return;
          }
          Swal.fire({
            position: "center",
            icon: "error",
            title: response?.data?.data?.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((err) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: err,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    // Prevent scrolling when the component mounts
    document.body.style.overflow = "hidden";

    return () => {
      // Revert back to auto when the component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleCreateVisitClick = () => {
    setshowForm(true);
  };

  const handleCloseForm = () => {
    setshowForm(false);
  };
  const toggleFormVisibility = () => {
    setshowForm(!showForm);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "var(--background-linear-gradient)",
      }}
    >
      <div style={{position:"absolute",right:"0px",top:'25px'}}>
        <PoweredBy />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "right" }}>
          <div
            className="actionDiv"
            style={{
              marginRight: "5em",
              marginTop: "5em",
              marginLeft: "30px",
              position: "relative",
            }}
          >
            <div style={{ padding: "5px", width: "100%", minWidth: "200px" }}>
              <div style={{ position: "absolute", left: "-30px", top: "15px" }}>
                {showLogin && (
                  <IoArrowBackOutline
                    size={30}
                    onClick={() => setShowLogin(false)}
                  />
                )}
              </div>
              <h1 style={{ fontWeight: "800", margin: "0px" }}>Welcome</h1>
              <h5 style={{ color: "#666666", marginTop: "0px" }}>
                Visitor Management for Easy Access
              </h5>
            </div>
            {showLogin ? (
              <div>
                <TextField
                  size="small"
                  id="iEmail"
                  label="Email"
                  variant="filled"
                  style={{ width: "100%", margin: "10px 0px" }}
                  value={email}
                  onChange={handleEmailChange}
                />
                <br />
                <TextField
                  size="small"
                  id="iPassword"
                  label="Password"
                  type="password"
                  style={{ width: "100%", margin: "10px 0px" }}
                  variant="filled"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  handleCreateVisitClick();
                }}
                style={{
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  border: "none",
                  padding: "8px  3.75em",
                  width: "100%",
                  marginBottom: "20px",
                  borderRadius: "3px",
                }}
              >
                + Create a Visit
              </button>
            )}

            <br />
            <button
              style={{
                backgroundColor: "var(--secondary-color)",
                color: "white",
                border: "none",
                padding: "8px  3.75em",
                borderRadius: "3px",
                width: "100%",
              }}
              onClick={() => {
                showLogin ? handleLoginClick() : setShowLogin(!showLogin);
              }}
            >
              Login as Admin
            </button>
          </div>
          <div style={{ position: "absolute" }}>
            <img src={HomePageBgImg} alt="" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <img
            src={HomePageImg}
            // style={{height:"100%",width:"100%" }}
            alt=""
          />
        </div>
      </div>
      {showForm && <Form onClose={toggleFormVisibility} />}
    </div>
  );
}
