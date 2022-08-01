const multer = require("multer");
const { storage } = require("../config/multer");

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error(
          "Apenas imagens com formato .png, .jpg and .jpeg são permitidas"
        )
      );
    }
  },
});

module.exports = upload.single("avatar");
