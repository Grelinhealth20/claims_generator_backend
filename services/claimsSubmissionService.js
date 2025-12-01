const { get } = require('request');
const logger = require('../config/loggerApi');
const claimsSubmissionRepository = require('../repository/claimsSubmissionRepository');
const moment = require('moment');
const getAllClaimsSubmissions = async (payload) => {
    try {
        logger.info("Enter in claimsSubmissionService - getAllClaimsSubmissions");
        let data = atob(payload);
        let dataValue = JSON.parse(data);
        const claimsSubmissions = await claimsSubmissionRepository.getAllClaimsSubmissions(dataValue);
        return claimsSubmissions;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - getAllClaimsSubmissions", error);
        logger.error("Error occures in claimsSubmissionService - getAllClaimsSubmissions:", error);
        return null;
    }
};
const getClaimsSubmissionById = async (id) => {
    try {
        logger.info("Enter in claimsSubmissionService - getClaimsSubmissionById");
        const claimsSubmission = await claimsSubmissionRepository.getClaimsSubmissionById(id);
        return claimsSubmission;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - getClaimsSubmissionById", error);
        logger.error("Error occures in claimsSubmissionService - getClaimsSubmissionById", error);
        return null;
    }
};
const createClaimsSubmission = async (dataValue) => {
    try {
        logger.info("Enter in claimsSubmissionService - createClaimsSubmission");

        const dataSet = {
            org_id: dataValue.orgId,
            client_id: dataValue.clientId,
            account_id: dataValue.accountId,
            patient_name: dataValue.patientName,
            payer_name: dataValue.payerName,
            provider_name: dataValue.providerName,
            facility_name: dataValue.facilityName,
            billed_date: moment(dataValue?.billedDate).format("YYYY-MM-DD  HH:mm:ss"),
            date_of_service: moment(dataValue?.dateOfService).format("YYYY-MM-DD"),
            status: dataValue.status,
            charged_bills: dataValue.chargedBills,
            is_active: dataValue.isActive,
            created_by: dataValue?.createdBy || "admin",
            modified_by: dataValue?.modifiedBy || "admin"
        }
        const claimsSubmission = await claimsSubmissionRepository.createClaimsSubmission(dataSet);
        return claimsSubmission;


    } catch (error) {
        console.error("Error occures in claimsSubmissionService - createClaimsSubmission", error);
        logger.error("Error occures in claimsSubmissionService - createClaimsSubmission", error);
        return null;
    }
};
const updateClaimsSubmission = async (id, dataValue) => {
    try {
        logger.info("Enter in claimsSubmissionService - updateClaimsSubmission");
        const dataSet = {
            org_id: dataValue.orgId,
            client_id: dataValue.clientId,
            account_id: dataValue.accountId,
            patient_name: dataValue.patientName,
            payer_name: dataValue.payerName,
            provider_name: dataValue.providerName,
            facility_name: dataValue.facilityName,
            billed_date: dataValue.billedDate,
            date_of_service: dataValue.dateOfService,
            status: dataValue.status,
            charged_bills: dataValue.chargedBills,
            is_active: dataValue.isActive,
            created_by: dataValue?.createdBy || "admin",
            modified_by: dataValue?.modifiedBy || "admin"
        }
        const claimsSubmission = await claimsSubmissionRepository.updateClaimsSubmission(id, dataSet);
        return claimsSubmission;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - updateClaimsSubmission", error);
        logger.error("Error occures in claimsSubmissionService - updateClaimsSubmission", error);
        return null;
    }
};
const deleteClaimsSubmission = async (id) => {
    try {
        logger.info("Enter in claimsSubmissionService - deleteClaimsSubmission");
        const claimsSubmission = await claimsSubmissionRepository.deleteClaimsSubmission(id);
        return claimsSubmission;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - deleteClaimsSubmission", error);
        logger.error("Error occures in claimsSubmissionService - deleteClaimsSubmission", error);
        return null;
    }
};
const uploadFile = async (arr, decoded, res) => {
    try {
        logger.info("Enter in claimsSubmissionService - uploadFile");
        let claimsSubmissions = await mapClaimsSubmissions(arr, decoded);
        let claimsSubmissionsResults = await claimsSubmissionRepository.bulkInsertClaimsSubmissions(claimsSubmissions);
        return claimsSubmissionsResults;

    } catch (error) {
        console.error("Error extracting text:", error);
        res.status(500).json({ message: "Failed to extract text from file" });
    }
};
const mapClaimsSubmissions = async (claimsSubmission, decoded) => {
    try {
        const records = await Promise.all(
            claimsSubmission.map(async (details) => {
                const claimsSubmissionArr = {

                    org_id: decoded?.orgId || 1,
                    client_id: details['client id'],
                    account_id: details['account id'],
                    patient_name: details['patient name'],
                    payer_name: details['payer name'],
                    billed_date: details['billed date'],
                    facility_name: details['facility name'],
                    provider_name: details['provider name'],
                    date_of_service: details['date of service'],
                    status: details['status'],
                    charged_bills: details['charged bills'],
                    is_active: details['is_active'] || true,
                    created_by: details?.createdBy || "admin",
                    modified_by: details?.modifiedBy || "admin"
                };
                // Optional: simulate async work
                await Promise.resolve(); // or call another async function here
                return claimsSubmissionArr;
            })
        );
        return records;
    } catch (error) {
        logger.error("Error occured in claimsSubmissionService - mapClaimsSubmissions", error);
    }
};

