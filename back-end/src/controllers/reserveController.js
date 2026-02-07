
const reserveModel = require("../models/reserveModel");
const { buildErrorLog } = require("../utils/utils");

exports.reserveCharger = async (req, res) => {
    try {
      const pointId = parseInt(req.params.id);
      let minutes = parseInt(req.params.minutes);
  
      if (isNaN(pointId)) {
        return res.status(400).json(
          buildErrorLog(req, 400, "Invalid point id")
        );
      }
  
      // default minutes = 30
      if (isNaN(minutes)) {
        minutes = 30;
      }
  
      // max 2 hours
      minutes = Math.min(minutes, 120);
  
      const result = await reserveModel.reservePoint(pointId, minutes, 1);
  
      return res.status(200).json(result);
  
    } catch (err) {
      return res.status(400).json(
        buildErrorLog(req, 400, err.message, "Reservation failed")
      );
    }
  };