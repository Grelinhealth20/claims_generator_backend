const crypto = require("crypto");

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // must be 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
    if (!text) return null;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

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

function hashValue(text) {
    if (!text) return null;
    return crypto.createHash("sha256").update(text).digest("hex");
}

module.exports = (sequelize, DataTypes) => {
    const ClaimsSubmission = sequelize.define('claims_submission', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        client_id: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 1
        },
        org_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        account_id: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        patient_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            set(value) {
                this.setDataValue("patient_name", encrypt(value));
                this.setDataValue("patient_name_hash", hashValue(value));
            },
            get() {
                const rawValue = this.getDataValue("patient_name");
                return decrypt(rawValue);
            },
        },
        patient_name_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payer_name: {
            type: DataTypes.STRING(200),
            allowNull: false,
            set(value) {
                this.setDataValue("payer_name", encrypt(value));
                this.setDataValue("payer_name_hash", hashValue(value));
            },
            get() {
                const rawValue = this.getDataValue("payer_name");
                return decrypt(rawValue);
            },
        },
        payer_name_hash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        billed_date: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        date_of_service: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: 'pending'
        },
        charged_bills: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        facility_name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        provider_name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        created_by: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: 'Admin'
        },
        modified_by: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: 'Admin'
        }
    },
        {
            tableName: "claims_submission",
            freezeTableName: true,
            timestamps: true, // have Sequelize write timestamps
            createdAt: "created_date", // map names
            updatedAt: "modified_date"

        }
    );
    return ClaimsSubmission;
}