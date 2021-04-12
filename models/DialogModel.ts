import { model, Schema, Document } from "mongoose"

import { UserModelInterface } from "./UserModel"

export interface DialogModelInterface {
  _id?: string
  members: UserModelInterface[]
  newMessagesCount?: number
  lastMessage?: string
}

export type DialogModelDocumentInterface = DialogModelInterface & Document

const DialogSchema = new Schema<DialogModelDocumentInterface>(
  {
    members: [
      {
        fullname: { required: true, type: String },
        avatar: String,
        _id: { required: true, type: String },
      },
    ],
    newMessagesCount: {
      default: 0,
      type: Number,
    },
    lastMessage: String,
  },
  {
    timestamps: true,
  }
)

export const DialogModel = model<DialogModelDocumentInterface>(
  "Dialogs",
  DialogSchema
)
