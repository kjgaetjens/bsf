const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const neo4j = require('neo4j-driver').v1;
const user = "neo4j"
const password = "123"
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