import React from "react";
import "./HomeLayout.scss";
import Sidebar from "../../Componants/Sidebar/Sidebar";
import PoweredBy from "../../Componants/PoweredBy/PoweredBy";

export default function Homelayout({ child }) {
  return (
    <div style={{ background: "var(--background-linear-gradient)" }}>
      <div style={{ position: "absolute", right: "0px", top: "25px" }}>
        <PoweredBy />
      </div>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ margin: "20px", width: "100%" }}>{child}</div>
      </div>
    </div>
  );
}
