const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

console.log(morgan.format)

const persons = [] // Tämä helvettiin

const formatPerson = (p) => {
  return {
    name: p.name,
    number: p.number,
    id: p._id
  }
}

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
  })

app.get('/api/persons', (req, res) => {
  Person
    .find({}, {__v: 0})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
    .catch(error => {
      console.log(error)
    })
  
  //res.json(persons) // vanha osa ennen mongoloidijuttuja
})

app.get('/api/persons/:id', (req, res) => { 
  const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000000000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  const name = body.name.trim()

  if (name === undefined || name === null || body.number === undefined || body.number === null) {
    return res.status(400).json({error: 'name or number missing'})
  }

  if (persons.find(p => p.name.trim() === name)) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const person = new Person ({
    name: name,
    number: body.number,
    date: new Date()
    //id: generateId() // poistettaneenko?
  })
  
  person
    .save()
    .then(savedPerson => {
      res.json(formatPerson(savedPerson))
    })
    .catch(error => {
      console.log(error)
    })

  //persons = persons.concat(person)
  //res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
