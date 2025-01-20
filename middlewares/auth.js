// importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// importar la clave secreta
const { secret } = require("../helper/jwt");

// crear middleware de autenticación
exports.auth = (req, res, next) => {
  // comprobar si me lleva la cabezera de autorización
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ error: "La petición no tiene la cabecera de autorización" });
  }

  // limpiar token
  const token = req.headers.authorization.replace(/['"]+/g, "");

  // decodificar token
  try {
    let payload = jwt.decode(token, secret);
    // comprobar si el token ha expirado
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        error: "El token ha expirado",
      });
    }

    // Agregar datos del usuario al objeto request
    req.user = payload;

   
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return res.status(403).send({ error: "Token no válido" });
  }
   // continuar con la ejecución de la accion
    next();
};
