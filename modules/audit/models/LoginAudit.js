const mongoose = require("mongoose");

const loginAuditSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["success", "failed", "locked"],
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

loginAuditSchema.index({ email: 1, createdAt: -1 });
loginAuditSchema.index({ user: 1, createdAt: -1 });
loginAuditSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model(
  "LoginAudit",
  loginAuditSchema
);
