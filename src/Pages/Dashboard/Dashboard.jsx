import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "../../authAxios";
import "./Dashborad.css";
import { IoMdAdd } from "react-icons/io";
import { FaUserTie } from "react-icons/fa";
import { MdOutlineListAlt } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { colors } from "@mui/material";
import Chart from "chart.js/auto";
import { Bar, registerables } from "react-chartjs-2";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import Form from "../../Componants/Form/Form";
import { MdRefresh } from "react-icons/md";
export default function Dashboard() {
  const [todayVisitCount, setTodayVisitCount] = useState();
  const [weekVisitCount, setWeekVisitCount] = useState();
  const [showForm, setshowForm] = useState(false);
  useEffect(() => {
    getTodayVisitCount();
    getWeekVisitCount();
  }, []);

  const getTodayVisitCount = () => {
    try {
      axios
        .get("/visit-count")
        .then((response) => {
          if (response.data.status) {
            setTodayVisitCount(response.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getWeekVisitCount = () => {
    try {
      axios
        .get("/get-lastseven-day-visit")
        .then((response) => {
          if (response.data.status) {
            setWeekVisitCount(response.data.data.results);
            console.log(response.data.data.rejected_count);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const toggleFormVisibility = () => {
    setshowForm(!showForm);
  };

  const refreshFun = () => {
    getWeekVisitCount();
    getTodayVisitCount();
  };

  return (
    <div>
      <div>
        <h1 style={{ margin: "0px" }}>Dashboard</h1>
        <h5 style={{ margin: "0px", color: "#666666" }}>
          Here's the visitors at a glance
        </h5>
      </div>
      <div
        style={{
          marginTop: "25px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "20px 10px",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            boxShadow: "0px 1px 3px grey",
            borderRadius: "5px",
            width: "230px",
            border: "1px solid var(--secondary-color)",
            background: "#ffffff",
            // maxWidth: "250px",
          }}
        >
          <h3 style={{ margin: "0px" }}>Today's Visits</h3>
          <div>
            <span style={{ color: "#184CCF", fontSize: "25px" }}>
              {todayVisitCount?.approvedCount}
            </span>
            <span
              style={{ color: "#999999", fontSize: "25px", margin: "0px 5px" }}
            >
              |
            </span>
            <span style={{ color: "#FF8039", fontSize: "25px" }}>
              {todayVisitCount?.checkoutCount}
            </span>
          </div>
        </div>
        <CreateVisitTiles
          FirstIcon={IoMdAdd}
          SecondIcon={FaUserTie}
          Title={"Create Visitor"}
          Fun={setshowForm}
        />
        <OpenVisitLogsTiles
          FirstIcon={MdOutlineListAlt}
          SecondIcon={GiBackwardTime}
          Title={"Open Visit logs"}
          Path={"/visit-logs"}
        />
      </div>
      <div
        style={{
          color: "white",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "var(--primary-color)",
          padding: "8px 16px",
          display: "flex",
          alignItems: "center",
          width:"fit-content",
          margin:"10px 0px 5px"
        }}
        onClick={() => {
          refreshFun();
        }}
      >
        <MdRefresh size={20} />
        <span style={{ fontSize: "0.9em" }}>Refresh</span>
      </div>
      <div
        style={{
          flexWrap: "wrap",
          display: "flex",
          padding: "5px 15px",
          backgroundColor: "#FFFFFF",
          marginTop: "10px",
          borderRadius: "5px",
          boxShadow: "0px 1px 3px grey",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2>Today's Stats</h2>
          <div>
            <PieCharG todayVisitCount={todayVisitCount} />
          </div>
        </div>
        <div>
          <h2>Weekly Stats</h2>
          <div>
            <BarChartG weekVisitCount={weekVisitCount} />
          </div>
        </div>
      </div>
      {showForm && <Form onClose={toggleFormVisibility} refresh={refreshFun} />}
    </div>
  );
}

const OpenVisitLogsTiles = ({ FirstIcon, SecondIcon, Title, Path }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          padding: "20px 10px",
          flexDirection: "column",
          backgroundColor: "white",
          boxShadow: "0px 1px 3px grey",
          borderRadius: "5px",
          width: "230px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => {
          Path && navigate(Path);
        }}
      >
        <div>
          <div>
            <FirstIcon size={"30px"} />
          </div>
          <span>{Title}</span>
        </div>
        <div
          style={{
            position: "absolute", // Set rectangle to absolute position
            top: "0",
            right: "-60px",
            width: "150px", // Width of the rectangle
            height: "100%", // Full height of the container
            background: "var(--secondary-color-gradient)", // Set color of the rectangle to red
            transform: "rotate(-45deg)",
            // zIndex: "1",
            borderRadius: "7px",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "10%",
            bottom: "50%",
            // zIndex: "",
          }}
        >
          <SecondIcon size="35px" color="#E2E6F0" />
        </div>
      </div>
    </>
  );
};

const CreateVisitTiles = ({ FirstIcon, SecondIcon, Title, Fun }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "start",
          padding: "20px 10px",
          flexDirection: "column",
          backgroundColor: "white",
          boxShadow: "0px 1px 3px grey",
          borderRadius: "5px",
          width: "230px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={() => {
          Fun(true);
        }}
      >
        <div>
          <div>
            <FirstIcon size={"30px"} />
          </div>
          <span>{Title}</span>
        </div>
        <div
          style={{
            position: "absolute", // Set rectangle to absolute position
            top: "0",
            right: "-60px",
            width: "150px", // Width of the rectangle
            height: "100%", // Full height of the container
            background: "var(--secondary-color-gradient)", // Set color of the rectangle to red
            transform: "rotate(-45deg)",
            zIndex: "1",
            borderRadius: "7px",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: "40%",
            right: "10%",
            bottom: "50%",
            zIndex: "2",
          }}
        >
          <SecondIcon size="35px" color="#E2E6F0" />
        </div>
      </div>
    </>
  );
};

const BarChartG = ({ weekVisitCount }) => {
  const palette = ["#184CCF", "#E3B81F", "#FF8039", "#F74F4F"];
  const chartSetting = {
    yAxis: [
      {
        // label: 'rainfall (mm)',
      },
    ],
    width: 700,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-10px, 0)",
      },
    },
  };

  function formatDateArray(array) {
    return array?.map((item) => {
      const date = new Date(item.date);
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear().toString().slice(-2);
      return {
        ...item,
        date: `${day}/${month}/${year}`,
      };
    });
  }

  const data = weekVisitCount && formatDateArray(weekVisitCount);

  console.log("Formatted Data:", data); // Debugging: Check the dataset

  return (
    <div>
      {data && (
        <BarChart
          dataset={data}
          xAxis={[{ scaleType: "band", dataKey: "date" }]}
          colors={palette}
          series={[
            { dataKey: "approved_count", label: "Approved" },
            { dataKey: "pending_count", label: "Approval Pending" },
            { dataKey: "checkout_count", label: "Exited" },
            { dataKey: "rejected_count", label: "Rejected" },
          ]}
          {...chartSetting}
        />
      )}
    </div>
  );
};

const PieCharG = ({ todayVisitCount }) => {
  const palette = ["#184CCF", "#E3B81F", "#FF8039", "#F74F4F"];
  const data = [
    { value: todayVisitCount?.approvedCount, label: "Approved" },
    { value: todayVisitCount?.pendingCount, label: "Approval Pending" },
    { value: todayVisitCount?.checkoutCount, label: "Exited" },
    { value: todayVisitCount?.rejectedCount, label: "Rejected" },
  ];

  const size = {
    width: 400,
    height: 200,
  };
  return (
    <>
      <PieChart
        width={400}
        colors={palette}
        series={[
          {
            arcLabel: (item) => `${item.label} (${item.value})`,
            arcLabelMinAngle: 45,
            data,
            cx: 100,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: "none",
            fontWeight: "bold",
          },
        }}
        {...size}
      />
    </>
  );
};
