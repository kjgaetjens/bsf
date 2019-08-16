const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const neo4j = require('neo4j-driver').v1;
const user = "neo4j"
const password = "bsfdc19"
const uri = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();
const path = require('path')


const VIEWS_PATH = path.join(__dirname, 'views')





app.use(express.urlencoded())
app.use(express.static('static'));
app.engine('mustache',mustacheExpress())
app.set('views', VIEWS_PATH)
app.set('view engine','mustache')

app.get('/buttons', (req,res)=>{
    
    res.render('buttons_selection')
})

app.get('/buttons/:buttontype/characters',(req,res)=>{
    //     let resultPromise = session.run(
            
    //         "MATCH (c:Character) WHERE c.name = $character RETURN c",
    //         {character: characterName}
    //       )
          
    //     resultPromise.then(result => {
    //         session.close();
          
    //         const singleRecord = result.records[0];
    //         const node = singleRecord.get(0);
          
    //         let resultsObj = node.properties.name;
    //         console.log(resultsObj)
    //         // on application exit:
    //         driver.close();   
        
            
    // })
    res.render('character_selection')
    
})


// app.get('buttons/:buttontype/characters/:charactername', (req,res)=>{
//     let characterName = req.params.charactername
//     res.send('asdfg')
// })


app.get('/buttons/:buttontype/characters/:charactername/results', (req,res)=>{
let buttonTypeParam = req.params.buttontype
   let controlType = ''
   let direction = ''
   let position
   let action = ''
   if((buttonTypeParam).includes('joystick')) {
       controlType = buttonTypeParam.substring(0,buttonTypeParam.indexOf('-'))
       direction = buttonTypeParam.substring(buttonTypeParam.indexOf('-')+1,buttonTypeParam.length)
       if (direction == 'up') {
            action='jump'
       } else if (direction == 'down') {
            action='crouch'
       } else if (direction =='down-right') {
            action='offensive crouch'
       } else if (direction =='right') {
            action='forward'
       } else if (direction =='up-right') {
            action='forward jump'
       } else if (direction =='up-left') {
            action='back flip'
       } else if (direction == 'left') {
            action='back defense'
       } else if (direction == 'down-left') {
            action='defensive crouch'
       }
   } else {
       controlType = 'button' 
       position = buttonTypeParam
   }
   let characterName = req.params.charactername
   if(controlType == 'joystick') {
    let resultPromise = session.run(
       "MATCH (a:Action)-->(c:Combo), (p:Character)-->(a) WHERE p.name=$name AND a.name=$action RETURN a, c",
       {name: characterName, action:action}
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
             console.log(result)
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

app.listen(3000, ()=>{
    console.log('server has started')
})