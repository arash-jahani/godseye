module.exports = (sequelize, Sequelize) => {
    const Subscription = sequelize.define("subscription", {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      phone: {
        type: Sequelize.STRING,
        defaultValue: ""
        // allowNull: false,
        // unique: true
      },
      chat_id: {
        type: Sequelize.BIGINT,
        defaultValue: 0 
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: "" 
      },
      username: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      expire_at: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      last_memo: {
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      tx_hash: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      transaction_passed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      invited_code: { // user invited by this code
        type: Sequelize.BIGINT,
        defaultValue: 0 
      },
      referral_code: { //user referral program code
        type: Sequelize.BIGINT,
        defaultValue: 0 
      },
      refferal_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0 
      },
      amount: { 
        type: Sequelize.INTEGER,
        defaultValue: 0 
      },
      wallet_address: { 
        type: Sequelize.STRING,
        defaultValue: "" 
      },
      wallet_qr: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
    });
  
    return Subscription;
  };