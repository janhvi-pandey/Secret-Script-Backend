const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectmongo = require("./database/db");

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "https://secret-script-io.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
    credentials: true,
  })
);

app.options("*", cors()); // Handle OPTIONS requests

app.use(express.json());
connectmongo();

app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Server is running perfectly");
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
