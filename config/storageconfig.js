const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationPath = "./uploads/";
    if (file.fieldname === "image") {
      destinationPath += "images/";
    } else if (file.fieldname === "video") {
      destinationPath += "videos/";
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = storage;