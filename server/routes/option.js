const express = require("express");

const router = express.Router();

const { getOptions, getOption, addOption, updateOption, deleteOption } = require("../controllers/option");

router.get("/options", getOptions);
router.get("/options/:optionId", getOption);
router.post("/options", addOption);
router.post("/options/:optionId", updateOption);
router.delete("/options/:optionId", deleteOption);

module.exports = router;