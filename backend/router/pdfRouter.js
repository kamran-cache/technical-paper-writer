// const express = require("express");
// const router = express.Router();
// const pdfController = require("../controllers/pdfController");

// const { auth } = require("../middleware/auth");

// router.route("/add-pdf/:paperId").post(auth, pdfController.addPdf);
// router.put("/:paperId", pdfController.updatePdf);
// module.exports = router;

// demo2
const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdfController");
const multer = require("multer");

const upload = multer({ storeage: multer.memoryStorage() });
const { auth } = require("../middleware/auth");

router
  .route("/add-pdf/:paperId")
  .post(auth, upload.single("pdf"), pdfController.addOrUpdatePdf);
router.delete("/:paperId/:pdfId", pdfController.deletePdf);
module.exports = router;
