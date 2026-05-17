const LoginAudit = require("../models/LoginAudit");

const getLoginAudits = async (req, res) => {
  try {
    const {
      email,
      status,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (email) {
      query.email = {
        $regex: email,
        $options: "i",
      };
    }

    if (status) {
      query.status = status;
    }

    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.min(
      Math.max(Number(limit), 1),
      100
    );
    const skip = (pageNumber - 1) * pageSize;

    const [audits, total] = await Promise.all([
      LoginAudit.find(query)
        .populate("user", "name email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      LoginAudit.countDocuments(query),
    ]);

    res.status(200).json({
      audits,
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getMyLoginAudits = async (req, res) => {
  try {
    const audits = await LoginAudit.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(audits);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getLoginAudits,
  getMyLoginAudits,
};
