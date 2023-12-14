import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :response-time ms :body'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

  app.get('/', (request, response) => {
      response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/persons', (request, response) => {
      response.json(persons)
  })

  app.get('/info', (request, response) => {
      let d = new Date().toISOString();
      response.send(`<div>Phonebook has info for ${persons.length} people</div><br/><div>${d}</div>`)
  })

  app.get('/api/persons/:id', (request, response) => {
      const id = Number(request.params.id)
      const person = persons.find(person => person.id === id)
      
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
      const id = Number(request.params.id)
      persons = persons.filter(person => person.id !== id)
    
      response.status(204).end()
    })

  const generateId = () => {
      const maxId = persons.length > 0
          ? Math.max(...persons.map(n => n.id))
          : 0
  return maxId + 1
  }
    
  app.post('/api/persons', (request, response) => {
      const body = request.body

  if (!body.name) {
      return response.status(400).json({ 
      error: 'Name is missing' 
      })
  }

  if (!body.number) {
      return response.status(400).json({ 
      error: 'Number is missing' 
      })
  }

  if (persons.map(person => person.name).includes(body.name)) {
      return response.status(400).json({ 
      error: 'Name must be unique' 
      })
  }

  const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })