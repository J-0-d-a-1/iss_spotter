const needle = require("needle");

/**
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */

const fetchMyIP = function () {
  return needle("get", "https://api.ipify.org?format=json").then((response) => {
    const body = response.body;
    const ip = body.ip;
    return ip;
  });
};

/**
 * Makes a request to ipwho.is usint the provided IP address to get its geographical information (latitude/longitude)
 * Input: IP address as a string
 * Returns: Promise of request for lat/lon
 */

const fetchCoordsByIP = function (ip) {
  return needle("get", `http://ipwho.is/${ip}`).then((response) => {
    const body = response.body;
    const latitude = body.latitude;
    const longitude = body.longitude;
    return { latitude, longitude };
  });
};

const fetchISSFlyOverTimes = function (coords) {
  const latitude = coords.latitude;
  const longitude = coords.longitude;

  return needle(
    "get",
    `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`
  ).then((response) => {
    const body = response.body;
    const passtimes = body.response;
    return passtimes;
  });
};

const nextISSTimesForMyLocation = function () {
  return fetchMyIP()
    .then((ip) => fetchCoordsByIP(ip))
    .then((coords) => fetchISSFlyOverTimes(coords))
    .then((passtimes) => {
      return passtimes;
    });
};

module.exports = {
  /*fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes*/ nextISSTimesForMyLocation,
};
