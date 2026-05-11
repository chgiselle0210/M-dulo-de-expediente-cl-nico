const db = require("../config/db");

const createPatient = async (req, res) => {
    try {
        const { full_name, birth_date, gender } = req.body;

        if (!full_name || !birth_date || !gender) {
            return res.status(400).json({
                message: "Los campos full_name, birth_date y gender son obligatorios."
            });
        }

        const [result] = await db.query(
            "INSERT INTO patients (full_name, birth_date, gender) VALUES (?, ?, ?)",
            [full_name, birth_date, gender]
        );

        res.status(201).json({
            message: "Paciente registrado correctamente.",
            patient_id: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al registrar el paciente.",
            error: error.message
        });
    }
};

const getPatients = async (req, res) => {
    try {
        const [patients] = await db.query(
            "SELECT id, full_name, birth_date, gender, created_at FROM patients ORDER BY created_at DESC"
        );

        res.json(patients);
    } catch (error) {
        res.status(500).json({
            message: "Error al consultar pacientes.",
            error: error.message
        });
    }
};

module.exports = {
    createPatient,
    getPatients
};