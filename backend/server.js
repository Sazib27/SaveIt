const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

// Load Environment Variables
dotenv.config();

// Database
const connectDB = require("./config/db");

// Connect MongoDB
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const userRoutes = require("./routes/userRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware
const errorHandler = require("./middleware/errorMiddleware");

const app = express();


// ==========================================
// Middleware
// ==========================================

// JSON Body Parser
app.use(express.json());

// Form Body Parser
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors());

// Logger
app.use(morgan("dev"));

// Rate Limiter
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    })
);


// ==========================================
// Static Downloads Folder
// ==========================================

app.use(
    "/downloads",
    express.static(path.join(__dirname, "downloads"))
);


// ==========================================
// API Routes
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "🚀 SaveIt Backend Running"
    });

});

app.use("/api/auth", authRoutes);

app.use("/api/media", mediaRoutes);

app.use("/api/user", userRoutes);

app.use("/api/download", downloadRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/admin", adminRoutes);


// ==========================================
// 404 Route
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });

});


// ==========================================
// Global Error Handler
// ==========================================

app.use(errorHandler);


// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("");
    console.log("==========================================");
    console.log("🚀 SaveIt Backend Started Successfully");
    console.log(`🌐 Server : http://localhost:${PORT}`);
    console.log("==========================================");
    console.log("");

});