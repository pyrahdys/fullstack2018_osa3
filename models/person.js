const mongoose = require('mongoose')

// DELETOI SALASANA ENNE PUSHAUSTA

//const url = 'mongodb://testuser:---@ds131784.mlab.com:31784/fullstack-persons'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
  })

module.exports = Person