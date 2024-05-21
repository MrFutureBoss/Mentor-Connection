import express, { json } from "express";
import dotnv from "dotenv";
import cors from "cors";
import multer from "multer";
import createError from "http-errors";
import path from "path";
import connectDB from "./database.js";
import {
  adminsRouter,
  catergoryRouter,
  classRouter,
  mentorCategoriesRouter,
  userRouter,
  teacherRouter,
  projectCategoryRouter,
  projectRouter,
  groupRouter,
  mentorRouter,
  temporaryMatchingRouter,
  matchedRouter,
  smtDetRouter,
  semesterRouter,
} from "./routes/index.js";

const app = express();
dotnv.config();
app.use(cors());
app.use(json());
const port = process.env.PORT || 9999;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
app.use("/mentor", mentorRouter);
app.use("/semester_detail", smtDetRouter);
app.use("/semester", semesterRouter);
app.use("/project", projectRouter);
app.use("/teacher", teacherRouter);
app.use("/user", userRouter);
app.use("/group", groupRouter);
app.use("/class", classRouter);
app.use("/category", catergoryRouter);
app.use("/mentor_category", mentorCategoriesRouter);
app.use("/project_category", projectCategoryRouter);
app.use("/temporary_matching", temporaryMatchingRouter);
app.use("/matched", matchedRouter);
app.use("/admins", adminsRouter);
app.use(async (req, res, next) => {
  next(createError.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.status || 500,
    message: err.message,
  });
});
app.listen(port, (req, res) => {
  connectDB();
  console.log(`listening on ${port}`);
});
