const { get } = require("request");
const logger = require("../config/loggerApi.js");
const { db } = require("../models/index.js");
const { Op, fn, col, literal, Sequelize } = require("sequelize");
const claimsSubmissionModel = db.ClaimsSubmission;
const crypto = require("crypto");

function hashValue(text) {
  if (!text) return null;
  return crypto.createHash("sha256").update(text).digest("hex");
};
function decrypt(text) {
    if (!text) return null;
    if (!text.includes(":")) return text; // plain fallback
    const [ivHex, encryptedText] = text.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

const getAllClaimsSubmissions = async (payload) => {
  try {
    const limit = Number(payload.sizePerPage); // Number of records to return
    const offset = (payload.page - 1) * payload.sizePerPage; // Starting point for the records
    let result = await claimsSubmissionModel.findAll({
      order: [["id", "ASC"]],
      where: {
        client_id: payload.clientId
      },
      attributes: ["id", "client_id", "org_id", "account_id", "patient_name", "payer_name", "provider_name", "facility_name", "billed_date", "date_of_service", "status", "charged_bills", "is_active", "created_by", "modified_by"],
      limit, // Apply pagination limit
      offset, // Apply pagination offset
    });
    const totalCount = await claimsSubmissionModel.count(
      {
        where: {
          client_id: payload.clientId
        },

      }
    );
    const summary = await claimsSubmissionModel.findOne({
      where: {
        client_id: payload.clientId
      },
      attributes: [
        [literal(`SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END)`), "TotalChartsSubmitted"],
        [literal(`SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END)`), "TotalChartsPending"],
        [literal(`SUM(CASE WHEN status = 'escalated' THEN 1 ELSE 0 END)`), "TotalChartsEscalated"],
        [literal(`SUM(CASE WHEN status = 'received' THEN 1 ELSE 0 END)`), "TotalChartsReceived"],
        [fn("SUM", col("charged_bills")), "TotalChargesBilled"]
      ],
      raw: true,
    });
    return { result, totalCount, summary };
  } catch (error) {
    logger.error(
      "Error occured in  getAllClaimsSubmissions----> claimsSubmissionRepository",
      error
    );
  }
}


const getClaimsSubmissionById = async (id) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - getClaimsSubmissionById");
    const claimsSubmission = await claimsSubmissionModel.findByPk(id, {
      attributes: ["id", "client_id", "org_id", "account_id", "patient_name", "payer_name", "billed_date", "provider_name", "facility_name", "date_of_service", "status", "charged_bills", "is_active", "created_by", "modified_by"],
    });
    return claimsSubmission;
  } catch (error) {
    logger.error(
      "Error occured in  getClaimsSubmissionById----> claimsSubmissionRepository",
      error
    );
  }
};

const createClaimsSubmission = async (dataSet) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - createClaimsSubmission");
    const claimsSubmission = await claimsSubmissionModel.create(dataSet);
    return claimsSubmission;
  } catch (error) {
    logger.error(
      "Error occured in  createClaimsSubmission----> claimsSubmissionRepository",
      error
    );
  }
};

const updateClaimsSubmission = async (id, dataSet) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - updateClaimsSubmission");
    const totalNoOfUpdatedRecords = await claimsSubmissionModel.update(dataSet, {
      where: { id: id }
    });
    const claimsSubmission = await claimsSubmissionModel.findByPk(id);
    return { claimsSubmission, totalNoOfUpdatedRecords };
  } catch (error) {
    logger.error(
      "Error occured in  updateClaimsSubmission----> claimsSubmissionRepository",
      error
    );
  }
};

const deleteClaimsSubmission = async (id) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - deleteClaimsSubmission");
    const noOfDeletedRecords = await claimsSubmissionModel.destroy({
      where: { id: id },
      returning: true,
      plain: true,
    });
    return noOfDeletedRecords;
  } catch (error) {
    logger.error(
      "Error occured in  deleteClaimsSubmission----> claimsSubmissionRepository",
      error
    );
  }
};

const bulkInsertClaimsSubmissions = async (claimsSubmissions) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - bulkInsertClaimsSubmissions");
    const noOfInsertedRecords = await claimsSubmissionModel.bulkCreate(claimsSubmissions);
    if (noOfInsertedRecords.length > 0) {
      return noOfInsertedRecords.length;
    }
    else {
      return 0;
    }
  } catch (error) {
    logger.error(
      "Error occured in  bulkInsertClaimsSubmissions----> claimsSubmissionRepository",
      error
    );
  }
};

const getAllPayerNames = async (id) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - getAllPayerName");
    const payerName = await claimsSubmissionModel.findAll({
     attributes: [
        [fn("DISTINCT", col("payer_name_hash")), "uniquePayerName"],
      ],
      where:{
        client_id: id
      },
      raw:true
    });
    const finalPayerNames = [];

