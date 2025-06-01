import React from "react";
import saharaLogo from "../../Assets/saharaLogo.png"
import ComdataLogo from "../../Assets/Comdata TRANSPARENT.png"
export default function PoweredBy() {
  return (
    <div style={{border:"2px solid #184CCF", width:'fit-content',padding:"4px 12px",borderTopLeftRadius:"15px",borderBottomLeftRadius:"15px"}}>
     <img src={saharaLogo} alt="Maha Police Logo" style={{height: "2rem", verticalAlign: "middle", marginRight: "8px"}} />
       <span style={{ fontSize:"1em"}}>Powered by {" "}</span>
       <img src={ComdataLogo} alt="Maha Police Logo" style={{height: "2.5rem", verticalAlign: "middle", marginRight: "8px"}} />

    </div>
  );
}
