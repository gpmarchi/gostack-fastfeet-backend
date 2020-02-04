import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(connection) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        number: Sequelize.STRING,
        complement: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        zipcode: Sequelize.STRING,
      },
      { sequelize: connection }
    );

    return this;
  }

  toJSON() {
    const recipient = this.dataValues;

    delete recipient.createdAt;
    delete recipient.updatedAt;

    return recipient;
  }
}

export default Recipient;
