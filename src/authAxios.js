import axios from "axios";

const customAxios = axios.create({
  baseURL: "https://vms-backend-sahara.onrender.com",
  // baseURL: "https://vms-backend-xu8l.onrender.com",
  // baseURL: "https://vmsbackend.comdata.in",
  // baseURL: "https://vms-backend-mahapolice.onrender.com",
});

export default customAxios;


