const crypto = require('crypto');
const fs = require('fs');
const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USERS_FILE = './users.json';

const app = express();

app.use(express.json());

// Crea el archivo json si no lo encuentra y le asigna un array vacio
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

app.post("/users", async (req, res) => {
  const newUser = req.body;
  // Crypting password
  newUser.password = await bcrypt.hash(newUser.password, 10);

  // Reading file
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");

    let users = JSON.parse(data.toString());
    users.push({ id: crypto.randomUUID(), ...newUser });
    // Writing data
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
      if (err) return res.status(500).send("Error al guardar el usuario");

      return res.status(200).send("Usuario creado exitosamente");
    });
  });
});

app.post("/login", async(req, res) => {
  const user = req.body;

  // Reading file
  await fs.readFile(USERS_FILE, async(err, data) => {
    if (err) return res.status(500).send("Error al leer el archivo");

    // Getting user from db json file
    let users = JSON.parse(data.toString());

    const existingUser = users.find(dbUser => dbUser.username === user.username);
    if (!existingUser) return res.status(404).send("Credenciales inválidas");

    // Checking password coincidence 
    const isValid = await bcrypt.compare(user.password, existingUser.password);
    if(!isValid) return res.status(404).send('Credenciales inválidas');

    return res.status(200).json({
      token: jwt.sign(
        { user: user.id },
        'my-key',
        { expiresIn: '1h' },
      ),
    });
  });
});

app.get("/posts", Auth, async (req, res) => {
  return res.status(200).json([]);
});

/* Middlewares */
function Auth (req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if(!token) return res.status(401).json('Sin autorización');

	const jwtPayload = jwt.verify(token, 'my-key');

	if(!jwtPayload) return res.status(403).json('Token inválido');

	next();
}

/* Using middleware */
app.get('/posts', Auth, (req, res) => {
	// Some code here...
  return res.status(200).json([]);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
