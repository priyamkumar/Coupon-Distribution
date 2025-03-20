const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./utils/connectDB");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require('cors');

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL, "https://coupondistribution-project.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("Working");
});

app.use('/api/coupons', require("./routes/couponRoutes"));
app.use('/api/auth', require("./routes/userRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
