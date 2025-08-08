const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.static('dist'))

let people = [
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

app.use(express.json())

app.use((request, response, next) => {
    const oldJson = response.json
    
    response.json = (body) => {
        response.locals.body = body
        return oldJson.call(response, body)
    }
    
    next()
})

morgan.token('bod', (req, res) => {
    return JSON.stringify(res.locals.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :bod'))

app.get('/', (request, response) => {
    response.send('<h1>HELLO!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(people)
})

app.get('/info', (request, response) => {
    const count = people.length

    response.send(`<p>Phonebook has info for ${count} people.</p>
        <p>${Date()}</p>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = people.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 1255455))
}

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error:'name is missing'
        })
    }
    if(!body.number) {
        return response.status(400).json({
            error:'number is missing'
        })
    }

    if(Object.values(people.map(p => p.name)).find(p => p.toLowerCase() === body.name.toLowerCase())) {
        return response.status(400).json({
            error:'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    people = people.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})