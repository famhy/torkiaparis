import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    const safeExt = /^\.(jpe?g|png|gif|webp)$/i.test(ext) ? ext : '.jpg'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.mimetype)
    if (allowed) cb(null, true)
    else cb(new Error('Type de fichier non autorisé. Utilisez une image (JPEG, PNG, GIF, WebP).'))
  },
})

const router = Router()

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier image envoyé' })
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
})

router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo)' })
  }
  res.status(400).json({ error: err.message || 'Erreur upload' })
})

export default router
