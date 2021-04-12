import express from "express"

import { validationResult } from "express-validator"
import { isValidObjectId } from "mongoose"

import { DialogModel, DialogModelInterface } from "../models/DialogModel"
import { UserModel, UserModelInterface } from "../models/UserModel"


class DialogController {

  async index(_: express.Request, res: express.Response): Promise<void> {
    try {
      const dialogs = await DialogModel.find({})

      res.json({
        status: "success",
        data: dialogs,
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
      const dialogId = req.params.id
      if (!isValidObjectId(dialogId)) {
        res.status(400).send()
        return
      }
      const dialog = await DialogModel.findById(dialogId).exec()
      
      if (dialog) {
        res.json({
          status: "success",
          data: dialog,
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

  async getUserDialogs(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id
      if (!isValidObjectId(userId)) {
        res.status(400).send()
        return
      }

      const user: UserModelInterface = await UserModel.findById(userId).exec()

      if (user.dialogs) {
        const dialogs = await DialogModel.find({
          "_id": { $in: user.dialogs}
        })
        res.json({
          status: "success",
          data: dialogs,
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
      console.log("errors", errors)
      console.log("body", req.body)

      const data: DialogModelInterface = {
        members: [req.body.author, req.body.receiver],
        newMessagesCount: req.body.newMessagesCount,
        lastMessage: req.body.lastMessage,
      }

      const dialog = await DialogModel.create(data)

      dialog.members.forEach(async item => {
        try {
          await UserModel.findByIdAndUpdate(item._id, {
            $addToSet: {
              dialogs: dialog._id 
            }
          })
        } catch (error) {
          res.status(500).json({
            status: "error",
            message: error,
          })
        }
      })

      res.json({
        status: "success",
        data: dialog,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        status: "error",
        message: error,
      })
    }
  }
}

export const DialogCtrl = new DialogController()