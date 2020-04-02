import * as Yup from 'yup';
import { Op } from 'sequelize';

import Queue from '../../lib/Queue';
import NewParcelMail from '../jobs/NewParcelMail';
import CancelledParcelMail from '../jobs/CancelledParcelMail';

import Parcel from '../models/Parcel';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

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

    const updatedParcelData = req.body;
    delete updatedParcelData.signature_id;
    delete updatedParcelData.start_date;
    delete updatedParcelData.end_date;
    delete updatedParcelData.cancelled_at;

    const originalParcel = await Parcel.findByPk(id);

    const {
      deliveryman_id: originalDeliverymanId,
      recipient_id: originalRecipientId,
      product: originalProduct,
    } = originalParcel;

    if (!originalParcel) {
      return res.status(404).json({ error: 'Parcel not found.' });
    }

    if (
      originalParcel.cancelled_at ||
      originalParcel.start_date ||
      originalParcel.end_date
    ) {
      return res.status(400).json({
        error: 'Not allowed to update parcel already in delivery process.',
      });
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

    const updatedParcel = await originalParcel.update(updatedParcelData);

    if (originalDeliverymanId !== updatedParcelData.deliveryman_id) {
      await Queue.add(NewParcelMail.key, {
        deliveryman: isDeliveryman,
        parcel: updatedParcel,
        recipient: isRecipient,
      });

      const originalDeliveryman = await Deliveryman.findByPk(
        originalDeliverymanId
      );

      const originalRecipient = await Recipient.findByPk(originalRecipientId);

      await Queue.add(CancelledParcelMail.key, {
        parcel: {
          id: updatedParcel.id,
          product: originalProduct,
          deliveryman: originalDeliveryman,
          recipient: originalRecipient,
        },
        problem: { description: 'Encomenda redirecionada a outro entregador' },
      });
    }

    return res.json(updatedParcel);
  }

  async delete(req, res) {
    const { id } = req.params;

    const parcel = await Parcel.findByPk(id, {
      attributes: ['id', 'product', 'cancelled_at', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'state', 'city'],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!parcel) {
      return res.status(400).json({ error: 'Parcel not found.' });
    }

    if (parcel.cancelled_at || parcel.start_date || parcel.end_date) {
      return res.status(400).json({ error: 'Parcel cannot be deleted.' });
    }

    await Queue.add(CancelledParcelMail.key, {
      parcel,
      problem: { description: 'Encomenda excluída' },
    });

    parcel.destroy();

    return res.send();
  }
}

export default new ParcelController();
