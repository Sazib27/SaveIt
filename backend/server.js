const express = require("express");

const dotenv = require("dotenv");

const mediaRoutes =
  require("./routes/mediaRoutes");

const cors = require("cors");

const morgan = require("morgan");

const rateLimit =
  require("express-rate-limit");

dotenv.config();

const connectDB =
  require("./config/db");

const authRoutes =
  require("./routes/authRoutes");

const errorHandler =
  require("./middleware/errorMiddleware");

const userRoutes =
  require("./routes/userRoutes");

const downloadRoutes =
  require("./routes/downloadRoutes");

const paymentRoutes =
  require("./routes/paymentRoutes");

const adminRoutes =
  require("./routes/adminRoutes");

connectDB();

const app = express();
const path = require("path");

app.use(
  "/downloads",
  express.static(path.join(__dirname, "downloads"))
);

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

app.use(cors());

app.use(morgan("dev"));

const limiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 100

});

app.use(limiter);

app.use(
  "/api/auth",
  authRoutes
);

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "SaveIt API Running"
  });

});

app.use(errorHandler);

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});

app.use(
  "/api/media",
  mediaRoutes
);

app.use(
  "/api/user",
  userRoutes
);

app.use(
  "/api/download",
  downloadRoutes
);

app.use(
  "/api/payment",
  paymentRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);