const express = require("express");
const router = express.Router();
const claimsSubmissionController = require("../../controllers/claimsSubmissionController.js");

router.get("/fetchAllClaimsSubmissions", claimsSubmissionController.getAllClaimsSubmissions);
router.get("/fetchClaimsSubmissionById/:id", claimsSubmissionController.getClaimsSubmissionById);
router.post("/createClaimsSubmission", claimsSubmissionController.createClaimsSubmission);
router.put("/updateClaimsSubmission", claimsSubmissionController.updateClaimsSubmission);
router.delete("/deleteClaimsSubmission/:id", claimsSubmissionController.deleteClaimsSubmission);
router.post("/uploadFile", claimsSubmissionController.upload.single("file")
    , claimsSubmissionController.uploadFile);
router.get("/fetchAllPayerNames", claimsSubmissionController.getAllPayerNames);
router.get("/fetchAllPatientNames", claimsSubmissionController.getAllPatientNames);
router.get("/filteredClaimsSubmissions", claimsSubmissionController.getFilteredClaimsSubmissions);
router.get("/getAllFacilityNames", claimsSubmissionController.getAllFacilityNames);
router.get("/getAllProviderNames", claimsSubmissionController.getAllProviderNames);
module.exports = router;