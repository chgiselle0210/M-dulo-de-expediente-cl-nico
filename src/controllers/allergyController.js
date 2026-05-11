const db = require("../config/db");

const createAllergy = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "El campo name es obligatorio."
            });
        }

        const [result] = await db.query(
            "INSERT INTO allergies (name, description) VALUES (?, ?)",
            [name, description || null]
        );

        res.status(201).json({
            message: "Alergia registrada correctamente.",
            allergy_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar la alergia.",
            error: error.message
        });
    }
};

const assignAllergyToPatient = async (req, res) => {
    try {
        const { patient_id, allergy_id, severity, notes } = req.body;

        if (!patient_id || !allergy_id) {
            return res.status(400).json({
                message: "Los campos patient_id y allergy_id son obligatorios."
            });
        }

        const [result] = await db.query(
            `INSERT INTO patient_allergies 
            (patient_id, allergy_id, severity, notes) 
            VALUES (?, ?, ?, ?)`,
            [patient_id, allergy_id, severity || null, notes || null]
        );

        res.status(201).json({
            message: "Alergia asignada al paciente correctamente.",
            patient_allergy_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al asignar alergia al paciente.",
            error: error.message
        });
    }
};

const getPatientAllergies = async (req, res) => {
    try {
        const { patientId } = req.params;

        const [allergies] = await db.query(
            `SELECT 
                pa.id,
                pa.patient_id,
                a.name AS allergy_name,
                a.description,
                pa.severity,
                pa.notes,
                pa.created_at
            FROM patient_allergies pa
            INNER JOIN allergies a ON pa.allergy_id = a.id
            WHERE pa.patient_id = ?`,
            [patientId]
        );

        res.json({
            has_allergies: allergies.length > 0,
            alert: allergies.length > 0
                ? "ALERTA: El paciente tiene alergias registradas."
                : "El paciente no tiene alergias registradas.",
            allergies
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al consultar alergias del paciente.",
            error: error.message
        });
    }
};

module.exports = {
    createAllergy,
    assignAllergyToPatient,
    getPatientAllergies
};