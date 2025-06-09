require('dotenv').config({ path: __dirname + '/../../.env' });

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
console.log("authRouter type:", typeof authRouter);

// Handle userRouter default export (in case it's an ES module)
const userRouterImport = require("./routes/user");
const userRouter = userRouterImport.default || userRouterImport;
console.log("userRouter type:", typeof userRouter);

const appointmentRouter = require("./routes/appointment");
console.log("appointmentRouter type:", typeof appointmentRouter);

const reportRouter = require("./routes/report");
console.log("reportRouter type:", typeof reportRouter);

const app = express();

// DB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connection established");
  })
  .catch(error => {
    console.log("MongoDB connection error:", error);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/greeting', (req, res) => {
  res.json({ message: 'Welcome to MediLink API!' });
});

// Routes
app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
app.use("/v1/appointments", appointmentRouter);
app.use("/v1/reports", reportRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on port ${PORT}`);
});
