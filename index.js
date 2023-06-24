import express from 'express'
import cors from 'cors'
import {config} from 'dotenv'
import multer from 'multer'
import { processAudio } from './processAudio/processAudio.js'
config()

const app = express()
app.use(cors())
const storage = multer.diskStorage({
  filename: (req, file, cb) => cb(null, 'voiceRecording.wav'),
  destination: (req, file, cb) => cb(null, './uploads')
})
const upload = multer({ storage })

app.get('/posts', async(req, res) => {
  return res.send({ data: 'posts' })
})

app.get('/posts/:id', async(req, res) => {
  return res.send({ data: req.params.id })
})

app.post('/processAudio', upload.any('file'), processAudio)

app.listen('5050', () => console.log('Server Started...'))