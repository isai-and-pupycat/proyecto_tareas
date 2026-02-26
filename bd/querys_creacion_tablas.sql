



CREATE TABLE horarios (
id_horario SERIAL PRIMARY KEY,
dia_semana CHAR(3) NOT NULL,
hora_inicio TIME NOT NULL,
hora_fin TIME NOT NULL,
id_materia INT NOT NULL,
CONSTRAINT chk_dia_semana
CHECK (dia_semana IN ('Lun', 'Mar', 'Mie', 'Jue', 'Vie')),
CONSTRAINT fk_horario_materia
FOREIGN KEY (id_materia)
REFERENCES materias(id_materia)
ON DELETE CASCADE
);


CREATE TABLE tareas (
id_tarea SERIAL PRIMARY KEY,
titulo VARCHAR(150) NOT NULL,
descripcion TEXT,
fecha_entrega DATE NOT NULL,
completada BOOLEAN DEFAULT FALSE,
fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
id_materia INT NOT NULL,
CONSTRAINT fk_tarea_materia
FOREIGN KEY (id_materia)
REFERENCES materias(id_materia)
ON DELETE CASCADE
);