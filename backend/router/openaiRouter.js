const express = require("express");
const router = express.Router();
const openaiController = require("../controllers/openaiController");

const { auth } = require("../middleware/auth");

router.post("/:paperId", auth, openaiController.writeWithAi);

module.exports = router;
