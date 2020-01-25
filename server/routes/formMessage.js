const express = require("express");

const router = express.Router();

const {
  getFormMessages,
  getFormMessage,
  addFormMessage,
  updateFormMessage,
  deleteFormMessage
} = require("../controllers/formMessage");

router.get("/formMessages", getFormMessages);
router.get("/formMessages/:formMessageId", getFormMessage);
router.post("/formMessages", addFormMessage);
router.post("/formMessages/:formMessageId", updateFormMessage);
router.delete("/formMessages/:formMessageId", deleteFormMessage);

module.exports = router;
