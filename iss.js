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
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(null, body.ip);
  });
};

const fetchCoordsByIP = function (ip, callback) {
  needle.get(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (!body.success) {
      const message = `Success status was ${body.success}. Server message says: ${body.message} wjen fetching for IP: ${body.ip}`;
      callback(Error(message), null);
      return;
    }

    callback(`{ latitude: ${body.latitude}, longitude: ${body.longitude}}`);
  });
};

// fetchCoordsByIP("24.80.178.224", console.log);
// fetchCoordsByIP("42", console.log);

module.exports = { fetchMyIP, fetchCoordsByIP };
