const mongoose = require('mongoose')

// POISTA SALASANA ENNEN PUSHAUSTA:
const url = 'mongodb://testuser:---@ds131784.mlab.com:31784/fullstack-persons'

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 2) {
    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })
    
    person
        .save()
        .then(response => {
            console.log(`lisätään henkilö ${person.name} numero ${person.number} luetteloon`)
            mongoose.connection.close()
    })
    
} else {
    console.log('Puhelinluettelo')
    Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
}