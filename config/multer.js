const multer = require("multer");
const { v4 } = require("uuid");

module.exports = {
  storage: multer.memoryStorage(),
  limits: 1024 * 1021,
};
