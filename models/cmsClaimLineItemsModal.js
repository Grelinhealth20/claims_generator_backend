module.exports = (sequelize, DataTypes) => {
  const ClaimLineItem = sequelize.define(
    "claim_line_item",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      claim_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rendering_provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      service_from: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      service_to: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      place_of_service: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emg: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      cpt_hcpcs: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modifier1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modifier2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      modifier3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      modifier4: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      diagnosis_pointer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      charge_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      units: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "cms_claim_line_items",
      freezeTableName: true,
      timestamps: true, // have Sequelize write timestamps
      createdAt: "created_date", // map names
      updatedAt: "modified_date",
    }
  );

  return ClaimLineItem;
};
