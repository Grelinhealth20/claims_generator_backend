module.exports = (sequelize, DataTypes) => {
  const InsuredPerson = sequelize.define(
    "insured_person",
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
      insured_id_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      relationship: {
        type: DataTypes.ENUM("self", "spouse", "child", "other"),
        allowNull: false,
      },
      address_line1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address_line2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zip: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      policy_group_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plan_or_program_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      another_plan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Admin",
      },
      modified_by: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Admin",
      },
    },
    {
      tableName: "cms_insured_person",
      freezeTableName: true,
      timestamps: true, // have Sequelize write timestamps
      createdAt: "created_date", // map names
      updatedAt: "modified_date",
    }
  );

  return InsuredPerson;
};
