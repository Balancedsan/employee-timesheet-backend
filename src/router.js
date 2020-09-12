const Express = require("express");
const UserController = require("./controllers/UserController/UserController");
const TimeSheetController = require("./controllers/TimeSheetController/TimeSheetController");
const router = Express.Router();


router.use("/users",UserController);
router.use("/timesheet",TimeSheetController);


module.exports = router;