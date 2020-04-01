import * as Yup from 'yup';

import Queue from '../../lib/Queue';
import CancelledParcelMail from '../jobs/CancelledParcelMail';

import Parcel from '../models/Parcel';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryProblemController {
  async index(req, res) {
    const { page, limit } = req.query;

    const hasPagination = page && limit;

    const total = hasPagination && (await DeliveryProblem.count());
    const totalPages = hasPagination && Math.ceil(total / limit);

    const problems = await DeliveryProblem.findAll({
      order: [['created_at', 'DESC']],
      limit: hasPagination && limit,
      offset: hasPagination && (page - 1) * limit,
      include: [
        {
          model: Parcel,
          as: 'parcel',
          attributes: ['product', 'start_date'],
          include: [
            {
              model: Deliveryman,
              as: 'deliveryman',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return res.json(hasPagination ? { problems, totalPages } : problems);
  }

  async show(req, res) {
    const { parcelId } = req.params;

    const problems = await DeliveryProblem.findAll({
      where: {
        parcel_id: parcelId,
      },
    });

    return res.json(problems);
  }

  async store(req, res) {
    const validationSchema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await validationSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    const { parcelId } = req.params;

    const parcel = await Parcel.findByPk(parcelId);

    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found.' });
    }

    if (!parcel.start_date) {
      return res.status(400).json({ error: 'Parcel not yet withdrawn.' });
    }

    if (parcel.end_date) {
      return res.status(400).json({ error: 'Parcel already delivered.' });
    }

    const problem = await DeliveryProblem.create({
      parcel_id: parcelId,
      description: req.body.description,
    });

    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;

    const problem = await DeliveryProblem.findByPk(id);

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found.' });
    }

    const parcel = await Parcel.findByPk(problem.parcel_id, {
      attributes: ['id', 'product', 'cancelled_at'],
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

    if (parcel.cancelled_at) {
      return res.status(400).json({ error: 'Parcel already cancelled.' });
    }

    if (parcel.end_date) {
      return res.status(400).json({ error: 'Parcel already delivered.' });
    }

    parcel.cancelled_at = new Date();

    await parcel.save();

    await Queue.add(CancelledParcelMail.key, { parcel, problem });

    return res.send();
  }
}

export default new DeliveryProblemController();
