import axios from "axios";

const customAxios = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "https://vms-backend-xu8l.onrender.com",
  // baseURL: "https://vmsbackend.comdata.in",
  // baseURL: "https://vms-backend-mahapolice.onrender.com",
});

export default customAxios;


