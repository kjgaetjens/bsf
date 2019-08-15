const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()


app.use(express.static('static'))

app.use(express.urlencoded())

app.engine('mustache',mustacheExpress())
app.set('views', './views')
app.set('view engine','mustache')

app.get('/buttons', (req,res)=>{
    res.render('buttons_selection')
})

app.get('/characters', (req,res)=>{
    res.render('character_selection')
})

app.get('/results', (req,res)=>{
    res.render('results')
})



app.listen(3000, ()=>{
    console.log('server has started')
})