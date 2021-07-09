import dotenv from "dotenv"
import app from "./apps/wirefact.app"
import serverless from "serverless-http"
import { connect } from "mongoose"

dotenv.config()

connect(process.env.DB_URL!, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, () => {
    console.log(`Connected to database 📰`)
})

// app.listen(process.env.PORT!, () => { console.log(`Server running 🚀`) }) // FOR LOCAL TESTING

export const handler = serverless(app)
