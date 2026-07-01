import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import appointmentRoutes from "./routes/appointments.js";
import { verifyToken } from "./middleware/auth.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./config/cloudinary.js";

// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
console.log("Cloud:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Key:", process.env.CLOUDINARY_API_KEY);
console.log("Secret:", process.env.CLOUDINARY_API_SECRET ? "OK" : "NO");
console.log("RESEND:", process.env.RESEND_API_KEY);
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// const upload = multer({ storage });

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const isImage = file.mimetype.startsWith("image/");

    return {
      folder: "mentify",

      resource_type: "auto",

      allowed_formats: isImage
        ? ["jpg", "jpeg", "png", "webp"]
        : ["pdf", "doc", "docx"],
    };
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post(
  "/auth/register",
  upload.fields([
    { name: "picture", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  register,
);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/appointments", appointmentRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
