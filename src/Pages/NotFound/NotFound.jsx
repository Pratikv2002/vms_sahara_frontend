import React from "react";
import { useNavigate, } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const goBackClick = () => {
    navigate(-1);
  };
  const backToDashboardClick = () => {
      navigate('/')
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "grey",margin:"0px" ,fontSize:"60px"}}>404</h1>
        <h4 style={{margin:"0px",fontSize:"25px",fontWeight:600}}>Sorry we couldn't find this page.</h4>
        <h6 style={{margin:"0px",fontSize:"15px"}} >
          But dont worry, you can find plenty of other things on our homepage.
        </h6>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button style={{color:"var(--primary-color)" ,border:"none",background:"none", marginRight:"10px",padding:"8px 16px"}} onClick={goBackClick}>&#8592; Go Back</button>
          <button style={{backgroundColor:"var(--secondary-color)" ,color:'white',border:'none',borderRadius:'7px',padding:"8px 16px"}} onClick={backToDashboardClick}>Back to dashboard</button>
        </div>
      </div>
    </div>
  );
}