const getAllPayerNames = async (id) => {
    try {
        logger.info("Enter in claimsSubmissionService - getAllPayerName");
        const payerName = await claimsSubmissionRepository.getAllPayerNames(id);
        
        return payerName;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - getAllPayerName", error);
        logger.error("Error occures in claimsSubmissionService - getAllPayerName", error);
        return null;
    }
};

const getAllPatientNames = async (id) => {
    try {
        logger.info("Enter in claimsSubmissionService - getAllPatientNames");
        const patientNames = await claimsSubmissionRepository.getAllPatientNames(id);
        return patientNames;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - getAllPatientNames", error);
        logger.error("Error occures in claimsSubmissionService - getAllPatientNames", error);
        return null;
    }
};

const getFilteredClaimsSubmissions = async (payload) => {
    try {
        logger.info("Enter in claimsSubmissionService - getFilteredClaimsSubmissions");
        const data = atob(payload);
        const dataValue = JSON.parse(data);
        const claimsSubmissions = await claimsSubmissionRepository.getFilteredClaimsSubmissions(dataValue);
        return claimsSubmissions;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - getFilteredClaimsSubmissions", error);
        logger.error("Error occures in claimsSubmissionService - getFilteredClaimsSubmissions", error);
        return null;
    }
};

const getAllFacilityNames = async (id) => {
    try {
        logger.info("Enter in claimsSubmissionService - getAllFacilityNames");
        const facilityNames = await claimsSubmissionRepository.getAllFacilityNames(id);
        return facilityNames;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - getAllFacilityNames", error);
        logger.error("Error occures in claimsSubmissionService - getAllFacilityNames", error);
        return null;
    }
};

const getAllProviderNames = async (id) => {
    try {
        logger.info("Enter in claimsSubmissionService - getAllProviderNames");
        const providerNames = await claimsSubmissionRepository.getAllProviderNames(id);
        return providerNames;
    } catch (error) {
        console.error("Error occures in claimsSubmissionService - getAllProviderNames", error);
        logger.error("Error occures in claimsSubmissionService - getAllProviderNames", error);
        return null;
    }
};  
module.exports = {
    getAllClaimsSubmissions,
    getClaimsSubmissionById,
    createClaimsSubmission,
    updateClaimsSubmission,
    deleteClaimsSubmission,
    uploadFile,
    getAllPayerNames,
    getAllPatientNames,
    getFilteredClaimsSubmissions,
    getAllFacilityNames,
    getAllProviderNames
};