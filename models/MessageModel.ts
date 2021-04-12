import { model, Schema, Document } from "mongoose"

import { UserModelDocumentInterface } from "./UserModel"

export interface MessageModelInterface {
  _id?: string
  text: string
  author: UserModelDocumentInterface
  dialog: string
}

export type MessageModelDocumentInterface = MessageModelInterface & Document

const MessageSchema = new Schema<MessageModelDocumentInterface>(
  {
    text: {
      required: true,
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dialog: { type: Schema.Types.ObjectId, ref: "Dialog" },
  },
  {
    timestamps: true,
  }
)

export const MessageModel = model<MessageModelDocumentInterface>("Message", MessageSchema)