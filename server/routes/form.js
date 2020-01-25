const express = require("express");

const router = express.Router();

const {
  getForms,
  getForm,
  addForm,
  updateForm,
  deleteForm
} = require("../controllers/form");

router.get("/forms", getForms);
router.get("/forms/:formId", getForm);
router.post("/forms", addForm);
router.post("/forms/:formId", updateForm);
router.delete("/forms/:formId", deleteForm);

module.exports = router;
