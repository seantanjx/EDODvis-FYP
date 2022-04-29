import jwt from "jwt-decode";
import axios from "axios";

axios.defaults.trailingSlash = true;

const BASE_URL = "http://localhost:8000/edodvis/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: token,
  };
  return headers;
};

const login = (data) => axios.post(`${BASE_URL}user/login/`, data);

const getUser = () => {
  const headers = getAuthHeaders();

  var config = {
    method: "post",
    url: `${BASE_URL}user/profile/`,
    headers: headers,
  };

  return axios(config);
};

const getUserState = () => {
  const headers = getAuthHeaders();

  var config = {
    method: "post",
    url: `${BASE_URL}user/state/`,
    headers: headers,
  };

  return axios(config);
};

const patchUserState = (state) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    state: state,
  });

  var config = {
    method: "patch",
    url: `${BASE_URL}user/state/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getParticipantById = (participantId) => {
  const headers = getAuthHeaders();
  const response = axios.get(`${BASE_URL}participant/${participantId}/`, {
    headers,
  });
  return response;
};

const getParticipantByArea = (postalDistrict) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    postalDistrict: postalDistrict,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}participant/postal_district/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getParticipantByPostalCode = (postalcode) => {
  const headers = getAuthHeaders();
  var data = JSON.stringify({
    postal_code: postalcode,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}participant/postal_code/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getDeviceByParticipantId = (participantId) => {
  const headers = getAuthHeaders();

  const response = axios.get(`${BASE_URL}device/${participantId}/`, {
    headers,
  });
  return response;
};

const getOfflineDeviceByType = (type) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    type: type,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/offline/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getLowBatteryDeviceByType = (area) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    area: area,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/low/area/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getAllParticipant = () => {
  const headers = getAuthHeaders();
  const response = axios.post(`${BASE_URL}participant/all/`, { headers });
  return response;
};

const getDeviceByBatteryLevel = (batteryLevel) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    battery_level: batteryLevel,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/battery/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getDisplayName = () => {
  const token = localStorage.getItem("token");
  const displayName = jwt(token).display_name;
  return displayName;
};

const getUsername = () => {
  const token = localStorage.getItem("token");
  const username = jwt(token).username;
  return username;
};

const getRole = () => {
  const token = localStorage.getItem("token");
  const role = jwt(token).role;
  return role;
};

const getBiomarkers = (
  startDate,
  endDate,
  biomarker,
  periodicity,
  participants
) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    startDate: startDate,
    endDate: endDate,
    biomarker: biomarker,
    periodicity: periodicity,
    participants: participants,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}sensorreading/data/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getBiomarkersBoxPlot = (
  startDate,
  endDate,
  biomarker,
  periodicity,
  participants
) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    startDate: startDate,
    endDate: endDate,
    biomarker: biomarker,
    periodicity: periodicity,
    participants: participants,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}sensorreading/data/boxplot/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const plotBiomarkersBoxPlot = (
  startDate,
  endDate,
  biomarker,
  periodicity,
  participants
) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    startDate: startDate,
    endDate: endDate,
    biomarker: biomarker,
    periodicity: periodicity,
    participants: participants,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}sensorreading/plot/boxplot/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getAllDevice = () => {
  const headers = getAuthHeaders();

  var config = {
    method: "post",
    url: `${BASE_URL}device/all/daysdown/`,
    headers: headers,
  };

  return axios(config);
};

const getAlertDataByArea = (postalDistrict) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    postalDistrict: postalDistrict,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/alert/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getLostSignalByArea = (area) => {
  const headers = getAuthHeaders();
  var data = JSON.stringify({
    area: area,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/offline/area/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getAllDeviceByArea = (postalDistrict) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    postalDistrict: postalDistrict,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/overview/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getSummarySensorsByArea = (postalDistrict) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    postalDistrict: postalDistrict,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/houses/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const getBatteryLevelByArea = (area) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    area: area,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/battery-count/area/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const updateRemarks = (device_ids, remarks) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    device_ids: device_ids,
    remarks: remarks,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/update/remarks/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const updateLastServiced = (device_ids) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    device_ids: device_ids,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}device/update/last-serviced/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const createUser = (username, password, display_name) => {
  const headers = getAuthHeaders();

  var data = JSON.stringify({
    username: username,
    password: password,
    display_name: display_name,
  });

  var config = {
    method: "post",
    url: `${BASE_URL}user/create/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const UploadParticipantsExcel = (data) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "multipart/form-data",
    Authorization: token,
  };

  var config = {
    method: "post",
    url: `${BASE_URL}participant/upload/`,
    headers: headers,
    data: data,
  };

  return axios(config);
};

const updateDeviceStatus = () => {
  const headers = getAuthHeaders();
  const response = axios.post(`${BASE_URL}update/device-status/`, { headers });
  return response;
};

export {
  login,
  getUser,
  getUserState,
  patchUserState,
  getDisplayName,
  getUsername,
  getRole,
  getParticipantById,
  getAllParticipant,
  getParticipantByArea,
  getParticipantByPostalCode,
  getBiomarkers,
  getDeviceByBatteryLevel,
  getDeviceByParticipantId,
  getLowBatteryDeviceByType,
  getOfflineDeviceByType,
  getAllDevice,
  getAlertDataByArea,
  getLostSignalByArea,
  getSummarySensorsByArea,
  getBatteryLevelByArea,
  getBiomarkersBoxPlot,
  getAllDeviceByArea,
  updateRemarks,
  updateLastServiced,
  plotBiomarkersBoxPlot,
  createUser,
  UploadParticipantsExcel,
  updateDeviceStatus,
};
