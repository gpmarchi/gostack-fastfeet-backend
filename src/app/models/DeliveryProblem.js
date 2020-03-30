import Sequelize, { Model } from 'sequelize';

class DeliveryProblem extends Model {
  static init(connection) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      { sequelize: connection }
    );

    return this;
  }

  toJSON() {
    const deliveryProblem = this.dataValues;

    delete deliveryProblem.updatedAt;

    return deliveryProblem;
  }

  static associate(models) {
    this.belongsTo(models.Parcel, {
      foreignKey: 'parcel_id',
      as: 'parcel',
    });
  }
}

export default DeliveryProblem;
