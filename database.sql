CREATE DATABASE IF NOT EXISTS expediente_clinico_db;

USE expediente_clinico_db;

CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE allergies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE patient_allergies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    allergy_id INT NOT NULL,
    severity VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_patient_allergies_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id),

    CONSTRAINT fk_patient_allergies_allergy
        FOREIGN KEY (allergy_id)
        REFERENCES allergies(id)
);

CREATE TABLE evolution_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,

    CONSTRAINT fk_evolution_notes_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
);

CREATE TABLE clarification_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evolution_note_id INT NOT NULL,
    clarification_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,

    CONSTRAINT fk_clarification_notes_evolution_note
        FOREIGN KEY (evolution_note_id)
        REFERENCES evolution_notes(id)
);