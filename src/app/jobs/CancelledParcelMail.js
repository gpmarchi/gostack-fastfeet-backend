import Mail from '../../lib/Mail';

class CancelledParcelMail {
  get key() {
    return 'CancelledParcelMail';
  }

  async handle({ data }) {
    const { parcel, problem } = data;

    await Mail.sendMail({
      to: `${parcel.deliveryman.name} <${parcel.deliveryman.email}>`,
      subject:
        '[FastFeet] 🏃️ A entrega de um pacote designado a você foi cancelada 🏃‍♀️️',
      template: 'cancelled-parcel-notification',
      context: {
        deliveryman: parcel.deliveryman.name,
        parcelId: parcel.id,
        product: parcel.product,
        recipient: parcel.recipient.name,
        state: parcel.recipient.state,
        city: parcel.recipient.city,
        problem: problem.description,
      },
    });
  }
}

export default new CancelledParcelMail();
