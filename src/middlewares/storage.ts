import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images') // Chemin de destination des fichiers uploadés
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg') // Nom du fichier avec extension (par exemple : "fieldname-1623445678743-123456789.jpg")
  }
});

const upload = multer({ storage: storage });

export { upload };
