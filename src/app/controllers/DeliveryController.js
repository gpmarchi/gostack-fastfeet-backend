import { Op } from 'sequelize';

import Parcel from '../models/Parcel';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const { id } = req.params;
    const { page, status } = req.query;

    const delivered = status === 'delivered';

    const parcels = await Parcel.findAll({
      where: {
        deliveryman_id: id,
        end_date: delivered ? { [Op.ne]: null } : null,
      },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['id', 'name', 'state', 'city'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'filename', 'url'],
        },
      ],
    });

    return res.json(parcels);
  }

  async store(req, res) {
    const { id, parcelId } = req.params;

    const parcel = await Parcel.findOne({
      where: {
        id: parcelId,
        deliveryman_id: id,
        cancelled_at: null,
      },
    });

    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found.' });
    }

    if (!parcel.start_date) {
      return res
        .status(400)
        .json({ error: 'Parcel have not been picked up yet.' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'You must provide a signature file.' });
    }

    const { originalname: original_name, filename } = req.file;

    const file = await File.create({ original_name, filename });

    parcel.end_date = new Date();
    parcel.signature_id = file.id;

    await parcel.save();

    return res.json(parcel);
  }
}

export default new DeliveryController();
