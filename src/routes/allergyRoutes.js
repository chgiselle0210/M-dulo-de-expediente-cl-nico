const express = require("express");
const router = express.Router();

const {
    createAllergy,
    assignAllergyToPatient,
    getPatientAllergies
} = require("../controllers/allergyController");

router.post("/", createAllergy);
router.post("/assign", assignAllergyToPatient);
router.get("/patient/:patientId", getPatientAllergies);

module.exports = router;