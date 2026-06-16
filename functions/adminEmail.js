/** Courriel admin — synchroniser avec src/config/adminEmail.json */
const { email: ADMIN_EMAIL } = require("./adminEmail.json");

function normalizeAdminEmail(value) {
  return String(value || "").trim().toLowerCase();
}

module.exports = { ADMIN_EMAIL, normalizeAdminEmail };
