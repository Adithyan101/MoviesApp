import Movie from "../models/movieModel.js";

const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    if(!movie){
      res.status(404).json({ message: "Error in creating movie" });
    }
    res.status(201).json({ movie });
  } catch (error) {
    console.log("error in create movie controller", error);
    res.status(404).json({ message: "Error in creating movie" });
  }
};

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json({ movies });
  } catch (error) {
    console.log("error in get all movies controller", error);
    res.status(404).json({ message: "Error in getting all movies" });
  }
};

const getSpecificMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    res.status(200).json({ movie });
  } catch (error) {
    console.log("error in get specific movie controller", error);
    res.status(404).json({ message: "Error in getting specific movie" });
  }
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById({ _id: id });
    console.log("movie", movie);
    console.log("req.body", req.body);
    if (!movie) {
      res.status(404).json({ message: "Movie not found" });
    }
    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ updatedMovie });
  } catch (error) {
    console.log("error in update movie controller", error);
    res.status(404).json({ message: "Error in updating movie" });
  }
};

const movieReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const movie = await Movie.findById(req.params.id);
    if (movie) {
      const alreadyReviewed = movie.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400).json({
          message: "Movie already reviewed",
        });
      }
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      movie.reviews.push(review);
      movie.numOfReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
        movie.reviews.length;
      const updatedMovie = await movie.save();
      res.status(200).json({ updatedMovie });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    console.log("error in movie review controller", error);
    res.status(404).json({ message: "Error in movie review" });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteMovie = await Movie.findByIdAndDelete(id);

    if (!deleteMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { movieId, reviewId } = req.body;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const reviewIndex = movie.reviews.findIndex(
      (r) => r._id.toString() === reviewId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    movie.reviews.splice(reviewIndex, 1);
    movie.numOfReviews = movie.reviews.length;
    movie.rating =
      movie.reviews.length > 0
        ? movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
          movie.reviews.length
        : 0;

    await movie.save();
    res.json({ message: "Comment Deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getNewMovies = async(req,res)=>{
  try {

    const newMovies = await Movie.find({}).sort({ createdAt: -1 }).limit(10);
    console.log("newMovies",newMovies)
    res.status(200).json({ newMovies });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}


const getTopMovies = async(req,res)=>{
  try {

    const topRatedMovies = await Movie.find({}).sort({ numOfReviews: -1 }).limit(10);
    res.status(200).json({ topRatedMovies });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

export {
  createMovie,
  getAllMovies,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies
};
