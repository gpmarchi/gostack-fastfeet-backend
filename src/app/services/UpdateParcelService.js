import Parcel from '../models/Parcel';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import Queue from '../../lib/Queue';
import NewParcelMail from '../jobs/NewParcelMail';
import CancelledParcelMail from '../jobs/CancelledParcelMail';

class UpdateParcelService {
  async run({ parcel_id, updatedParcelData }) {
    const originalParcel = await Parcel.findByPk(parcel_id);

    /**
     * Check if parcel exists
     */
    if (!originalParcel) {
      throw Error('Encomenda não encontrada.');
    }

    /**
     * Check if parcel is already in delivery process
     */
    if (
      originalParcel.cancelled_at ||
      originalParcel.start_date ||
      originalParcel.end_date
    ) {
      throw Error(
        'Atualização não permitida, encomenda já está em processo de entrega'
      );
    }

    const isRecipient = await Recipient.findByPk(
      updatedParcelData.recipient_id
    );

    /**
     * Check if recipient exists
     */
    if (!isRecipient) {
      throw Error('Destinatário não encontrado.');
    }

    const isDeliveryman = await Deliveryman.findByPk(
      updatedParcelData.deliveryman_id
    );

    /**
     * Check if deliveryman exists
     */
    if (!isDeliveryman) {
      throw Error('Entregador não encontrado.');
    }

    /**
     * Enforce these fields won't be updated at this moment
     */
    delete updatedParcelData.signature_id;
    delete updatedParcelData.start_date;
    delete updatedParcelData.end_date;
    delete updatedParcelData.cancelled_at;

    const updatedParcel = await originalParcel.update(updatedParcelData);

    const {
      deliveryman_id: originalDeliverymanId,
      recipient_id: originalRecipientId,
      product: originalProduct,
    } = originalParcel;

    /**
     * If changing the deliveryman send cancelation message to old one and new
     * parcel message to new one
     */
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

    return updatedParcel;
  }
}

export default new UpdateParcelService();
