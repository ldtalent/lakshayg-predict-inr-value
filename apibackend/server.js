const brain = require('brain.js')
const data = require('./data')
const express = require('express')
var app = express()
const cors = require('cors')
app.use(cors())
var trainingData = []
var testingData = []
var maxClose = Math.max.apply(Math, data.map(function(o) {
    return o.Close
}));
var maxHigh = Math.max.apply(Math, data.map(function(o) {
    return o.High
}));
var maxLow = Math.max.apply(Math, data.map(function(o) {
    return o.Low
}));
var maxOpen = Math.max.apply(Math, data.map(function(o) {
    return o.Open
}));
for (var i = 0; i < 0.9*data.length; i++) {
    var input = [new Date(data[i].Date).getTime() / new Date().getTime(), data[i].High / maxHigh, data[i].Low / maxLow, data[i].Open / maxOpen]
    var output = [data[i].Close / maxClose]

    trainingData.push({
        'input': input,
        'output': output
    })
}

const net = new brain.NeuralNetwork()

app.listen(process.env.PORT || 3001, async () => {
    net.train(trainingData)
   
    console.log('Server started')
})


app.get('/predicted', async (req, res) => {
   
    for (var i = parseInt(0.9*data.length); i < data.length; i++) {
        var predict = net.run([new Date(data[i].Date).getTime() / new Date().getTime(), data[i].High / maxHigh, data[i].Low / maxLow, data[i].Open / maxOpen])
        var actual = data[i].Close
        testingData.push({
            'Date':data[i].Date,
            'predicted':predict*maxClose,
            'actual':actual
        })
    }
    console.log(testingData)
    res.json(testingData)
})

app.get('/:days', async (req, res) => {

    var high = trainingData[trainingData.length - 1].input[1] / maxHigh;
    var low = trainingData[trainingData.length - 1].input[2] / maxLow
    var open = trainingData[trainingData.length - 1].input[3] / maxOpen

    for (var i = 0; i < trainingData.length; i++) {
        if (parseFloat(new Date().getTime() / (req.params.days * 86400000 + new Date().getTime())).toFixed(4) == trainingData[i].input[0].toFixed(4)) {
            high = trainingData[i].input[1];
            low = trainingData[i].input[2];
            open = trainingData[i].input[3];
            break;
        }
    }

    var output = net.run([parseFloat(new Date().getTime() / (req.params.days * 86400000 + new Date().getTime())), high, low, open])

    console.log(output[0] * maxClose)
    res.json({
        'result': output[0] * maxClose
    })
})



