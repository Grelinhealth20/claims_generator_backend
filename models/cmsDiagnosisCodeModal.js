module.exports = (sequelize, DataTypes) => {
  const DiagnosisCode = sequelize.define('diagnosis_code', {
    id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    claim_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false
    },
    position:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description:{
        type: DataTypes.TEXT,
        allowNull: true
    }
  },
  {
    tableName: "cms_diagnosis_code",
    freezeTableName: true,
    timestamps: true, // have Sequelize write timestamps
    createdAt: "created_date", // map names
    updatedAt: "modified_date"
  }
);

  return DiagnosisCode;
};
