import express from "express";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

import {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies
} from "../controllers/movieController.js";

const router = express.Router();

//public routes
router.get("/movieslist", authenticate, getAllMovies);
router.get("/specific-movie/:id",authenticate, getSpecificMovie);
router.get('/new-movies', getNewMovies);
router.get('/top-movies', getTopMovies);

//restricted routes
router.post("/:id/reviews", authenticate, checkId, movieReview);

//Admin routes
router.post("/create-movie", authenticate, authorizeAdmin, createMovie);
router.put("/update-movie/:id", authenticate, authorizeAdmin, updateMovie);
router.delete("/delete-movie/:id", authenticate, authorizeAdmin, deleteMovie);
router.delete("/delete-comment", authenticate, authorizeAdmin, deleteComment);

export default router;
