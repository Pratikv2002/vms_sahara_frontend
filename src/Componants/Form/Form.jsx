import React, { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../authAxios";
import { Camera } from "react-camera-pro";
import photoImg from "../../Assets/Image.png";
import { RxCross2 } from "react-icons/rx";
import Swal from "sweetalert2";
import PoweredBy from "../PoweredBy/PoweredBy";
import "./Form.css";

export default function Form({ onClose, refresh }) {
  const [openCamera, setopenCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState(photoImg);
  const [employeList, setEmployeList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [visitortypeList, setVisitortypeList] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    const getEmps = () => {
      try {
        axios.get("/get-employees").then((response) => {
          if (response.data.status) {
            setEmployeList(response.data.data.results);

          }
          return;
        });
      } catch (error) {
        console.log(error);
      }
    };

    const getVisitorType = () => {
      try {
        axios.get("/get-visitor-types").then((response) => {
          if (response.data.status) {
            setVisitortypeList(response.data.data.results);
            console.log("visitor tyoe", response.data.data.results)

          }
          return;
        }).catch((err) => {
          console.log(err)
        })
      } catch (error) {

      }
    }
    const getLocs = () => {
      try {
        axios.get("/get-locations").then((response) => {
          if (response.data.status) {
            setLocationList(response.data.data.results);

          }
          return;
        });
      } catch (error) {
        console.log(error);
      }
    };


    const getDesignations = () => {
      try {
        axios.get("/get-designations"
        ).then((response) => {
          if (response.data.status) {
            console.log("designation", response.data.data.results);
            setDesignationList(response.data.data.results);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getEmps();
    getLocs();
    getDesignations();
    getVisitorType();
  }, []);

  // const [showForm, setshowForm] = useState(open)

  const [formData, setFormData] = useState({
    visitorName: "",
    visitorContact: "",
    visitorEmail: "",
    hostId: "",
    officeId: "",
    reason: "",
    visitorType: "",
    // aadharNumber: "",
    // designationId: "",
    // designation_name: "",
    // idCardNumber: "",
    // totalPeople: 1,
  });

  const handlePhotoCapture = (dataUri) => {
    setImageSrc(dataUri);
  };
  const handleLocationChange = (event, newValue) => {
    const { name, id } = newValue;
    setFormData({ ...formData, officeId: id });
    console.log(newValue);
    console.log(event);
  };
  const handleEmployeChange = (event, newValue) => {
    const { name, id } = newValue;
    setFormData({ ...formData, hostId: id });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (name === "visitorContact" && value.length === 10) {
      fetchVisitorDetails(value);
    }
  };

  const fetchVisitorDetails = async (mobileNumber) => {
    try {
      const response = await axios.get(
        `/get-visitor-by-mobile/${mobileNumber}`
      );
      if (response.data.status && response.data.data.results.length > 0) {
        const visitor = response.data.data.results[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          visitorName: visitor.name || "",
          visitorEmail: visitor.email || "",
        }));
      } else {
        // Swal.fire({
        //   position: "center",
        //   icon: "info",
        //   title: "No visitor data found",
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
      }
    } catch (error) {
      console.error("Error fetching visitor details:", error);
      // Swal.fire({
      //   position: "center",
      //   icon: "error",
      //   title: "Failed to fetch visitor details",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
    }
  };

  const handleSubmit = () => {
    // e.preventDefault();
    // const requiredFields = {
    //   CITIZEN: ['visitorName', 'visitorContact', 'visitorEmail', 'hostId', 'officeId', 'reason', 'visitorType', 'aadharNumber', 'totalPeople'],
    //   POLICE: ['visitorName', 'visitorContact', 'visitorEmail', 'hostId', 'officeId', 'reason', 'visitorType', 'aadharNumber', 'designationId', 'idCardNumber', 'totalPeople'],
    // };

    const fieldsToValidate = ['visitorName', 'visitorContact', 'visitorEmail', 'hostId', 'officeId', 'reason', 'visitorType'] 

    const hasEmptyFields = fieldsToValidate.some(field => !formData[field]);

    if (hasEmptyFields) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Please fill all required fields",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (imageSrc == "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "Click Yours Image",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      setFormSubmitted(true)
      axios
        .post("/new-visit", {
          visitor_name: formData.visitorName,
          visitor_email: formData.visitorEmail,
          visitor_phone_number: formData.visitorContact,
          visitor_image: imageSrc,
          employee_id: formData.hostId,
          reason: formData.reason,
          location_id: formData.officeId,
          visitor_type: formData.visitorType,
          // aadhar_number: formData.aadharNumber,
          // id_card_number: formData.idCardNumber,
          // designation_id: formData.designationId,
          // designation_name: formData.designation_name,
          // total_people: parseInt(formData.totalPeople),
        })
        .then((response) => {
          if (response.data.status) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Visit applied successfully!",
              showConfirmButton: false,
              timer: 1500,
            });
            setFormSubmitted(false);
            onClose();
            {
              refresh && refresh();
            }
            // ();
            return;
          }
          Swal.fire({
            position: "center",
            icon: "error",
            title: response.data,
            showConfirmButton: false,
            timer: 1500,
          });
          setFormSubmitted(false);
        })
        .catch((err) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: err,
            showConfirmButton: false,
            timer: 1500,
          });
          setFormSubmitted(false);
        });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
      setFormSubmitted(false);
    }
  };

  const handleCaptureClick = () => {
    setopenCamera(!openCamera);
    console.log("currrrrr", cameraRef);
    if (cameraRef.current) {
      var url = cameraRef.current.takePhoto();
      setImageSrc(url);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        {/* Header Section */}
        <div className="form-header">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: '-15px' }}>
            <PoweredBy />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <h3 className="header-title">Create New Entry</h3>
            <RxCross2 onClick={onClose} size={20} className="close-button" />
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="form-content">
          {/* Photo Section */}
          <div className="form-section">
            <h4 className="section-title">Visitor Photo</h4>
            <div className="photo-container">
              {!openCamera && (
                <img
                  src={imageSrc == "" ? photoImg : imageSrc}
                  alt="Captured"
                  className="photo-preview"
                />
              )}
              {openCamera && (
                <Camera
                  onTakePhoto={handlePhotoCapture}
                  ref={cameraRef}
                  aspectRatio={10 / 4}
                />
              )}

              {openCamera ? (
                <button
                  onClick={handleCaptureClick}
                  className="photo-button"
                >
                  Click Photo
                </button>
              ) : (
                <button
                  className="photo-button"
                  onClick={() => {
                    setImageSrc("");
                    setopenCamera(!openCamera);
                  }}
                >
                  Take Photo
                </button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-fields">
            {/* Visitor Type */}
            <div className="form-section">
              <h4 className="section-title">Visitor Type</h4>
              <Autocomplete
                size="small"
                id="visitorType"
                autoHighlight
                fullWidth
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    visitorType: newValue?.id || '' // or newValue?.name depending on what you need
                  }));
                }}
                options={visitortypeList}
                getOptionLabel={(option) => option.name} // 🔥 Use "name" instead of "label"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Visitor Type*"
                    variant="outlined"
                  />
                )}
              />

            </div>

            {/* Identification Details */}
            {/* {formData.visitorType && (
              <div className="form-section">
                <h4 className="section-title">Identification Details</h4>
                <div className="field-group">
                  <TextField
                    size="small"
                    label="Aadhar Card Number*"
                    variant="outlined"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleChange}
                    fullWidth
                  />

                  {formData.visitorType === 'POLICE' && (
                    <>
                      <Autocomplete
                        size="small"
                        id="designation"
                        autoHighlight
                        fullWidth
                        onChange={(event, newValue) => {
                          setFormData(prev => ({
                            ...prev,
                            designationId: newValue?.designation_id || '',
                            designation_name: newValue?.designation_name || ''
                          }));
                        }}
                        options={designationList}
                        getOptionLabel={(option) => option.designation_name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Designation*"
                            variant="outlined"
                          />
                        )}
                      />
                      <TextField
                        size="small"
                        label="ID Card Number*"
                        variant="outlined"
                        name="idCardNumber"
                        value={formData.idCardNumber}
                        onChange={handleChange}
                        fullWidth
                      />
                    </>
                  )}
                </div>
              </div>
            )} */}

            {/* Contact Information */}
            <div className="form-section">
              <h4 className="section-title">Contact Information</h4>
              <div className="field-group">
                <TextField
                  size="small"
                  label="Visitor Contact*"
                  variant="outlined"
                  name="visitorContact"
                  value={formData.visitorContact}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  size="small"
                  label="Visitor Name*"
                  variant="outlined"
                  name="visitorName"
                  value={formData.visitorName}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  size="small"
                  label="Visitor Email*"
                  variant="outlined"
                  name="visitorEmail"
                  value={formData.visitorEmail}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            </div>

            {/* Meeting Details */}
            <div className="form-section">
              <h4 className="section-title">Meeting Details</h4>
              <div className="field-group">
                <Autocomplete
                  size="small"
                  id="hostName"
                  autoHighlight
                  fullWidth
                  onChange={handleEmployeChange}
                  options={employeList?.map((option) => ({
                    name: option?.name,
                    id: option?.employee_id,
                  }))}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Host Name*"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                />

                <Autocomplete
                  size="small"
                  id="office"
                  autoHighlight
                  fullWidth
                  options={locationList?.map((option) => ({
                    id: option?.location_id,
                    name: option?.location_name,
                  }))}
                  onChange={handleLocationChange}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Office Location*"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                />

                <TextField
                  size="small"
                  label="Reason For Meet*"
                  variant="outlined"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="form-footer">
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={formSubmitted}
          >
            Create Entry
          </button>
        </div>
      </div>
    </div>
  );
}
