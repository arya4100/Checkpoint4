// auth.js - JWT Authentication helpers for the server (sign token + verify middleware).
import jwt from 'jsonwebtoken'

// Secret used to sign tokens. In real projects keep it in an environment variable.
const JWT_SECRET = process.env.JWT_SECRET || 'weekly-checkpoint4-dev-secret'
const TOKEN_EXPIRY = '1h'

/**
 * Creates a signed JWT for a student.
 * @param {{id:number, email:string, name:string}} student
 * @returns {string} signed token (expires in 1 hour)
 */
export function generateToken(student) {
  return jwt.sign(
    { id: student.id, email: student.email, name: student.name },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

/**
 * Express middleware: allows the request only if it carries a valid token
 * in the header  "Authorization: Bearer <token>".
 * The decoded token payload is stored in req.user.
 */
export function authenticateToken(req, res, next) {
  const header = req.headers['authorization'] || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    // Token is expired, tampered with, or signed with another secret
    return res.status(403).json({ message: 'Invalid or expired token.' })
  }
}
