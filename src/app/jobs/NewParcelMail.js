import Mail from '../../lib/Mail';

class NewParcelMail {
  get key() {
    return 'NewParcelMail';
  }

  async handle({ data }) {
    const { deliveryman, parcel, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: '[FastFeet] 🏃️ Você tem uma nova encomenda a ser entregue 🏃‍♀️️',
      template: 'new-parcel-notification',
      context: {
        deliveryman: deliveryman.name,
        parcelId: parcel.id,
        product: parcel.product,
        recipient: recipient.name,
        state: recipient.state,
        city: recipient.city,
      },
    });
  }
}

export default new NewParcelMail();
