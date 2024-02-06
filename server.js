const express = require ("express");
const connectDb = require("./dbConnection");
const dotenv = require ("dotenv").config();

connectDb(process.env.MONGODB_URI);  // Connect to MongoDB database using the provided URI
const app = express();


const port = process.env.PORT || 5000;


app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"))

app.listen(port, () => { console.log( `Server running on ${port}/`);});
