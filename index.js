const express = require("express")
const app = express()
const morgan = require('morgan')



// Same origin policy / cors
const cors = require('cors')
app.use(cors())


app.use(express.json())
// app.use(morgan('tiny'))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :message"))
morgan.token('message',  (req, res) => { return JSON.stringify(req.body) })

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/", (request, response) => {
    response.send("Hello world")
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {

    const msg = `Phonebook has info for ${persons.length} people <br>
    ${Date()}`
    response.send(msg)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(pers => pers.id === id)

    person ?
    response.json(person) :
    response.status(404).end()
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(n => n.id !== id)

    response.status(204).end()
})


app.post("/api/persons", (request, response) => {
    const person = request.body

    if (!person.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }
    else if (!person.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }
    else if (persons.some(p => p.name === person.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const randomId = Math.floor(Math.random() * (1000 - 1) + 1)

    person.id = String(randomId)

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
