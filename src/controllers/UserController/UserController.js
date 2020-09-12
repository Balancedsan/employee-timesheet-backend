const Express = require("express");
const model = require("../../models/index");
const ErrorBase = require("../../errors/ErrorBase");

const UserController = Express.Router();


const CreateUserController = async (req,res,next) => {
    try {
      const {userid} = req.params; 
      const user = await model.User.findOne({
        where : {
          userId: userid
        }
      })  


      if(!user){
        const error =  new ErrorBase(`username not found`,400,400);
        throw error;
      }

      const {userId, firstName, lastName,job} = user.dataValues;


      res.status(200).send({
        userId,
        firstName,
        lastName,
        job
      });
    }catch(err){
      return next(err);
    }
  };

  UserController.get("/:userid",CreateUserController);


  module.exports = UserController;