import { body } from "express-validator"
import { UserModel } from "../models/UserModel"

export const registerValidations = [
  body("email", "Введите E-Mail")
    .isEmail()
    .withMessage("Неверный E-Mail")
    .isLength({
      min: 10,
      max: 40,
    })
    .withMessage("Допустимое количество символов от 10 до 40.")
    .custom(async (value) => {
      const user = await UserModel.find({ email: value })
      
      if (user.length) {
        throw new Error("Данная почта уже занята")
      } else {
        return value
      }
    }),
  body("fullname")
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage("Допустимое количество символов в имени от 2 до 40"),
  body("password", "Укажите пароль")
    .isString()
    .isLength({
      min: 6,
    })
    .withMessage("Минимальная длина 6 символов"),
]
