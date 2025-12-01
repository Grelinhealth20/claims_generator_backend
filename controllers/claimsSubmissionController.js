const claimsSubmissionService = require('../services/claimsSubmissionService');
const logger = require('../config/loggerApi.js');
const { generateUniqueFilename } = require("../constant.js");
const readXlsxFile = require("read-excel-file/node");
const multer = require("multer");
const path = require("path");

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        const allowedExt = /\.xlsx$/i; // only .xlsx extension
        const allowedMime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        const extMatch = allowedExt.test(path.extname(file.originalname));
        const mimeMatch = file.mimetype === allowedMime;

        if (extMatch && mimeMatch) {
            cb(null, true); // ✅ accept file
        } else {
            cb(new Error("Only .xlsx files are allowed!")); // ❌ reject file
        }
    },
});

const getAllClaimsSubmissions = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - getAllClaimsSubmissions");
        const payload = req.query.payload;
        const claimsSubmissions = await claimsSubmissionService.getAllClaimsSubmissions(payload);
        if (claimsSubmissions.result != null && claimsSubmissions.totalCount != null) {
            return res.status(200).json({
                message: "Claims Submissions retrieved successfully",
                claimsSubmissions,
            });
        } else {
            return res.status(400).json({
                message: "Claims Submissions not retrieved successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - getAllClaimsSubmissions", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - getAllClaimsSubmissions" });
    }
};

const getClaimsSubmissionById = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - getClaimsSubmissionById");
        const id = req.params.id;
        const claimsSubmission = await claimsSubmissionService.getClaimsSubmissionById(id);
        if (claimsSubmission.dataValues != null) {
            return res.status(200).json({
                message: "Claims Submission retrieved successfully",
                claimsSubmission,
            });
        } else {
            return res.status(400).json({
                message: "Claims Submission not retrieved successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - getClaimsSubmissionById", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - getClaimsSubmissionById" });
    }
};
const createClaimsSubmission = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - createClaimsSubmission");
        const claimsSubmissionData = req.body;
        const newClaimsSubmission = await claimsSubmissionService.createClaimsSubmission(claimsSubmissionData);
        if (newClaimsSubmission != null) {
            return res.status(200).json({
                message: "Claims Submission created successfully",
                newClaimsSubmission,
            });
        } else {
            return res.status(400).json({
                message: "Claims Submission not created successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - createClaimsSubmission", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - createClaimsSubmission" });
    }
};

const updateClaimsSubmission = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - updateClaimsSubmission");
        const id = req.query.id;
        const claimsSubmissionData = req.body;
        const updatedClaimsSubmission = await claimsSubmissionService.updateClaimsSubmission(id, claimsSubmissionData);
        if (updatedClaimsSubmission.claimsSubmission !== null && updatedClaimsSubmission.totalNoOfUpdatedRecords[0] !== 0) {
            return res.status(200).json({
                message: "Claims Submission updated successfully",
                updatedClaimsSubmission,
            });
        } else {
            return res.status(400).json({
                message: "Claims Submission not updated successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - updateClaimsSubmission", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - updateClaimsSubmission" });
    }

};
const deleteClaimsSubmission = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - deleteClaimsSubmission");
        const id = req.params.id;
        const noOfDeletedRecords = await claimsSubmissionService.deleteClaimsSubmission(id);
        if (noOfDeletedRecords) {
            return res.status(200).json({
                message: "Claims Submission deleted successfully",
                noOfDeletedRecords,
            });
        } else {
            return res.status(400).json({
                message: "Claims Submission not deleted successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - deleteClaimsSubmission", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - deleteClaimsSubmission" });
    }
};

const uploadFile = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - uploadFile");
        // let token = req.headers["authorization"];
        // if (token && token.startsWith("Bearer ")) {
        //   token = token.slice(7); // removes "Bearer " (including the space)
        // }
        // let decodeValue = await jwtDecodeService.deocdeJwtToken(token);
        let decodeValue = {
            orgId: 1,
            username: "admin",
        };
        const file = req.file;
        if (!file) return res.status(400).json({ message: "No file uploaded" });
        const extract = await extractData(req, res);
        const result = await claimsSubmissionService.uploadFile(extract, decodeValue, res);
        if (result) {
            return res.status(200).json({
                message: "File processed successfully",
                noOfInsertedRecords: result,
            });
        } else {
            return res.status(400).json({
                message: "File not processed successfully",
            });
        }
    } catch (error) {
        console.error("Error extracting text:", error);
        res.status(500).json({ message: "Failed to extract text from file" });
    }
};
const extractData = async (req, res) => {
    try {
        const reqId = generateUniqueFilename();

        const parseXlsxFile = async (buffer) => {
            const rows = await readXlsxFile(buffer);
            const headers = rows[0];
            rows.shift();

            return rows.map((row) => {
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = row[index];
                });
                obj.file_name = req.file.originalname;
                obj.file_id = reqId;
                return obj;
            });
        };

        const parseCsvFile = async (buffer) => {
            const csv = buffer.toString('utf-8');
            const [headerLine, ...lines] = csv.split('\n').map(line => line.trim()).filter(Boolean);
            const headers = headerLine.split(',');

            return lines.map(line => {
                const values = line.split(',');
                const obj = {};
                headers.forEach((header, index) => {
                    obj[header] = values[index];
                });
                obj.file_name = req.file.originalname;
                obj.file_id = reqId;
                return obj;
            });
        };

        let claimsSubmissionArr = [];
        const { mimetype, buffer } = req.file;

        if (mimetype === 'text/csv') {
            claimsSubmissionArr = await parseCsvFile(buffer);
        } else {
            claimsSubmissionArr = await parseXlsxFile(buffer);
        }

        console.log(claimsSubmissionArr);
        return claimsSubmissionArr;
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

const getAllPayerNames = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - getAllPayerName");
    const id = req.query.clientId;
        const payerName = await claimsSubmissionService.getAllPayerNames(id);
        if (payerName.length > 0) {
            return res.status(200).json({
                message: "Payer Name retrieved successfully",
                payerName,
            });
        } else {
            return res.status(400).json({
                message: "Payer Name not retrieved successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - getAllPayerName", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - getAllPayerName" });
    }
};

const getAllPatientNames = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - getAllPatientNames");
        const id = req.query.clientId;
        const patientNames = await claimsSubmissionService.getAllPatientNames(id);
        if (patientNames.length > 0) {
            return res.status(200).json({
                message: "Patient Names retrieved successfully",
                patientNames,
            });
        } else {
            return res.status(400).json({
                message: "Patient Names not retrieved successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - getAllPatientNames", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - getAllPatientNames" });
    }
};

const getFilteredClaimsSubmissions = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - getFilteredClaimsSubmissions");
        const payload = req.query.payload;
        const claimsSubmissions = await claimsSubmissionService.getFilteredClaimsSubmissions(payload);
        if (claimsSubmissions.result != null && claimsSubmissions.totalCount != null) {
            return res.status(200).json({
                message: "Claims Submissions retrieved successfully",
                claimsSubmissions,
            });
        } else {
            return res.status(400).json({
                message: "Claims Submissions not retrieved successfully",
            });
        }
    } catch (error) {
        logger.error("Error in claimsSubmissionController - getFilteredClaimsSubmissions", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - getFilteredClaimsSubmissions" });
    }
};
const getAllFacilityNames = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - getAllFacilityNames");
        const id = req.query.clientId;
        const facilityNames = await claimsSubmissionService.getAllFacilityNames(id);
        if (facilityNames.length > 0) {
            return res.status(200).json({
                message: "Facility Names retrieved successfully",
                facilityNames,
            });
        }
        else {
            return res.status(400).json({
                message: "Facility Names not retrieved successfully",
            });
        }
    }
    catch (error) {
        logger.error("Error in claimsSubmissionController - getAllFacilityNames", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - getAllFacilityNames" });
    }
};

const getAllProviderNames = async (req, res) => {
    try {
        logger.info("Enter in claimsSubmissionController - getAllProviderNames");
        const id = req.query.clientId;
        const providerNames = await claimsSubmissionService.getAllProviderNames(id);
        if (providerNames.length > 0) {
            return res.status(200).json({
                message: "Provider Names retrieved successfully",
                providerNames,
            });
        }
        else {
            return res.status(400).json({
                message: "Provider Names not retrieved successfully",
            });
        }
    }
    catch (error) {
        logger.error("Error in claimsSubmissionController - getAllProviderNames", error);
        res.status(500).json({ message: "Error in claimsSubmissionController - getAllProviderNames" });
    }
};
module.exports = {
    getAllClaimsSubmissions,
    getClaimsSubmissionById,
    createClaimsSubmission,
    updateClaimsSubmission,
    deleteClaimsSubmission,
    uploadFile,
    extractData,
    upload,
    getAllPayerNames,
    getAllPatientNames,
    getFilteredClaimsSubmissions,
    getAllFacilityNames,
    getAllProviderNames
};
