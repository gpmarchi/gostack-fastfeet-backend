import Sequelize, { Model } from 'sequelize';

class Parcel extends Model {
  static init(connection) {
    super.init(
      {
        product: Sequelize.STRING,
        cancelled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      { sequelize: connection }
    );

    return this;
  }

  toJSON() {
    const parcel = this.dataValues;

    delete parcel.createdAt;
    delete parcel.updatedAt;

    return parcel;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipient',
    });
    this.belongsTo(models.Deliveryman, {
      foreignKey: 'deliveryman_id',
      as: 'deliveryman',
    });
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signature',
    });
  }
}

export default Parcel;
