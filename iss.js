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

module.exports = { fetchMyIP };
