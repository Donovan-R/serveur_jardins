const { BadRequestError } = require('../errors');

const { StatusCodes } = require('http-status-codes');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadJustificatif = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('pas de fichier uploadé');
  }
  const { justificatif } = req.files;

  //* nous vérifions le format
  // if (!justificatifDomicile.mimetype.startsWith('PDF')) {
  //   throw new BadRequestError('veuillez charger un fichier PDF');
  // }

  //* nous vérifions la size de l'image

  const maxSize = 1024 * 1024; //10 Mb
  if (justificatif.size > maxSize) {
    throw new BadRequestError(
      'veuillez charger un document inférieure à 10 Mb'
    );
  }

  //*stocker l'image où l'on veut mais doit être accessible publiquement, express.static()

  // console.log(__dirname); //affiche le répertoire courant

  const justificatifPath = path.join(
    __dirname,
    '../public/uploads/' + `${justificatif.name}`
  );

  //* déplace l'image
  await justificatif.mv(justificatifPath);

  res
    .status(StatusCodes.OK)
    .json({ file: { src: `./uploads/${justificatif.name}` } });

  const result = await cloudinary.uploader.upload(req.files.tempFilePath, {
    use_filename: true,
    folder: 'file-upload',
  });

  //* suppression du fichier temp
  fs.unlinkSync(req.files.tempFilePath);

  //* récupération
  res.status(StatusCodes.OK).json({
    file: {
      src: result.secure_url,
    },
  });
};
module.exports = { uploadJustificatif };
