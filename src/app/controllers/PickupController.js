import * as Yup from 'yup';
import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Parcel from '../models/Parcel';

class PickupController {
  async store(req, res) {
    const validationSchema = Yup.object().shape({
      id: Yup.number().required(),
      parcelId: Yup.number().required(),
    });

    if (!(await validationSchema.isValid(req.params))) {
      return res.status(400).json({ error: 'Field validation failed.' });
    }

    const { id, parcelId } = req.params;

    const pickups = await Parcel.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
        deliveryman_id: id,
      },
      attributes: ['id'],
    });

    if (pickups.length >= 5) {
      return res
        .status(400)
        .json({ error: 'Maximum number of parcel pickups reached.' });
    }

    const parcel = await Parcel.findOne({
      where: {
        id: parcelId,
        deliveryman_id: id,
      },
    });

    if (!parcel) {
      return res.status(400).json({ error: 'Parcel not found.' });
    }

    parcel.start_date = new Date();

    await parcel.save();

    return res.json(parcel);
  }
}

export default new PickupController();
