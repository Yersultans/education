const express = require("express");

const router = express.Router();

const { getLessons, getLesson, addLesson, updateLesson, deleteLesson } = require("../controllers/lesson");

router.get("/lessons", getLessons);
router.get("/lessons/:lessonId", getLesson);
router.post("/lessons", addLesson);
router.post("/lessons/:lessonId", updateLesson);
router.delete("/lessons/:lessonId", deleteLesson);

module.exports = router;