const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectmongo = require("./database/db");
const path = require("path");

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// app.use(cors());
//CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://secret-script-io.vercel.app"],
    // methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
  })
);

// Serve static files from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// app.options("*", cors()); // Handle OPTIONS requests

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: "Too many requests, please try again later.",
// });
// app.use(limiter);

//Body parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database connection
connectmongo();

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));
app.use("/image", require("./routes/image"));
app.use("/user", require("./routes/user"));

// Root endpoint
app.get("/", (req, res) => {
  res.send("Server is running perfectly");
});

// Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
