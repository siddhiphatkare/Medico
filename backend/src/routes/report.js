const Router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { verifyAccessToken } = require("../middlewares/authentication");
const Report = require("../models/report");
const User = require("../models/user");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/reports/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST /reports/upload - Patient uploads a medical report
Router.post("/upload", verifyAccessToken, upload.single("reportFile"), async (req, res) => {
  try {
    if (req.userRole !== "patient") {
      return res.status(403).json({ message: "Access denied", error: "Forbidden" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded", error: "Bad Request" });
    }

    const newReport = new Report({
      patientId: req.userId,
      filename: req.file.filename,
      fileUrl: `/uploads/reports/${req.file.filename}`,
      description: req.body.description || "",
    });

    await newReport.save();

    return res.status(201).json({ message: "Report uploaded successfully", data: newReport });
  } catch (error) {
    console.error("Error uploading report:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// GET /reports - Doctor fetches reports for review
Router.get("/", verifyAccessToken, async (req, res) => {
  try {
    if (req.userRole !== "doctor") {
      return res.status(403).json({ message: "Access denied", error: "Forbidden" });
    }

    const reports = await Report.find()
      .populate("patientId", "name")
      .sort({ uploadedAt: -1 });

    return res.status(200).json({ message: "Reports fetched successfully", data: reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// PUT /reports/:id/review - Doctor reviews a report
Router.put("/:id/review", verifyAccessToken, async (req, res) => {
  try {
    if (req.userRole !== "doctor") {
      return res.status(403).json({ message: "Access denied", error: "Forbidden" });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found", error: "Not Found" });
    }

    report.status = "reviewed";
    report.reviewedAt = new Date();
    report.reviewNotes = req.body.reviewNotes || "";

    await report.save();

    return res.status(200).json({ message: "Report reviewed successfully", data: report });
  } catch (error) {
    console.error("Error reviewing report:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = Router;
