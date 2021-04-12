import { model, Schema, Document } from "mongoose"

export interface UserModelInterface {
  _id?: string
  email: string
  fullname: string
  password: string
  online?: boolean
  dialogs?: string[]
  avatar?: string
  about?: string
}

export type UserModelDocumentInterface = UserModelInterface & Document

const UserSchema = new Schema<UserModelDocumentInterface>(
  {
    email: {
      unique: true,
      required: true,
      type: String,
    },
    fullname: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    online: {
      default: false,
      type: Boolean,
    },
    dialogs: [{ type: Schema.Types.ObjectId, ref: "Dialog" }],
    about: String,
    avatar: String,
  },
  {
    timestamps: true,
  }
)

UserSchema.set('toJSON', {
  transform: function (_: any, obj: any) {
    delete obj.password;
    delete obj.confirmHash;
    return obj;
  },
})


export const UserModel = model<UserModelDocumentInterface>("User", UserSchema)
