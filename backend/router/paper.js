const express = require("express");
const router = express.Router();
const paperController = require("../controllers/paperController");

const { auth } = require("../middleware/auth");

router.post("/generate", auth, paperController.generatePaper);
router.route("/add").post(auth, paperController.createPaper);
router.route("/get-paper/:id").get(auth, paperController.getUserPaper);
router.route("/:paperId").delete(auth, paperController.deletePaper);
router.put("/:paperId", paperController.updatePaper);
module.exports = router;
