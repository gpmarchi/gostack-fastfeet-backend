import * as Yup from 'yup';
import { QueryTypes } from 'sequelize';

import Queue from '../../lib/Queue';
import CancelledParcelMail from '../jobs/CancelledParcelMail';

import Parcel from '../models/Parcel';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const problems = await DeliveryProblem.sequelize.query(
      'SELECT DISTINCT("DeliveryProblem"."parcel_id") AS "parcel_id", "parcel"."product" AS "parcel.product","parcel"."start_date" AS "parcel.start_date","parcel->deliveryman"."id" AS "parcel.deliveryman.id","parcel->deliveryman"."name" AS "parcel.deliveryman.name" FROM "delivery_problems" AS "DeliveryProblem" LEFT OUTER JOIN "parcels" AS "parcel" ON "DeliveryProblem"."parcel_id" = "parcel"."id" LEFT OUTER JOIN "deliverymen" AS "parcel->deliveryman" ON "parcel"."deliveryman_id" = "parcel->deliveryman"."id" ORDER BY "parcel"."start_date" ASC LIMIT :limit OFFSET :offset',
      {
        replacements: { limit: 20, offset: (page - 1) * 20 },
        type: QueryTypes.SELECT,
      }
    );

    // const problems = await DeliveryProblem.findAll({
    //   limit: 20,
    //   offset: (page - 1) * 20,
    //   attributes: [[fn('DISTINCT', col('parcel_id')), 'parcel_id'], 'id'],
    //   include: [
    //     {
    //       model: Parcel,
    //       as: 'parcel',
    //       attributes: ['product', 'start_date'],
    //       include: [
    //         {
    //           model: Deliveryman,
    //           as: 'deliveryman',
    //           attributes: ['name'],
    //         },
    //       ],
    //     },
    //   ],
    // });

    return res.json(problems);
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
