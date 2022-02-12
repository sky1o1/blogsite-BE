const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const cors = require("cors");

// LOAD env vars
dotenv.config({ path: "./config/config.env" });

//Connect to DB
connectDB();

// Export Route files
const blogsRouter = require("./src/routes/blogRoute");
const authRouter = require("./src/routes/authRoute");

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.Node_Env === "development") {
  app.use(morgan);
}

// CORS
app.use(cors());

//Cookie parser
app.use(cookieParser());
//Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/blogs", blogsRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT);

//Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
  console.log("error", err.message);

  // Close server and exit process
  server.close(() => process.exit(1));
});
