import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { connectDB } from './config/db.js'
import api from './route/index.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api', api)
app.get('/', (_req, res) => res.send('OK'))

const PORT = process.env.PORT || 8080

await connectDB(process.env.MONGO_URI)  // đảm bảo connectDB là async/await
app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`))