for (const row of payerName){
  const record = await claimsSubmissionModel.findOne({
    where: {
      payer_name_hash: row.uniquePayerName,
      client_id: id
    }
  });

  
  finalPayerNames.push({
    payerName: decrypt(record.payer_name)
  });
}


    return finalPayerNames.map(item => item.payerName);
  } catch (error) {
    logger.error(
      "Error occured in  getAllPayerName----> claimsSubmissionRepository",
      error
    );
  }
};

const getAllPatientNames = async (id) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - getAllPatientNames");
    const patientNames = await claimsSubmissionModel.findAll({
     attributes: [
        [fn("DISTINCT", col("patient_name_hash")),"uniquePatientName"],
      ],
      where:{
        client_id: id
      },
      raw:true
    });
    const finalPatientNames = [];

for (const row of patientNames){
  const record = await claimsSubmissionModel.findOne({
    where: {
      patient_name_hash: row.uniquePatientName,
      client_id: id
    }
  });

  finalPatientNames.push({
    patientName: decrypt(record.patient_name)
  });
}
    return finalPatientNames.map(item => item.patientName);
  } catch (error) {
    logger.error(
      "Error occured in  getAllPatientNames----> claimsSubmissionRepository",
      error
    );
  }
};

const getFilteredClaimsSubmissions = async (filters) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - getFilteredClaimsSubmissions");
    const limit = Number(filters.sizePerPage); // Number of records to return
    const offset = (filters.page - 1) * filters.sizePerPage;

    let whereClause = {};
    whereClause[Op.and] = [];
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.patientName) {
      whereClause.patient_name_hash = hashValue(filters.patientName).trim();
    }
    if (filters.payerName) {
      whereClause.payer_name_hash = hashValue(filters.payerName).trim();
    }
    if (filters.billedDate) {
      whereClause[Op.and].push(
        Sequelize.where(
          Sequelize.fn("DATE", Sequelize.col("billed_date")),
          filters.billedDate
        )
      );
    }
    if (filters.facilityName) {
      whereClause.facility_name = filters.facilityName;
    }
    if (filters.providerName) {
      whereClause.provider_name = filters.providerName;
    }
    if (filters.dateOfService) {
      whereClause.date_of_service = filters.dateOfService;
    }
    if (filters.clientId) {
      whereClause.client_id = filters.clientId;
    }
    const claimsSubmissions = await claimsSubmissionModel.findAll({
      where: whereClause,
      attributes: ["id", "client_id", "org_id", "account_id", "patient_name", "payer_name", "billed_date", "date_of_service", "provider_name", "facility_name", "status", "charged_bills", "is_active", "created_by", "modified_by"],
      order: [["id", "ASC"]],
      limit, // Apply pagination limit
      offset // Apply pagination offset
    });
    const totalCount = await claimsSubmissionModel.count({
      where: whereClause
    });

    return { result: claimsSubmissions, totalCount };
  } catch (error) {
    logger.error(
      "Error occured in  getFilteredClaimsSubmissions----> claimsSubmissionRepository",
      error
    );
  }
};

const getAllFacilityNames = async (id) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - getAllFacilityNames");
    const facilityNames = await claimsSubmissionModel.findAll({
      attributes: [
        [fn("DISTINCT", col("facility_name")), "uniqueFacilityName"],
      ],
      where:{client_id: id }
    });
    return facilityNames.map(item => item.dataValues.uniqueFacilityName);
  } catch (error) {
    logger.error(
      "Error occured in  getAllFacilityNames----> claimsSubmissionRepository",
      error
    );
  }
};

const getAllProviderNames = async (id) => {
  try {
    logger.info("Enter in claimsSubmissionRepository - getAllProviderNames");
    const providerNames = await claimsSubmissionModel.findAll({
     attributes: [
        [fn("DISTINCT", col("provider_name")), "uniqueProviderName"],
      ],
      where:{ client_id: id }
    });
    return providerNames.map(item => item.dataValues.uniqueProviderName)
  } catch (error) {
    logger.error(
      "Error occured in  getAllProviderNames----> claimsSubmissionRepository",
      error
    );
  }
};
module.exports = {
  getAllClaimsSubmissions,
  getClaimsSubmissionById,
  createClaimsSubmission,
  updateClaimsSubmission,
  deleteClaimsSubmission,
  bulkInsertClaimsSubmissions,
  getAllPayerNames,
  getAllPatientNames,
  getFilteredClaimsSubmissions,
  getAllFacilityNames,
  getAllProviderNames
};                         