module.exports = (sequelize, Sequelize) => {
    const Subscription = sequelize.define("subscription", {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      username: {
        type: Sequelize.INTEGER 
      },
      expire_at: {
        type: Sequelize.BIGINT
      },
      last_memo: {
        type: Sequelize.STRING
      },
      tx_hash: {
        type: Sequelize.STRING
      }
    });
  
    return Subscription;
  };