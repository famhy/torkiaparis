import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { registerRoutes } from './routes/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors({ origin: true }))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

registerRoutes(app)

export default app
