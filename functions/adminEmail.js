/** Courriel admin — source unique : src/config/adminEmail.json */
const { email: ADMIN_EMAIL } = require("../src/config/adminEmail.json");

function normalizeAdminEmail(value) {
  return String(value || "").trim().toLowerCase();
}

module.exports = { ADMIN_EMAIL, normalizeAdminEmail };
