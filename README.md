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
```

## 3. Explicación de la lógica de no edición

La restricción principal del módulo es que una nota de evolución, una vez guardada, no puede ser editada ni eliminada bajo ninguna circunstancia. Para cumplir con esta regla, la tabla evolution_notes se considera un registro inmutable dentro del sistema.

Esto significa que el sistema solo permitirá operaciones de creación y consulta sobre las notas de evolución. No se expondrán endpoints de actualización ni eliminación para esta tabla. Por ejemplo, la API podrá tener una ruta para crear notas y otra para consultarlas, pero no tendrá rutas como PUT /evolution-notes/:id, PATCH /evolution-notes/:id o DELETE /evolution-notes/:id.

En caso de que exista un error en una nota ya guardada, la información original no se modifica. En su lugar, se crea un nuevo registro en la tabla clarification_notes, vinculado mediante el campo evolution_note_id. De esta manera, la nota original permanece intacta y cualquier corrección queda documentada como una aclaración posterior.

Esta estructura conserva el contenido inicial de la nota, la fecha exacta en que fue registrada y las aclaraciones que se agregaron después. Así, el historial médico mantiene una secuencia clara de lo que fue escrito originalmente y de lo que se añadió posteriormente como corrección o explicación.

Para reforzar esta restricción, la lógica del backend debe validar que las notas de evolución solo puedan crearse una vez. A nivel de base de datos se recomienda evitar permisos de actualización y eliminación sobre la tabla evolution_notes para el usuario utilizado por la aplicación. Con esto, aunque ocurra un error en la API, la base de datos también ayuda a proteger la integridad de las notas clínicas.

# Entregable 3: Análisis de Seguridad

La solución desarrollada contempla distintas medidas para proteger la integridad de la información clínica y reducir riesgos dentro de un entorno médico real. Una de las principales decisiones de seguridad fue implementar la inmutabilidad de las notas de evolución, evitando por completo endpoints de edición o eliminación (`PUT`, `PATCH` y `DELETE`) para este recurso. De esta forma, las notas médicas no pueden ser alteradas después de su registro, conservando trazabilidad clínica y evitando modificaciones indebidas en el historial del paciente. En caso de existir errores, el sistema únicamente permite agregar notas aclaratorias vinculadas a la nota original, manteniendo siempre intacto el registro inicial. Se utilizaron relaciones mediante claves foráneas en MySQL para preservar la integridad referencial entre pacientes, alergias, notas de evolución y aclaraciones.

Por otra parte, el backend aplica validaciones básicas en cada endpoint para evitar registros incompletos o inconsistentes dentro de la base de datos. También se utilizaron consultas parametrizadas con `mysql2`, lo que ayuda a prevenir ataques de tipo SQL Injection al evitar concatenaciones directas de datos proporcionados por el usuario. La lógica de alertas críticas apoya con la identificación de alergias registradas antes o durante el registro de una nota médica, ayudando a disminuir riesgos clínicos asociados a medicamentos o tratamientos incompatibles. La separación de responsabilidades mediante una estructura organizada en controladores, rutas y configuración mejora el mantenimiento del sistema y reduce la probabilidad de errores en futuras modificaciones del código.

## Justificación del uso de JavaScript

Para el desarrollo de esta solución decidí utilizar JavaScript con Node.js y Express debido a la experiencia previa que he adquirido al trabajar con este lenguaje en distintos bootcamps y proyectos prácticos. Gracias a ello, fue posible desarrollar la lógica del backend de forma más rápida, organizada y con mayor confianza en la implementación de las reglas de negocio solicitadas. JavaScript cuenta con un ecosistema amplio de librerías y herramientas que hacen más sencilla la construcción de APIs REST, la conexión con bases de datos MySQL y la estructuración modular de este tipo de proyectos.

Otro motivo importante fue la facilidad que brinda JavaScript para trabajar con arquitecturas basadas en controladores, rutas y middleware, contribuyendo a mantener una separación de responsabilidades dentro del sistema. Esto me ayudó a mantener congruencia entre la documentación técnica, la base de datos y el código implementado, especialmente en aspectos críticos como la inmutabilidad de las notas clínicas y la gestión de alertas por alergias.
