const jsonwebtoken = require('jsonwebtoken')
const {
  jwtSecret
} = require('../config')

const authValidation = (role) => {
  return (req, res, next) => {
    req.neededRole = role
    return validateToken(req, res, next)
  }
}

const validateToken = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provider',
    })
  }
  return verifyToken(token, req, res, next)
}

const verifyToken = (token, req, res, next) => {
  try {
    const decoded = jsonwebtoken.verify(token, jwtSecret)
    delete decoded.iat
    delete decoded.exp
    req.user = decoded
    return validateRole(req, res, next)
  } catch ({
    message, name
  }) {
    return res.status(401).json({
      success: false,
      message,
      type: name,
    })
  }
}

const validateRole = (req, res, next) => {
  if (req.user.role >= req.neededRole) {
    return next()
  }
  return res.status(401).json({
    success: false,
    message: 'Dont have permissions',
  })
}

module.exports = authValidation
