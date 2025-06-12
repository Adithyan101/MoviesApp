import express from 'express'
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js'
import { createGenre, updateGenre, removeGenre, listGenres, getSpecificGenre } from '../controllers/genreController.js';



const router = express.Router()

router.post('/', authenticate, authorizeAdmin, createGenre)
router.put('/:id', authenticate, authorizeAdmin, updateGenre)
router.delete('/:id', authenticate, authorizeAdmin, removeGenre)

router.get('/genres', listGenres)
router.get('/:id', getSpecificGenre)



export default router;