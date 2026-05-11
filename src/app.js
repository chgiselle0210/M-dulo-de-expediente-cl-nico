const express = require("express");
const cors = require("cors");
require("dotenv").config();

const allergyRoutes = require("./routes/allergyRoutes");
const patientRoutes = require("./routes/patientRoutes");
const evolutionNoteRoutes = require("./routes/evolutionNoteRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API del módulo de expediente clínico funcionando correctamente"
    });
});

app.use("/api/patients", patientRoutes);
app.use("/api/allergies", allergyRoutes);
app.use("/api/evolution-notes", evolutionNoteRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});