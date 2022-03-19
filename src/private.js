const PORT = 8000
const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()

app.listen(8000, () => console.log(`Backend is running on port ${PORT}`))