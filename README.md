# Entregable 1: Documentación Técnica  
## Módulo de Expediente Clínico: Notas de Evolución

## 1. Esquema de la base de datos

Para resolver el módulo de notas de evolución, se propone una base de datos relacional, ya que permite manejar de forma clara la relación entre pacientes, notas clínicas, alergias y notas aclaratorias. Esta estructura también ayuda a conservar la integridad de la información médica, especialmente porque las notas guardadas no deben modificarse ni eliminarse después de su registro.

### Tabla: `patients`

Esta tabla almacena la información básica de cada paciente.

| Campo | Tipo de dato | Descripción |
|---|---|---|
| `id` | INTEGER / UUID | Identificador único del paciente. |
| `full_name` | VARCHAR | Nombre completo del paciente. |
| `birth_date` | DATE | Fecha de nacimiento del paciente. |
| `gender` | VARCHAR | Género del paciente. |
| `created_at` | TIMESTAMP | Fecha y hora de creación del registro. |

### Tabla: `allergies`

Esta tabla funciona como catálogo general de alergias.

| Campo | Tipo de dato | Descripción |
|---|---|---|
| `id` | INTEGER / UUID | Identificador único de la alergia. |
| `name` | VARCHAR | Nombre de la alergia. |
| `description` | TEXT | Descripción opcional de la alergia. |

### Tabla: `patient_allergies`

Esta tabla relaciona a los pacientes con sus alergias registradas. Se usa una tabla intermedia porque un paciente puede tener varias alergias y una misma alergia puede estar asociada a varios pacientes.

| Campo | Tipo de dato | Descripción |
|---|---|---|
| `id` | INTEGER / UUID | Identificador único del registro. |
| `patient_id` | INTEGER / UUID | Identificador del paciente. |
| `allergy_id` | INTEGER / UUID | Identificador de la alergia. |
| `severity` | VARCHAR | Nivel de severidad: leve, moderada o grave. |
| `notes` | TEXT | Observaciones adicionales. |
| `created_at` | TIMESTAMP | Fecha y hora de registro de la alergia. |

### Tabla: `evolution_notes`

Esta tabla almacena las notas de evolución redactadas por el médico durante la consulta. Es la tabla principal del módulo.

| Campo | Tipo de dato | Descripción |
|---|---|---|
| `id` | INTEGER / UUID | Identificador único de la nota de evolución. |
| `patient_id` | INTEGER / UUID | Paciente al que pertenece la nota. |
| `doctor_id` | INTEGER / UUID | Médico que redactó la nota. |
| `note_text` | TEXT | Contenido clínico de la nota de evolución. |
| `created_at` | TIMESTAMP | Fecha y hora exacta en que se guardó la nota. |
| `created_by` | INTEGER / UUID | Usuario que registró la nota en el sistema. |

### Tabla: `clarification_notes`

Esta tabla almacena las notas aclaratorias. Su función es permitir correcciones o aclaraciones sin modificar la nota clínica original.

| Campo | Tipo de dato | Descripción |
|---|---|---|
| `id` | INTEGER / UUID | Identificador único de la nota aclaratoria. |
| `evolution_note_id` | INTEGER / UUID | Nota de evolución original a la que pertenece la aclaración. |
| `clarification_text` | TEXT | Texto de la aclaración. |
| `created_at` | TIMESTAMP | Fecha y hora en que se registró la aclaración. |
| `created_by` | INTEGER / UUID | Usuario que registró la aclaración. |

## 2. Relaciones entre tablas

Las relaciones principales del modelo son las siguientes:

- Un paciente puede tener muchas notas de evolución.
- Cada nota de evolución pertenece a un solo paciente.
- Un paciente puede tener muchas alergias registradas.
- Una alergia puede estar relacionada con varios pacientes.
- Una nota de evolución puede tener una o varias notas aclaratorias.
- Cada nota aclaratoria pertenece a una sola nota de evolución original.

Representación general:

```text
patients 1 ──── N evolution_notes
patients 1 ──── N patient_allergies
allergies 1 ──── N patient_allergies
evolution_notes 1 ──── N clarification_notes
