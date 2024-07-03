const clientId = "1010281087379-4m1dvta8qu9l2064058tr505qf6cfg8v.apps.googleusercontent.com";
const POST = "POST";
const headers = {
  headers: {
    "Content-Type": "application/json",
  },
};
const BASE_URL = "http://localhost:9999";

const formatNumber = (value) => value.toString().padStart(2, "0");

export { clientId, POST, BASE_URL, headers, formatNumber };
