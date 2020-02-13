import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(connection) {
    super.init(
      {
        original_name: Sequelize.STRING,
        filename: Sequelize.STRING,
      },
      { sequelize: connection }
    );

    return this;
  }
}

export default File;
