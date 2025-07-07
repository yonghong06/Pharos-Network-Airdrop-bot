const { DateTime } = require("luxon");

function getUTCTime() {
  return DateTime.now().setZone("UTC").toFormat("yyyy-MM-dd HH:mm:ss");
}

module.exports = { getUTCTime };