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
}

export default new DeliveryController();
