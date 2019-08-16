const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const neo4j = require('neo4j-driver').v1;
const user = "neo4j"
const password = "bsfdc19"
const uri = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const resultPromise = session.run(
  'MATCH (c:Character) WHERE c.name = "Blanka" RETURN c'
)

resultPromise.then(result => {
  session.close();

  const singleRecord = result.records[0];
  const node = singleRecord.get(0);

  console.log(node.properties.name);

  // on application exit:
  driver.close();
});


app.use(express.static('static'))

app.use(express.urlencoded())

app.engine('mustache',mustacheExpress())
app.set('views', './views')
app.set('view engine','mustache')

// const getControlsSelection = () => {
//   let brokenButtons = []

//   const down = document.getElementById('down-joystick')
//   const right = document.getElementById('right-joystick')
//   const upleft = document.getElementById('upleft-joystick')
//   const upright = document.getElementById('upright-joystick')
//   const up = document.getElementById('up-joystick')
//   const left = document.getElementById('left-joystick')
//   const downleft = document.getElementById('downleft-joystick')
//   const one = document.getElementById('one-btn')
//   const two = document.getElementById('two-btn')
//   const three = document.getElementById('three-btn')
//   const four = document.getElementById('four-btn')
//   const five = document.getElementById('five-btn')
//   const six = document.getElementById('six-btn')



//   down.addEventListener('click', () => {
//     if (!brokenButtons.includes('down')) {
//       brokenButtons.push('down')
//     }
//   })

//   console.log(brokenButtons)
//   //what to return if joystick itself is broken? just make them select arrows instead?
// }



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