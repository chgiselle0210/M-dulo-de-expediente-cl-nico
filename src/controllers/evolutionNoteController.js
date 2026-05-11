const db = require("../config/db");

const createEvolutionNote = async (req, res) => {
    try {
        const {
            patient_id,
            doctor_id,
            note_text,
            created_by
        } = req.body;

        if (!patient_id || !doctor_id || !note_text || !created_by) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios."
            });
        }

        const [patient] = await db.query(
            "SELECT * FROM patients WHERE id = ?",
            [patient_id]
        );

        if (patient.length === 0) {
            return res.status(404).json({
                message: "El paciente no existe."
            });
        }

        const [allergies] = await db.query(
            `SELECT a.name
            FROM patient_allergies pa
            INNER JOIN allergies a ON pa.allergy_id = a.id
            WHERE pa.patient_id = ?`,
            [patient_id]
        );

        const [result] = await db.query(
            `INSERT INTO evolution_notes
            (patient_id, doctor_id, note_text, created_by)
            VALUES (?, ?, ?, ?)`,
            [patient_id, doctor_id, note_text, created_by]
        );

        res.status(201).json({
            message: "Nota de evolución registrada correctamente.",
            evolution_note_id: result.insertId,
            allergy_alert:
                allergies.length > 0
                    ? {
                        has_allergies: true,
                        message: "ALERTA: El paciente tiene alergias registradas.",
                        allergies
                    }
                    : {
                        has_allergies: false
                    }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar nota de evolución.",
            error: error.message
        });
    }
};

const getEvolutionNotes = async (req, res) => {
    try {
        const [notes] = await db.query(
            `SELECT
                id,
                patient_id,
                doctor_id,
                note_text,
                created_at,
                created_by
            FROM evolution_notes
            ORDER BY created_at DESC`
        );

        res.json(notes);

    } catch (error) {
        res.status(500).json({
            message: "Error al consultar notas de evolución.",
            error: error.message
        });
    }
};

const createClarificationNote = async (req, res) => {
    try {
        const {
            evolution_note_id,
            clarification_text,
            created_by
        } = req.body;

        if (!evolution_note_id || !clarification_text || !created_by) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios."
            });
        }

        const [note] = await db.query(
            "SELECT * FROM evolution_notes WHERE id = ?",
            [evolution_note_id]
        );

        if (note.length === 0) {
            return res.status(404).json({
                message: "La nota de evolución no existe."
            });
        }

        const [result] = await db.query(
            `INSERT INTO clarification_notes
            (evolution_note_id, clarification_text, created_by)
            VALUES (?, ?, ?)`,
            [evolution_note_id, clarification_text, created_by]
        );

        res.status(201).json({
            message: "Nota aclaratoria registrada correctamente.",
            clarification_note_id: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al registrar nota aclaratoria.",
            error: error.message
        });
    }
};

module.exports = {
    createEvolutionNote,
    getEvolutionNotes,
    createClarificationNote
};