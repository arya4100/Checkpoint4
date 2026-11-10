// db.js - tiny file based "database" that stores students in data/students.json.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data')
const DATA_FILE = path.join(DATA_DIR, 'students.json')

/** Reads all students from the JSON file (creates the file on first run). */
function readStudents() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(DATA_FILE, '[]')
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
}

/** Writes the full students array back to the JSON file. */
function writeStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2))
}

/**
 * Finds a student by e-mail address (case-insensitive).
 * @param {string} email
 * @returns {object|undefined}
 */
export function findStudentByEmail(email) {
  return readStudents().find((s) => s.email.toLowerCase() === email.toLowerCase())
}

/**
 * Finds a student by id.
 * @param {number} id
 * @returns {object|undefined}
 */
export function findStudentById(id) {
  return readStudents().find((s) => s.id === id)
}

/**
 * Saves a new student. The password must already be hashed.
 * @param {object} student - name, email, contactNumber, gender, passwordHash
 * @returns {object} the saved student (with its new id)
 */
export function addStudent(student) {
  const students = readStudents()
  const saved = { id: Date.now(), ...student }
  students.push(saved)
  writeStudents(students)
  return saved
}
