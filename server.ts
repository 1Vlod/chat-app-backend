import dotenv from "dotenv"
dotenv.config()

import "./core/db"

import express from "express"
import { UserCtrl } from "./controllers/UserController"
import { DialogCtrl } from "./controllers/DialogController"
import { MessageCtrl } from "./controllers/MessageController"
import { registerValidations } from "./validations/register"
import { passport } from "./core/passport"
import { Server } from "socket.io"
import { createServer } from "http"
import cors from "cors"

const app = express()
app.use(cors())
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
})

app.use(express.json())
app.use(passport.initialize())

app.get("/users", UserCtrl.index)
app.get(
  "/users/me",
  passport.authenticate("jwt", { session: false }),
  UserCtrl.getUserInfo
)
app.get("/users/:id", UserCtrl.showOne)

app.post("/auth/register", registerValidations, UserCtrl.create)
app.post("/auth/login", passport.authenticate("local"), UserCtrl.afterLogin)

app.get("/dialogs", DialogCtrl.index)
app.get("/dialogs/:id", passport.authenticate("jwt"), DialogCtrl.showOne)
app.get(
  "/dialogs/forUser/:id",
  passport.authenticate("jwt"),
  DialogCtrl.getUserDialogs
)
app.post("/dialogs", /*passport.authenticate("jwt"),*/ DialogCtrl.create)

app.get("/messages", MessageCtrl.index)
app.get("/messages/:id", passport.authenticate("jwt"), MessageCtrl.showOne)
app.get(
  "/messages/forDialog/:id",
  passport.authenticate("jwt"),
  MessageCtrl.getDialogMessages
)
app.post("/messages", passport.authenticate("jwt"), MessageCtrl.create)

io.on("connection", socket => {
  console.log(socket.id)
  socket.on("msg", ({msg, id}: any) => {
    console.log({id, msg})
    socket.to(id).emit("newMessage", msg)
  })

  socket.on("user online", ({ id }: any) => {
    socket.join(id)
    console.log(`user joined: ${id}`)
  })

  socket.on("disconnect", (reason: string) => {
    console.log(reason)
    console.log(socket.id + " left")
  })
})

server.listen(8888, (): void => {
  console.log(`Server is running on ${8888} port`)
})
