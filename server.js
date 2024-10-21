const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./db/lista_amor.db');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Crear la tabla si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS lista_amor (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contenido TEXT NOT NULL,
        creador TEXT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Obtener la lista
app.get('/api/lista', (req, res) => {
    db.all('SELECT * FROM lista_amor', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Añadir un elemento
app.post('/api/lista', (req, res) => {
    const { contenido, creador } = req.body;
    db.run('INSERT INTO lista_amor (contenido, creador) VALUES (?, ?)', [contenido, creador], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, contenido, creador });
    });
});

// Eliminar un elemento
app.delete('/api/lista/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM lista_amor WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ mensaje: 'Elemento eliminado' });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
