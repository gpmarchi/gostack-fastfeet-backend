import { Op } from 'sequelize';

import Parcel from '../models/Parcel';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryController {
  async index(req, res) {
    const { id } = req.params;
    const { page, limit, status } = req.query;

    const hasPagination = page && limit;

    const delivered = status === 'delivered';

    const parcels = await Parcel.findAll({
      where: {
        deliveryman_id: id,
        end_date: delivered ? { [Op.ne]: null } : null,
        cancelled_at: null,
      },
      order: ['created_at'],
      limit: hasPagination && limit,
      offset: hasPagination && (page - 1) * limit,
      attributes: ['id', 'product', 'start_date', 'end_date', 'created_at'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'state',
            'city',
            'zipcode',
          ],
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
      return res.status(404).json({ error: 'Encomenda não encontrada.' });
    }

    if (!parcel.start_date) {
      return res.status(400).json({ error: 'Encomenda ainda não retirada.' });
    }

    if (parcel.end_date) {
      return res.status(400).json({ error: 'Encomenda já finalizada.' });
    }

    if (!req.file) {
      return res.status(400).json({
        error:
          'É obrigatório o envio da imagem com a assinatura do destinatário.',
      });
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
