const Express = require("express");
const model = require("../../models/index");
const ErrorBase = require("../../errors/ErrorBase");
const moment = require("moment");

const TimeSheetController = Express.Router();

const checkInTimeSheetController = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const latestTimeSheet = await model.TimeSheet.findOne({
      where: {
        userId,
      },
      order: [
        ["updatedAt", "DESC"],
        ["createdAt", "DESC"],
      ],
    });

    if (latestTimeSheet && latestTimeSheet.dataValues.status === "check in") {
      const error = new ErrorBase("unable to checkin", 400, 400);
      throw error;
    }

    const newTimeSheet = await model.TimeSheet.create({
      userId,
      checkIn: new Date(),
      status: "check in",
    });

    await newTimeSheet.save();



    return res.status(201).send({
      message: "check in successfullly"
    });
  } catch (err) {
    return next(err);
  }
};

const checkOutTimeSheetController = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const latestTimeSheet = await model.TimeSheet.findOne({
      where: {
        userId,
      },
      order: [
        ["updatedAt", "DESC"],
        ["createdAt", "DESC"],
        ["checkIn", "DESC"]
      ],
    });


    if (latestTimeSheet && latestTimeSheet.dataValues.status === "check out") {
      const error = new ErrorBase("unable to checkout", 400, 400);
      throw error;
    }

    latestTimeSheet.update({
      checkOut: new Date(),
      status: "check out",
    })

    await latestTimeSheet.save();

    return res.status(201).send({
      message: "check Out successfullly",
    });

  } catch (err) {
    return next(err);
  }
};

const getTimeSheetController = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await model.User.findByPk(userId);
    if (!user) {
      const error = new ErrorBase(`userId of ${userId} not found`, 400, 400);
      throw error;
    }

    const userTimeSheet = await model.TimeSheet.findAll({
      where: {
        userId,
      },
      order: [
        ["checkOut", "DESC"],
        ["checkIn", "DESC"]
      ]
    });



    const formatedData = userTimeSheet.map((data) => {
      return {
        checkIn: data.checkIn ? moment(data.checkIn).format("h:mm:A") : "-",
        checkOut: data.checkOut ? moment(data.checkOut).format("h:mm:A") : "-",
      };
    });


    return res.status(200).send(formatedData);
  } catch (err) {
    return next(err);
  }
};

TimeSheetController.post("/checkIn", checkInTimeSheetController);
TimeSheetController.post("/checkOut",checkOutTimeSheetController);
TimeSheetController.get("/:userId", getTimeSheetController);

module.exports = TimeSheetController;
