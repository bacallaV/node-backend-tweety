const jwt = require('jsonwebtoken');

function Auth (req, res, next) {
	const token = req.headers.authorization?.split(' ')[1];
	if(!token) return res.status(401).json('Sin autorización');

	const jwtPayload = jwt.verify(token, 'my-key');

	if(!jwtPayload) return res.status(403).json('Token inválido');

	next();
}

module.exports = {
	Auth
}