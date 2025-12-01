module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    "patient",
    {
      id: {
        type: DataTypes.INTEGER,
        alloeNull: false,
        primaryKey: true,
        autoIncrement: true,
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
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM("M", "F", "U"),
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
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
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
      tableName: "cms_patient",
      freezeTableName: true,
      timestamps: true, // have Sequelize write timestamps
      createdAt: "created_date", // map names
      updatedAt: "modified_date",
    }
  );

  return Patient;
};
