import mongoose, { mongo } from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 2000,
    },
    genre: {
      type: ObjectId,
      ref: "Genre",
      required: true,
    },
    cast: [
      {
        type: String,
        required: true,
      },
    ],
    year: {
      type: String,
      required: true,
    },
    reviews: [
      reviewSchema
    ],
    numOfReviews: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;
