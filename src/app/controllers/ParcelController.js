import * as Yup from 'yup';
import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import NewParcelMail from '../jobs/NewParcelMail';

import Parcel from '../models/Parcel';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class ParcelController {
  async index(req, res) {
    const { page = 1, limit = 6, query } = req.query;

    let where = {};
    if (query) {
      where = { where: { product: { [Op.iLike]: `%${query}%` } } };
    }

    const total = await Parcel.count(where);
    const totalPages = Math.ceil(total / limit);

    const parcels = await Parcel.findAll({
      ...where,
      order: [['created_at', 'DESC']],
      limit,
      offset: (page - 1) * limit,
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

    return res.json({ parcels, totalPages });
  }

  async show(req, res) {
    const { id } = req.params;

    const parcel = await Parcel.findByPk(id);

    return res.json(parcel);
  }

  async store(req, res) {
    const validationSchema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await validationSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    const recipient = await Recipient.findByPk(req.body.recipient_id);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found.' });
    }

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

    let parcel = await Parcel.findByPk(id);

    if (!parcel) {
      return res.status(400).json({ error: 'Parcel not found.' });
    }

    const validationSchema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
      cancelled_at: Yup.date(),
    });

    if (!(await validationSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    const isRecipient = await Recipient.findByPk(req.body.recipient_id);

    if (!isRecipient) {
      return res.status(400).json({ error: 'Recipient not found.' });
    }

    const isDeliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);

    if (!isDeliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found.' });
    }

    const newParcel = req.body;
    delete newParcel.signature_id;
    delete newParcel.start_date;
    delete newParcel.end_date;

    parcel = await parcel.update(newParcel);

    return res.json(parcel);
  }

  async delete(req, res) {
    const { id } = req.params;

    const parcel = await Parcel.findByPk(id);

    if (!parcel) {
      return res.status(400).json({ error: 'Parcel not found.' });
    }

    parcel.destroy();

    return res.send();
  }
}

export default new ParcelController();
