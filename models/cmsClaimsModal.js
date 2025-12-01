module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define(
    "claim",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      insured_person_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      referring_provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      billing_provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      service_facility_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      insurance_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      claim_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      patient_condition_employment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      patient_condition_auto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      auto_accident_state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      other_accident: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      date_of_current_illness: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      date_of_illness_onset: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      additional_claim_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      original_ref_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total_charge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      balance_due: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      signed_by_patient: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      signed_by_provider: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "cms_claims",
      freezeTableName: true,
      timestamps: true, // have Sequelize write timestamps
      createdAt: "created_date", // map names
      updatedAt: "modified_date",
    }
  );

  return Claim;
};
