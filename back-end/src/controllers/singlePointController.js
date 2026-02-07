const { buildErrorLog } = require("../utils");
const singlePointModel = require("../models/singlePointModel");

exports.singlePoint = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json(
        buildErrorLog(req, 400, "Invalid point id.", "Point id must be a positive integer.")
      );
    }

    const point = await singlePointModel.getSinglePointById(id);

    if (!point) {
      return res.status(204).send();
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(point);
  } catch (err) {
    return res.status(400).json(
      buildErrorLog(req, 400, err.message, "Go look at the Database")
    );
  }
};
