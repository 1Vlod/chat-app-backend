import express from "express"
import { validationResult } from "express-validator"
import { isValidObjectId } from "mongoose"

import { MessageModel, MessageModelInterface } from "../models/MessageModel"

class UserController {
  async index(_: express.Request, res: express.Response): Promise<void> {
    try {
      const messages = await MessageModel.find({})

      res.json({
        status: "success",
        data: messages,
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
      const messageId = req.params.id
      if (!isValidObjectId(messageId)) {
        res.status(400).send()
        return
      }
      const messages = await MessageModel.findById(messageId)
        .populate("dialog")
        .exec()

      if (messageId) {
        res.json({
          status: "success",
          data: messages,
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

  async getDialogMessages(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const dialogId = req.params.id
      if (!isValidObjectId(dialogId)) {
        res.status(400).send()
        return
      }

      const messages = await MessageModel.find({ dialog: dialogId }).exec()

      if (messages) {
        res.json({
          status: "success",
          data: messages,
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
      }

      const data: MessageModelInterface = {
        text: req.body.text,
        author: req.body.author,
        dialog: req.body.dialog,
      }

      const message = await MessageModel.create(data)

      res.json({
        status: "success",
        data: message,
      })
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error,
      })
    }
  }
}

export const MessageCtrl = new UserController()
