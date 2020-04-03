import File from '../models/File';

class FileController {
  async store(req, res) {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'É obrigatório o envio de um arquivo.' });
    }

    const { originalname: original_name, filename } = req.file;

    const file = await File.create({ original_name, filename });

    return res.json(file);
  }
}

export default new FileController();
