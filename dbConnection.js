const mongoose = require("mongoose");
const connectDb = async () =>  {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log
    (
        "Database connected: ",
        connect.connection.host,
        connect.connection.name
    );
      
   } catch (err) {
    console.log("Error connecting to DB ", err.message || err.stack);
    process.exit(1);
   };
};

module.exports = connectDb;
