import multer from "multer";

// Multer configuration from its official documentation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Save the file in the temp folder on my file system
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage }); // Export the multer instance
