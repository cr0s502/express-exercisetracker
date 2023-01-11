const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const User = require('./user.js')
require('dotenv').config()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

let UsersList = []
let Getlist = []


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', (req, res) => {
  UsersList.forEach((k) => {
    const user = { username: k.username, _id: k._id }
    Getlist.push(user)
  })
  return res.json(Getlist)
})

app.post('/api/users', (req, res) => {
  const username = req.body.username
  const id = UsersList.length + 1
  let user = new User(username, id.toString())
  UsersList.push(user)
  return res.json({
    username: user.username, _id:
      user._id
  })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id
  const description = req.body.description
  const duration = parseInt(req.body.duration)
  let date = req.body.date
  if (!date) {
    date = new Date();
  }

  let exercise = { description: description, duration: duration, date: date }
  UsersList.forEach((k) => {
    if (k._id === id) {
      k.addExercise(exercise)
      res.json({ username: k.username, _id: k._id, date: new Date(date).toDateString(), description: description, duration: duration, })
    }
  })
})

app.get('/api/users/:_id/logs', (req, res) => {
  let fromdt = req.query.from
  let todt = req.query.to
  let limit = req.query.limit
  const id = req.params._id
  
  UsersList.forEach((k) => {
    if (k._id === id) {
      
      const count = k.exercises.length
      let exercises = k.exercises

      if ((fromdt) && (todt)) {
        exercises = exercises.filter((d) => Date.parse(d.date) >= Date.parse(fromdt) && Date.parse(d.date) <= Date.parse(todt))
      }

      if (limit) {
        exercises = exercises.splice(0, limit)
      }

      exercises = exercises.map(d => {
        return ({
          description: d.description,
          duration: d.duration,
          date: new Date(d.date).toDateString()
        })
      })

      res.json({
        _id: k._id, username: k.username, log: exercises, count: count
      })
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})