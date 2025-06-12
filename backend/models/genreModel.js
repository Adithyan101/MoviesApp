import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 32,
        unique: true
    },
}, {
    timestamps: true,
});

export default mongoose.model("Genre", genreSchema);

