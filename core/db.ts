import mongoose from "mongoose"
// @ts-ignore
mongoose.Promise = Promise

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/chatApp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))

export { db, mongoose }