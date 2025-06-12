import Genre from "../models/genreModel.js";

const createGenre = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      res.status(400).json({ message: "Name is required" });
    }

    const existingGenre = await Genre.findOne({ name });
    if (existingGenre) {
      return res.status(400).json({ message: "Genre already exists" });
    }
    const genre = new Genre({ name });
    await genre.save();
    res.status(201).json({ genre });
  } catch (error) {
    res.status(400).json({ message: "Error in creating genre" });
    console.log("error in create genre controller", error);
  }
};

const updateGenre = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const genre = await Genre.findOne({ _id: id });
    if (!genre) {
      res.status(404).json({ message: "Genre not found" });
    }
    genre.name = name || genre.name;
    await genre.save();
    res.status(200).json({ genre });
  } catch (error) {
    res.status(400).json({ message: "Error in creating genre" });
    console.log("error in update genre controller", error);
  }
};

const removeGenre = async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await Genre.findByIdAndDelete({ _id: id });
    if (!genre) {
      res.status(404).json({ message: "Genre not found" });
    }
    res.status(200).json({ message: "Genre removed successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error in removing genre" });
    console.log("error in remove genre controller", error);
  }
};

const listGenres = async (req, res) => {
  try {
    const genres = await Genre.find({});
    res.status(200).json({ genres });
  } catch (error) {
    res.status(400).json({ message: "Error in listing genre" });
    console.log("error in listing genre controller", error);
  }
};

const getSpecificGenre =async(req,res)=>{
  const { id } = req.params;
  try {

    const genre = await Genre.findById({_id:id});
    if (!genre) {
      res.status(404).json({ message: "Genre not found" });
    }
    res.status(200).json({ genre });
    
  } catch (error) {
    res.status(400).json({ message: "Error in getting specific genre" });
    console.log("error in getting specific genre controller", error);
  }
}

export { createGenre, updateGenre, removeGenre, listGenres, getSpecificGenre };
