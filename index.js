const express = require('express')
const app = express()
const port = 8080
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require('./docs/swagger.json');

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(express.json())

const exercises = [
    {id: 1, name: "push-up", repetitions: 10, sets: 3},
    {id: 2, name: "Diamond push-up", repetitions: 10, sets: 3},
    {id: 3, name: "squat", repetitions: 10, sets: 3},
    {id: 4, name: "pistol squat", repetitions: 10, sets: 3},
    {id: 5, name: "lat pull down", repetitions: 10, sets: 3}
]

const trainingprogram = [
    {id: 1, name: "Chest day", repetitions: 10, sets: 3},
    {id: 2, name: "Leg day", repetitions: 10, sets: 3},
    {id: 3, name: "Core day", repetitions: 10, sets: 3},
    {id: 4, name: "Back day", repetitions: 10, sets: 3},
    {id: 5, name: "Arms day", repetitions: 10, sets: 3}
]

app.get("/exercises", (req, res) => {
    res.send(exercises.map(({id,name}) => {
        return {id, name}
    }))
})

function createId() {
    const maxIdExercise = exercises.reduce((prev, current) => (prev.id > current.id) ? prev : current, 1)
    return maxIdExercise.id + 1;
}

app.post('/exercises', (req, res) => {
    if (!req.body.name || req.body.name.trim().length === 0){
        return res.status(400).send({error: "Missing required field 'name'"})
    }
    const newExercise = {
        id: createId(),
        name: req.body.name,
        sets: req.body.sets,
        repetitions: req.body.repetitions
    }
    exercises.push(newExercise)
    res.status(201)
        .location(`${getBaseUrl(req)}/exercises/${newExercise.id}`)
        .send(newExercise)
})

app.post('/trainingprogram', (req, res) => {
    if (!req.body.name || req.body.name.trim().length === 0){
        return res.status(400).send({error: "Missing required field 'name'"})
    }
    const newtrainingprogram = {
        id: createId(),
        name: req.body.name,
        sets: req.body.sets,
        repetitions: req.body.repetitions
    }
    trainingprograms.push(newTrainingprogram)
    res.status(201)
        .location(`${getBaseUrl(req)}/trainingprogram/${newTrainingprogram.id}`)
        .send(newTrainingprogram)
})

app.get('/exercises/:id', (req, res) => {
    const exercise = getExercise(req,res)
    if (!exercise) { return }
    return res.send(exercise)
})

app.put("/exercises/:id", (req, res)  => {
    const exercise = getExercise(req,res)
    if (!exercise) { return }
    if (!req.body.name || req.body.name.trim().length === 0){
        return res.status(400).send({error: "Missing required field 'name'"})
    }
    exercise.name = req.body.name
    exercise.sets = req.body.sets
    exercise.repetitions = req.body.repetitions
    return res
        .location(`${getBaseUrl(req)}/exercises/${exercise.id}`)
        .send(exercise)
})

app.delete('/exercises/:id', (req, res) => {
    const exercise = getExercise(req,res)
    if (!exercise) { return }
    exercises.splice(exercises.indexOf(exercise), 1)
    res.status(204).send()
})

function getBaseUrl (req) {
    return (req.connection && req.connection.encrypted ? 'https' : 'http') + `://${req.headers.host}`
}

function getExercise(req, res) {
    const idNumber = parseInt(req.params.id)
    if (isNaN(idNumber)) {
        res.status(400).send({error: `ID must be a whole number: ${req.params.id}`})
        return null
    }
    const exercise = exercises.find(e => e.id === idNumber)
    if (!exercise) {
        res.status(404).send({error: `Exercise not found`})
        return null
    }
    return exercise
}
 
app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})