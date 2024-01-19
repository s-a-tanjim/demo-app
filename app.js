const os = require("os");
const express = require('express')
const actuator = require('express-actuator')
const dayjs = require('dayjs')
require("dotenv").config()
const app = express()
const { getTodaysTemperature } = require('./weather')

app.use(actuator())

app.get('/api/hello', async (req, res) => {

  const temp = await getTodaysTemperature()

  return res.json({
    "hostname": os.hostname(),
    "datetime": dayjs().format("YYYY-MM-DD-HH-mm"),
    "version": process.env.npm_package_version,
    "weather": {
    "dhaka": {
      "temperature": temp,
      "temp_unit": "c"
      }
    }
  }).status(200)
})



app.listen(process.env.APP_PORT, ()=> {
  console.log(`Application listening on ${process.env.APP_PORT}`);
})
