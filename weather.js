require('dotenv').config()
const axios = require('axios')
const { setupCache } = require('axios-cache-interceptor');

const instance = axios.create({
  baseURL: process.env.WEATHER_API_BASEPATH,
});

const axiosInstance = setupCache(instance)


async function getTodaysTemperature() {
  try {
    const res = await axiosInstance.get('/bin/api.pl?lon=90.4152&lat=23.8041&product=astro&output=json', {
      id: 'get-temperature',
      cache: {
        ttl: 1000 * 60 * 60 // 1hr
      }
    })
    return res.data.dataseries[0].temp2m
  } catch (err) {
    console.error(err)
    return null
  }
}

exports.getTodaysTemperature = getTodaysTemperature
