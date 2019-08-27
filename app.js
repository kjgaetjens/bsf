const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const neo4j = require('neo4j-driver').v1;
const path = require('path')
const PORT = process.env.PORT || 8080
const VIEWS_PATH = path.join(__dirname, 'views')

var GRAPHENEDB_BOLT_URL = 'bolt://hobby-jojjbabkhfcigbkejiignldl.dbs.graphenedb.com:24787'
var GRAPHENEDB_BOLT_USER = 'app143202370-Vrkgp0'
var GRAPHENEDB_BOLT_PASSWORD = 'b.oN9QCGuyNxvP.A5mjRm5fbDvA62Th'

var graphenedbURL = GRAPHENEDB_BOLT_URL;
var graphenedbUser = GRAPHENEDB_BOLT_USER;
var graphenedbPass = GRAPHENEDB_BOLT_PASSWORD;

var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));
var session = driver.session();

app.use(express.urlencoded())
app.use(express.static('static'));
app.engine('mustache',mustacheExpress())
app.set('views', VIEWS_PATH)
app.set('view engine','mustache')

app.get('/', (req,res)=>{
    res.redirect('/buttons')
})

app.get('/buttons', (req,res)=>{
    
    res.render('buttons_selection')
})

app.get('/buttons/:buttontype/characters',(req,res)=>{
    res.render('character_selection')
})

app.get('/buttons/:buttontype/characters/:charactername/results', (req,res)=>{
let buttonTypeParam = req.params.buttontype
   let controlType = ''
   let direction = ''
   let position
   let action = ''
   if((buttonTypeParam).includes('joystick')) {
       controlType = buttonTypeParam.substring(0,buttonTypeParam.indexOf('-'))
       direction = buttonTypeParam.substring(buttonTypeParam.indexOf('-')+1,buttonTypeParam.length)
   } else {
       controlType = 'button' 
       position = buttonTypeParam
   }
   let characterName = req.params.charactername
   if(controlType == 'joystick') {
    let resultPromise = session.run(
       "MATCH (c:Joystick)-[rel:MOVE]->(a:Action), (p:Character)-->(a) WHERE p.name=$name AND rel.direction=$direction OPTIONAL MATCH (a)-->(d:Combo) RETURN a, d",
       {name: characterName, direction:direction}
      )
    resultPromise.then(result => {
        session.close();
        let actions = []
        const singleRecord = result.records[0];
        const node1 = singleRecord.get(0);
        const action = node1.properties.name
        actions.push(action)
        const otherRecords = result.records;
        if (otherRecords.length > 1) {
            otherRecords.forEach(record => {
                const node2 = record.get(1)
                const combo = node2.properties.name
                actions.push(combo)
            })
        }
        
        driver.close();
        res.render('results', {actions: actions})
 }).catch(error=>console.log(error))
    } else {
        let resultPromise = session.run(
            "MATCH (c:Control)-[*1..2]->(a:Action), (p:Character)-->(a) WHERE c.position=$position AND p.name=$name RETURN a",
            {name: characterName, position: parseInt(position)}
           )
         resultPromise.then(result => {
             session.close();
             let actions = []
             const records = result.records;
                records.forEach(record => {
                    const node = record.get(0)
                    const action = node.properties.name
                    actions.push(action)
                })
             
             driver.close();
             res.render('results', {actions: actions})
      }).catch(error=>console.log(error))
    }
 })

app.listen(PORT, ()=>{
    console.log('server has started')
})