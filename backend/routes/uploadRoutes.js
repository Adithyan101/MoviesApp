import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpg|jpeg|png|gif/;
  const extname = path.extname(file.originalname);
  const mimetypes = /image\/jpeg|image\/png|image\/jpg|image\/gif/;

  const mimetype = file.mimetype;

  if (fileTypes.test(extname) && mimetypes.test(mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Images only!"), false);
};

const upload = multer({
  storage,
  fileFilter,
});

const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    } else if (req.file) {
      res.status(200).json({
        path: `/uploads/${req.file.filename}`,
      });
    } else {
      return res
        .status(500)
        .json({ error: "Something went wrong, No Image File Provided" });
    }
  });
});

export default router;
