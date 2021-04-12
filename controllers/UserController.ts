import express from "express"
import { validationResult } from "express-validator"
import { isValidObjectId } from "mongoose"
import jwt from "jsonwebtoken"

import {
  UserModel,
  UserModelDocumentInterface,
  UserModelInterface,
} from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"

class UserController {
  async index(_: express.Request, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({})

      res.json({
        status: "success",
        data: users,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      })
    }
  }

  async showOne(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id
      if (!isValidObjectId(userId)) {
        res.status(400).send()
        return
      }
      const user = await UserModel.findById(userId).exec()

      if (user) {
        res.json({
          status: "success",
          data: user,
        })
      } else {
        res.status(404).send()
      }
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      })
    }
  }

  async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({
          status: "error",
          message: errors.array(),
        })
        return
      }

      const data: UserModelInterface = {
        email: req.body.email,
        fullname: req.body.fullname,
        password: generateMD5(req.body.password + process.env.SECRET_KEY),
      }
      await UserModel.create(data)

      res.status(201).json({
        status: "success"
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      })
    }
  }

  async afterLogin(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = (req.user as UserModelDocumentInterface).toJSON()
      res.json({
        status: "success",
        data: {
          ...user,
          token: jwt.sign({ data: req.user }, process.env.SECRET_KEY || "123", {
            expiresIn: "30 days",
          }),
        },
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      })
    }
  }

  async getUserInfo(req: express.Request, res: express.Response): Promise<void> {
    try {
      const user = (req.user as UserModelDocumentInterface).toJSON()
      res.json({
        status: "success",
        data: user
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      })
    }
  }
}

export const UserCtrl = new UserController()
