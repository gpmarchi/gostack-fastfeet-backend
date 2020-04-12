import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Parcel from '../models/Parcel';

class PickupController {
  async store(req, res) {
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

    if (pickups.length === 5) {
      return res
        .status(400)
        .json({ error: 'Número máximo de retiradas de encomendas atingido.' });
    }

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

    parcel.start_date = new Date();

    await parcel.save();

    return res.json(parcel);
  }
}

export default new PickupController();
