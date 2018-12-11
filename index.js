const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

console.log(morgan.format)

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
        },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
        }
    ]

app.get('/', (req, res) => {
  res.send('<h1>Heippa maailma!</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${new Date()}</p>`)
  })

app.get('/persons', (req, res) => {
  res.json(persons)
})

app.get('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 100000000)
}

app.post('/persons', (req, res) => {
  const body = req.body
  const name = body.name.trim()

  if (name === undefined || name === null || body.number === undefined || body.number === null) {
    return res.status(400).json({error: 'name or number missing'})
  }

  if (persons.find(p => p.name.trim() === name)) {
    return res.status(400).json({error: 'name must be unique'})
  }
  
  const person = {
    name: name,
    number: body.number,
    date: new Date(),
    id: generateId()
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
