const express = require("express");

const router = express.Router();

const { getSubjects, getSubject, addSubject, updateSubject, deleteSubject } = require("../controllers/subject");

router.get("/subjects", getSubjects);
router.get("/subjects/:subjectId", getSubject);
router.post("/subjects", addSubject);
router.post("/subjects/:subjectId", updateSubject);
router.delete("/subjects/:subjectId", deleteSubject);

module.exports = router;