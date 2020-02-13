import Sequelize, { Model } from 'sequelize';

class Deliveryman extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      { sequelize: connection, tableName: 'deliverymen' }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id' });
  }
}

export default Deliveryman;
