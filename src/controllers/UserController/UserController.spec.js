const request = require("supertest");
const app = require("../../app");

describe('GET /api/users', () => {
    it('should return the userdetails of the emmployee with id 1', (done) => {
        request(app)
            .get("/api/users/1")
            .expect(200)
            .end((err,res)=> {
                expect(res.body).toEqual({
                    firstName:"John",
                    lastName:"wee",
                    job:"barista",
                    userId:1
                });
                done();
            })
    });

    it('should throw an error of 400 if the employee id is not found with the relevant message', (done) => {
        request(app)
            .get("/api/users/2")
            .expect(400)
            .end((err,res)=> {
                expect(res.body.message).toEqual("username not found");
                done();
            })
    });
});