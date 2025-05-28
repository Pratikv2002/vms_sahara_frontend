import React, { useState, useEffect, useMemo } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import Table from "../../Componants/Table/Table";
import Swal from "sweetalert2";
import "./VisitLogs.css";
import Form from "../../Componants/Form/Form";
import axios from "../../authAxios";
import { MdRefresh } from "react-icons/md";


export default function VisitLogs() {
  const [status, setStatus] = React.useState("");
  const [showForm, setshowForm] = useState(false);
  const [startDate, setStartDate] = useState(dateFormatter(new Date()));
  const [endDate, setEndDate] = useState(dateFormatter(new Date()));
  const [selectedDateRange, setSelectedDateRange] = useState([new Date(), new Date()]);
  const [visitorLogs, setvisitorLogs] = useState();
  const [allLogsData, setAllLogsData] = useState();
  const [serachText, setSerachText] = useState("");

  useEffect(()=>{
    handleDateRangeChange(selectedDateRange)
  },[selectedDateRange])
  const handleDateRangeChange = (newDateRange) => {
    if ( newDateRange!=null && newDateRange[0] !== null && newDateRange[1] !== null) {
      setStartDate(dateFormatter(newDateRange[0]));
      setEndDate(dateFormatter(newDateRange[1]));
    }
  };
  useEffect(()=>{
      getVisits()
  },[startDate,endDate])

  function payloadDateFormatte(dateString) {
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObject.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
  const getVisits = () => {
    try {
      axios
        .get(
          "/get-visits/" +
            payloadDateFormatte(startDate) +
            "/" +
            payloadDateFormatte(endDate)
        )
        .then((response) => {
          if (response.data.status) {
            setvisitorLogs(response.data.data.results);
            setAllLogsData(response.data.data.results);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   getVisits();
  // }, []);
  const filterItems = (items, searchTerm) => {
    return items?.filter((item) => {
      return Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  useMemo(() => {
    setvisitorLogs(filterItems(allLogsData, serachText));
    console.log(serachText);
  }, [serachText, allLogsData]);

  useMemo(() => {
    setvisitorLogs(filterItems(allLogsData, status));
  }, [status, allLogsData]);
  function dateFormatter(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // Month is zero-based, so we add 1
    let day = date.getDate();

    // Add leading zero if month or day is less than 10
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    // Return the formatted date string
    return `${year}-${month}-${day}`;
  }

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };
  const toggleFormVisibility = () => {
    setshowForm(!showForm);
  };

  const formateStatusColor = (status) => {
    if (status == "REJECTED" || status == "EXITED") {
      return (
        <div>
          <p
            style={{
              color: "#BB0007",
              backgroundColor: "#FAEAEA",
              padding: "3px 6px",
              borderRadius: "3px",
            }}
          >
            {status}
          </p>
        </div>
      );
    } else {
      return (
        <h4
          style={{
            color: "#0144FF",
            backgroundColor: "#EBEFFA",
            padding: "3px 6px",
            borderRadius: "3px",
          }}
        >
          {status}
        </h4>
      );
    }
  };
  const formateShowDateTime = (timestamp) => {
    const dateObject = new Date(timestamp);

    const hours = ("0" + (dateObject.getHours() % 12 || 12)).slice(-2);
    const minutes = ("0" + dateObject.getMinutes()).slice(-2);
    const ampm = dateObject.getHours() >= 12 ? "PM" : "AM";

    const day = ("0" + dateObject.getDate()).slice(-2);
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const year = dateObject.getFullYear().toString().slice(-2);

    return `${hours}:${minutes} ${ampm}, ${day}/${month}/${year}`;
  };
  const formateDateForTable = (row) => {
    if (row.visit_status == "PENDING") {
      return formateShowDateTime(row.request_time);
    } else if (row.visit_status == "APPROVED") {
      return formateShowDateTime(row.checkin_time);
    } else if (row.visit_status == "EXITED") {
      return formateShowDateTime(row.checkout_time);
    } else {
      return "";
    }
  };

  function filterArrayOfObjectsByValue(arrayOfObjects, searchText) {
    const searchLowerCase = searchText.toLowerCase();

    return arrayOfObjects.filter((obj) =>
      Object.values(obj).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchLowerCase)
      )
    );
  }

  const columns = [
    { name: "Name", selector: (row) => row.visitor_name },
    {
      name: "Email",
      selector: (row) => row.visitor_email,
      width: "200px ",
      wrap: "true",
    },
    { name: "Phone", selector: (row) => row.visitor_phone_no, width: "120px" },
    { name: "Host Name", selector: (row) => row.employeeName },
    {
      name: "Status & Time",
      selector: (row) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {formateStatusColor(row.visit_status)} {formateDateForTable(row)}
        </div>
      ),
      width: "300px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {row.visit_status == "APPROVED" && (
            <p
              onClick={() => {
                handleEndVisitClick(row.log_id);
              }}
              style={{
                textDecoration: "underline",
                color: "var(--primary-color)",
              }}
            >
              End Visit
            </p>
          )}
        </div>
      ),
    },
  ];
  const handleEndVisitClick = (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Confirmation",
        text: "Are you sure you want to end visit for this application and mark as exited?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Exit",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .post("/complete-checkout", { id })
            .then((response) => {
              if (response.data.status) {
                swalWithBootstrapButtons.fire({
                  title: "Exited!",
                  text: "Visitor Exited Successfully",
                  icon: "success",
                });
                getVisits();
              } else {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "Error In Checkout",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            })
            .catch(() => {});
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
  };

  const refreshFun = () => {
    getVisits();
  };

  return (
    <div>
      <div>
        <h1 style={{ margin: "0px" }}>Visit Logs</h1>
        <h5 style={{ margin: "0px", color: "#666666" }}>
          Here's the visitors at a glance
        </h5>
      </div>
      <div
        style={{ display: "flex", justifyContent: "start", marginTop: "20px" }}
      >
        <input
          onChange={(e) => {
            setSerachText(e.target.value);
          }}
          style={{
            border: "1px solid grey",
            padding: "8px 16px",
            width: "100%",
            maxWidth: "350px",
            borderRadius: "5px",
          }}
          type="text"
          name=""
          id=""
          placeholder="Search by name, email"
        />
        <button
          style={{
            marginLeft: "15px",
            color: "white",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "var(--primary-color)",
            padding: "8px 16px",
          }}
        >
          Search
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                color: "white",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "var(--primary-color)",
                padding: "8px 16px",
                display:'flex',
                alignItems:'center'

              }}
              onClick={() => {
                refreshFun();
              }}
            >
              <MdRefresh size={20} />
              <span style={{fontSize:"0.9em"}}>Refresh</span>
              
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "start",
            }}
          >
            <div>
              <Select
                value={status}
                onChange={(e) => {
                  handleStatusChange(e);
                }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                // size="small"
                className="statusFilter"
              >
                <MenuItem className="statusItem" value="">
                  <em>Filter by Status</em>
                </MenuItem>
                <MenuItem className="statusItem" value="APPROVED">
                  APPROVED
                </MenuItem>
                <MenuItem className="statusItem" value="PENDING">
                  PENDING
                </MenuItem>
                <MenuItem className="statusItem" value="EXITED">
                  EXITED
                </MenuItem>
                <MenuItem className="statusItem" value="REJCTED">
                  REJCTED
                </MenuItem>
              </Select>
            </div>
            <div style={{ marginLeft: "20px" }}>
              <DateRangePicker onChange={setSelectedDateRange} value={selectedDateRange} />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Table data={visitorLogs} columns={columns} />
      </div>
      {showForm && <Form onClose={toggleFormVisibility} refresh={refreshFun} />}
    </div>
  );
}
