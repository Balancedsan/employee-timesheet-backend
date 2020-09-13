const request = require("supertest");
const app = require("../../app");
const model = require("../../models/index");
const moment = require("moment");

describe("TimeSheetController", () => {
  afterEach(async () => {
    await model.TimeSheet.destroy({ where: {}, force: true });
  });

  describe("POST api/checkin", () => {
    describe("edge cases", () => {
      it("should throw an error 400 if the latest entry for the user has already check in but has not checkout yet", async (done) => {
        await model.TimeSheet.create({
          userId: 1,
          checkIn: new Date(),
          status: "check in",
        });

        request(app)
          .post("/api/timesheet/checkin")
          .send({ userId: 1 })
          .expect(400)
          .end((req, res) => {
            expect(res.body).toEqual({
              errorCode: 400,
              message: "unable to checkin",
            });
            done();
          });
      });

      it("should throw an error 400 if the latest entry for the user has already check in but has not checkout yet ", async (done) => {
        const timeStampCheckIn1 = new Date("Sep 12, 2020 03:24:00");
        const timeStampCheckIn2 = new Date("Sep 12, 2020 04:24:00");
        const timeStampCheckIn3 = new Date("Sep 12, 2020 05:24:00");

        const timeStampCheckOut1 = new Date("Sep 12, 2020 03:25:00");
        const timeStampCheckOut2 = new Date("Sep 12, 2020 04:25:00");
        const timeStampCheckOut3 = new Date("Sep 12, 2020 05:25:00");

        await model.TimeSheet.bulkCreate([
          {
            userId: 1,
            checkIn: timeStampCheckIn2,
            checkOut: timeStampCheckOut2,
            status: "check out",
            createdAt: timeStampCheckIn2,
            updatedAt: timeStampCheckOut2,
          },
          {
            userId: 1,
            checkIn: timeStampCheckIn1,
            checkOut: timeStampCheckOut1,
            status: "check out",
            createdAt: timeStampCheckIn1,
            updatedAt: timeStampCheckOut1,
          },
          {
            userId: 1,
            checkIn: timeStampCheckIn3,
            checkOut: timeStampCheckOut3,
            status: "check in",
            createdAt: timeStampCheckIn3,
            updatedAt: timeStampCheckOut3,
          },
        ]);

        request(app)
          .post("/api/timesheet/checkin")
          .send({ userId: 1 })
          .expect(201)
          .end((req, res) => {
            expect(res.body).toEqual({
              errorCode: 400,
              message: "unable to checkin",
            });
            done();
          });
      });

      it("should throw an error 400 if the latest updated  entry for the user has already check in but has not checkout yet ", async (done) => {
        const timeStampCheckIn1 = new Date("Sep 12, 2020 03:24:00");
        const timeStampCheckIn2 = new Date("Sep 12, 2020 04:24:00");

        const timeStampCheckOut1 = new Date("Sep 12, 2020 03:25:00");
        const timeStampCheckOut2 = new Date("Sep 12, 2020 04:25:00");
        const timeStampCheckOut3 = new Date("Sep 12, 2020 05:25:00");

        await model.TimeSheet.bulkCreate([
          {
            userId: 1,
            checkIn: timeStampCheckIn2,
            checkOut: timeStampCheckOut2,
            status: "check out",
            createdAt: timeStampCheckIn2,
            updatedAt: timeStampCheckOut2,
          },
          {
            userId: 1,
            checkIn: timeStampCheckIn2,
            checkOut: timeStampCheckOut3,
            status: "check in",
            createdAt: timeStampCheckIn2,
            updatedAt: timeStampCheckOut3,
          },
          {
            userId: 1,
            checkIn: timeStampCheckIn1,
            checkOut: timeStampCheckOut1,
            status: "check out",
            createdAt: timeStampCheckIn1,
            updatedAt: timeStampCheckOut1,
          },
        ]);

        request(app)
          .post("/api/timesheet/checkin")
          .send({ userId: 1 })
          .expect(201)
          .end((req, res) => {
            expect(res.body).toEqual({
              errorCode: 400,
              message: "unable to checkin",
            });
            done();
          });
      });
    });

    it("should be able to check in with the response 200 showing the time now if there are no previous timesheet entry for the user", (done) => {
      request(app)
        .post("/api/timesheet/checkin")
        .send({ userId: 1 })
        .expect(201)
        .end((req, res) => {
          expect(res.body).toEqual({
            message: "check in successfullly"
          });
          done();
        });
    });

    it("should be able to return with the response 200 showing the timenow if the previous entry check in and checkout are filled", async (done) => {
      await model.TimeSheet.create({
        userId: 1,
        checkIn: new Date(),
        checkOut: new Date(),
        status: "check out",
      });

      request(app)
        .post("/api/timesheet/checkin")
        .send({ userId: 1 })
        .expect(201)
        .end((req, res) => {
          expect(res.body).toEqual({
            message: "check in successfullly"
          });
          done();
        });
    });
  });

  describe("POST api/checkout", () => {
    describe("edge cases", () => {
      it("should throw an error if the latest entry for timesheet is check out and the check out api is called  ", async (done) => {
        await model.TimeSheet.create({
          userId: 1,
          checkIn: new Date(),
          checkOut: new Date(),
          status: "check out",
        });

        request(app)
          .post("/api/timesheet/checkOut")
          .send({ userId: 1 })
          .expect(400)
          .end((req, res) => {
            expect(res.body).toEqual({
              errorCode: 400,
              message: "Unable to checkout",
            });
            done();
          });
      });

      it('should throw an error 400 if there are no entry in the database', (done) => {
        request(app)
        .post("/api/timesheet/checkOut")
        .send({ userId: 1 })
        .end((req, res) => {
          expect(res.body).toEqual({
            errorCode: 400,
            message: "No timesheet entry for user found, unable to checkout",
          });
          done();
        });
      });
    });

    it("should be able to update the latest timesheet", async (done) => {
      await model.TimeSheet.create({
        userId: 1,
        checkIn: new Date(),
        status: "check in",
      });

      request(app)
        .post("/api/timesheet/checkOut")
        .send({ userId: 1 })
        .expect(400)
        .end(async(req, res) => {
          expect(res.body).toEqual({
            message: "check Out successfullly",
          });

          const latestTimeSheet = await model.TimeSheet.findOne({
            where: {
              userId: 1,
            },
            order: [
              ["updatedAt", "DESC"],
              ["createdAt", "DESC"],
            ],
          })

          expect(moment(latestTimeSheet.dataValues.checkOut).format("h:mm:A")).toEqual(
            moment().format("h:mm:A")
          );

          done();
        });
    });

    it('should be able to retrieve the latest timesheet from the create/updated time and update the time accordingly', async(done) => {
      const timeStampCheckIn1 = new Date("Sep 12, 2020 03:24:00");
      const timeStampCheckIn2 = new Date("Sep 12, 2020 04:24:00");
      const timeStampCheckIn3 = new Date("Sep 12, 2020 05:24:00");

      const timeStampCheckOut1 = new Date("Sep 12, 2020 03:25:00");
      const timeStampCheckOut2 = new Date("Sep 12, 2020 04:25:00");
      const timeStampCheckOut3 = new Date("Sep 12, 2020 05:25:00");

      await model.TimeSheet.bulkCreate([
        {
          userId: 1,
          checkIn: timeStampCheckIn2,
          checkOut: timeStampCheckOut2,
          status: "check out",
          createdAt: timeStampCheckIn2,
          updatedAt: timeStampCheckOut2,
        },
        {
          userId: 1,
          checkIn: timeStampCheckIn2,
          checkOut: timeStampCheckOut3,
          status: "check in",
          createdAt: timeStampCheckIn3,
          updatedAt: timeStampCheckOut3,
        },
        {
          userId: 1,
          checkIn: timeStampCheckIn1,
          checkOut: timeStampCheckOut1,
          status: "check out",
          createdAt: timeStampCheckIn1,
          updatedAt: timeStampCheckOut1,
        },
      ]);

      request(app)
      .post("/api/timesheet/checkOut")
      .send({ userId: 1 })
      .expect(201)
      .end(async(req, res) => {
        expect(res.body).toEqual({
          message: "check Out successfullly",
        });

        const latestTimeSheet = await model.TimeSheet.findOne({
          where: {
            userId: 1,
          },
          order: [
            ["updatedAt", "DESC"],
            ["createdAt", "DESC"],
          ],
        })

        expect(moment(latestTimeSheet.dataValues.checkOut).format("h:mm:A")).toEqual(
          moment().format("h:mm:A")
        );

        done();
      });
      
    });
  });

  describe("GET api/:userid", () => {
    describe("edge cases", () => {
      it("should return an error when a userId cannot be found", (done) => {
        request(app)
          .get("/api/timesheet/2")
          .expect(400)
          .end((req, res) => {
            expect(res.body.message).toEqual("userId of 2 not found");
            done();
          });
      });

      it("should return the an empty timesheet if a user id of 1 is passed in and there is no timesheet data", (done) => {
        request(app)
          .get("/api/timesheet/1")
          .expect(200)
          .end((req, res) => {
            expect(res.body).toEqual([]);
            done();
          });
      });
    });

    it("should be able to retrieve all timesheet record  in desc order for userid 1", async (done) => {
      const timeStampCheckIn1 = new Date("Sep 12, 2020 03:24:00");
      const timeStampCheckIn2 = new Date("Sep 12, 2020 04:24:00");

      const timeStampCheckOut1 = new Date("Sep 12, 2020 03:25:00");
      const timeStampCheckOut2 = new Date("Sep 12, 2020 04:25:00");
      const timeStampCheckOut3 = new Date("Sep 12, 2020 05:25:00");

      await model.TimeSheet.bulkCreate([
        {
          userId: 1,
          checkIn: timeStampCheckIn2,
          checkOut: timeStampCheckOut2,
          status: "check out",
          createdAt: timeStampCheckIn2,
          updatedAt: timeStampCheckOut2,
        },
        {
          userId: 1,
          checkIn: timeStampCheckIn2,
          checkOut: timeStampCheckOut3,
          status: "check in",
          createdAt: timeStampCheckIn2,
          updatedAt: timeStampCheckOut2,
        },
        {
          userId: 1,
          checkIn: timeStampCheckIn1,
          checkOut: timeStampCheckOut1,
          status: "check out",
          createdAt: timeStampCheckIn1,
          updatedAt: timeStampCheckOut1,
        },
      ]);

      request(app)
        .get("/api/timesheet/1")
        .expect(200)
        .end((req, res) => {
          expect(res.body).toEqual([
            { checkIn: "4:24:AM", checkOut: "5:25:AM" },
            { checkIn: "4:24:AM", checkOut: "4:25:AM" },
            { checkIn: "3:24:AM", checkOut: "3:25:AM" },
          ]);
          done();
        });
    });
  });
});
