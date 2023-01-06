const mongoose = require("mongoose");
const config = require("../config/config");
const Logging = require("../library/Logging");

const connect = async () => {
  try {
    await mongoose.connect(config.db.MONGO_DB_URL);
    Logging.success("Connect database Successfully!");
  } catch (error) {
    Logging.error("Fail to connect database!!", error);
  }
};

module.exports = { connect };
