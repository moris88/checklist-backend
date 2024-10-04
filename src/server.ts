import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getProject,
  register,
  login,
  logout,
  refreshToken,
  getProfiles,
  getProfile,
  updateProfile,
  deleteProfile,
  authorizationMiddleware,
  generalPathMatch,
  getMember,
  getTask,
  search,
} from './controllers'

const app = express() // create a new express application instance
dotenv.config() // load .env file
const { PORT } = process.env // get environment variables

// Configuration of the options CORS
const corsOptions = {
  origin: '*', // Set allowed source
  methods: ['GET', 'PUT', 'DELETE', 'POST', 'OPTIONS'], // Set allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Set allowed headers
}

// LIST OF MIDDLEWARES
app.use(cors(corsOptions)) // middleware with options CORS
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(authorizationMiddleware)

// LIST OF ROUTES v1
// PATHS Projects:
// GET /projects - get all projects
app.get('/api/v1/projects', getProjects)
// GET /project - get project
app.get('/api/v1/project/:id', getProject)
// POST /project - create a new project
app.post('/api/v1/project', createProject)
// PUT /project - update a project
app.put('/api/v1/project/:id', updateProject)
// DELETE /project - delete a project
app.delete('/api/v1/project/:id', deleteProject)
// PATHS Tasks:
// GET /tasks - get all tasks
app.get('/api/v1/tasks', getTasks)
// GET /task - get task
app.get('/api/v1/task/:id', getTask)
// POST /task - create a new task
app.post('/api/v1/task', createTask)
// PUT /task - update a task
app.put('/api/v1/task/:id', updateTask)
// DELETE /task - delete a task
app.delete('/api/v1/task/:id', deleteTask)
// PATHS Members:
// GET /members - get all members
app.get('/api/v1/members', getMembers)
// GET /member - get member
app.get('/api/v1/member/:id', getMember)
// POST /member - create a new member
app.post('/api/v1/member', createMember)
// PUT /member - update a member
app.put('/api/v1/member/:id', updateMember)
// DELETE /member - delete a member
app.delete('/api/v1/member/:id', deleteMember)
// PATHS Auth:
// POST /register
app.post('/api/v1/register', register)
// POST /login
app.post('/api/v1/login', login)
// POST /login
app.post('/api/v1/refresh', refreshToken)
// POST /logout
app.post('/api/v1/logout', logout)
// GET /profiles
app.get('/api/v1/profiles', getProfiles)
// GET /profile
app.get('/api/v1/profiles/:id', getProfile)
// PUT /profile
app.put('/api/v1/profiles/:id', updateProfile)
// DELETE /profile
app.delete('/api/v1/profiles/:id', deleteProfile)
// PATHS Search:
// GET /search
app.get('/api/v1/search', search)

// (all other methods) /* - 404
app.all('*', generalPathMatch)

// Start the server
app.listen(PORT ?? 5000, () => {
  console.log('-->SERVER STARTED!')
  console.log(`Webservice listening on port ${PORT}`)
})
