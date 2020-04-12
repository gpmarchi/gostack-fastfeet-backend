import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import NewParcelMail from '../jobs/NewParcelMail';

import Parcel from '../models/Parcel';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import UpdateParcelService from '../services/UpdateParcelService';
import DeleteParcelService from '../services/DeleteParcelService';

class ParcelController {
  async index(req, res) {
    const { page, limit, query } = req.query;

    const hasPagination = page && limit;

    let where = {};
    if (query) {
      where = { where: { product: { [Op.iLike]: `%${query}%` } } };
    }

    const total = hasPagination && (await Parcel.count(where));
    const totalPages = hasPagination && Math.ceil(total / limit);

    const parcels = await Parcel.findAll({
      ...where,
      order: [['created_at', 'DESC']],
      limit: hasPagination && limit,
      offset: hasPagination && (page - 1) * limit,
      attributes: ['id', 'product', 'cancelled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'zipcode',
            'state',
            'city',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'filename', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'filename', 'url'],
        },
      ],
    });

    return res.json(hasPagination ? { parcels, totalPages } : parcels);
  }

  async show(req, res) {
    const { id } = req.params;

    const parcel = await Parcel.findByPk(id);

    return res.json(parcel);
  }

  async store(req, res) {
    const recipient = await Recipient.findByPk(req.body.recipient_id);

    /**
     * Check if recipient exists
     */
    if (!recipient) {
      return res.status(400).json({ error: 'Destinatário não encontrado.' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    /**
     * Check if deliveryman exists
     */
    if (!deliveryman) {
      return res.status(400).json({ error: 'Entregador não encontrado.' });
    }

    /**
     * Enforce these fields won't be created at this moment
     */
    const newParcel = req.body;
    delete newParcel.signature_id;
    delete newParcel.cancelled_at;
    delete newParcel.start_date;
    delete newParcel.end_date;

    const parcel = await Parcel.create(newParcel);

    await Queue.add(NewParcelMail.key, { deliveryman, parcel, recipient });

    return res.json(parcel);
  }

  async update(req, res) {
    const { id } = req.params;

    const updatedParcelData = req.body;

    try {
      const updatedParcel = await UpdateParcelService.run({
        parcel_id: id,
        updatedParcelData,
      });

      return res.json(updatedParcel);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    try {
      await DeleteParcelService.run({
        parcel_id: id,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    return res.send();
  }
}

export default new ParcelController();
