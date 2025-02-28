/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *  - A callback (to pass back on error or the IP string)
 * Returns (via callback):
 *  - An error, if any (nullable)
 *  - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const needle = require("needle");

const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  needle.get("https://api.ipify.org?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching latitude and longitude. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = body.ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  needle.get(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} when fetching for IP: ${body.ip}`;
      callback(Error(message), null);
      return;
    }

    const latitude = body.latitude;
    const longitude = body.longitude;
    callback(null, { latitude: latitude, longitude: longitude });
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *  - An object with keys `latitude` and `longitude`
 *  - A callback (to pass back an error or the array of resulting data)
 * Returns (via callback)
 *  - An error, if any (nullable)
 *  - The fly over times as an array of objects (null if error). Example: [{ isetime: 1234554234, duration: 600}, ... ]
 */

// https://iss-flyover.herokuapp.com/json/?lat=YOUR_LAT_INPUT_HERE&lon=YOUR_LON_INPUT_HERE

const fetchISSFlyOverTimes = function (coords, callback) {
  needle.get(
    `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      if (error) {
        callback(Error(error), null);
        return;
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(Error(msg), null);
        return;
      }

      const passes = body.response;
      callback(null, passes);
    }
  );
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };
