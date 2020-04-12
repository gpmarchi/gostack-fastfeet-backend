import Parcel from '../models/Parcel';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import Queue from '../../lib/Queue';
import CancelledParcelMail from '../jobs/CancelledParcelMail';

class DeleteParcelService {
  async run({ parcel_id }) {
    const parcel = await Parcel.findByPk(parcel_id, {
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

    /**
     * Check if parcel exists
     */
    if (!parcel) {
      throw Error('Encomenda não encontrada.');
    }

    /**
     * Check if parcel is in delivery process
     */
    if (parcel.cancelled_at || parcel.start_date || parcel.end_date) {
      throw Error('Encomenda não pode ser excluída.');
    }

    /**
     * Send notification e-mail to deliveryman
     */
    await Queue.add(CancelledParcelMail.key, {
      parcel,
      problem: { description: 'Encomenda excluída' },
    });

    parcel.destroy();
  }
}

export default new DeleteParcelService();
