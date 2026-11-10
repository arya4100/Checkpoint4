// index.js - Express server: Registration, Login and a protected Profile API.
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { generateToken, authenticateToken } from './auth.js'
import { findStudentByEmail, findStudentById, addStudent } from './db.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+?[0-9]{7,15}$/
const GENDERS = ['Male', 'Female', 'Other']

/**
 * Validates the registration body.
 * @returns {string|null} an error message, or null when everything is valid
 */
function validateRegistration(body) {
  const { name, email, contactNumber, gender, password, confirmPassword } = body
  if (!name || name.trim().length < 2) return 'Name must be at least 2 characters.'
  if (!email || !EMAIL_REGEX.test(email)) return 'Enter a valid e-mail address.'
  if (!contactNumber || !PHONE_REGEX.test(contactNumber)) return 'Contact number must be 7 to 15 digits.'
  if (!GENDERS.includes(gender)) return 'Select a gender.'
  if (!password || password.length < 8) return 'Password must be at least 8 characters.'
  if (password !== confirmPassword) return 'Passwords do not match.'
  return null
}

// POST /api/register - create a new student account
app.post('/api/register', async (req, res) => {
  const error = validateRegistration(req.body)
  if (error) return res.status(400).json({ message: error })

  const { name, email, contactNumber, gender, password } = req.body

  if (findStudentByEmail(email)) {
    return res.status(409).json({ message: 'This e-mail is already registered.' })
  }

  // Never store plain text passwords - store a bcrypt hash instead
  const passwordHash = await bcrypt.hash(password, 10)
  addStudent({ name: name.trim(), email: email.trim(), contactNumber, gender, passwordHash })

  res.status(201).json({ message: 'Registration successful. Please log in.' })
})

// POST /api/login - check credentials and return a JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'E-mail and password are required.' })
  }

  const student = findStudentByEmail(email)
  const passwordOk = student && (await bcrypt.compare(password, student.passwordHash))
  if (!passwordOk) {
    // Same message for both cases so attackers cannot find out which e-mails exist
    return res.status(401).json({ message: 'Invalid e-mail or password.' })
  }

  res.json({
    message: 'Login successful.',
    token: generateToken(student),
    student: { id: student.id, name: student.name, email: student.email },
  })
})

// GET /api/profile - protected route, requires a valid JWT
app.get('/api/profile', authenticateToken, (req, res) => {
  const student = findStudentById(req.user.id)
  if (!student) return res.status(404).json({ message: 'Student not found.' })

  const { passwordHash: _passwordHash, ...profile } = student // never send the hash
  res.json(profile)
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
