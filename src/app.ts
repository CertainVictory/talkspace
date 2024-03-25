import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Sequelize, DataTypes } from 'sequelize';
// Using example from https://github.com/sequelize/express-example/blob/master/express-main-example/express/app.js
function makeHandlerAwareOfAsyncErrors(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}
const app = express();
app.use(bodyParser.json());
const router = express.Router();
