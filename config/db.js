const mongoose = require("mongoose");
const mongoDBURI = process.env.MONGODBURI;

const connectToMongo = async (req, res) => {
  try {
    const connect = await mongoose.connect(mongoDBURI);

    console.log("Connected To MONGODB Successfully", connect.connection.host, connect.connection.name);
  } catch (err) {
    console.log({ error: err, message: "Connection to mongoDB Faild" });
  }
};

module.exports = connectToMongo;
