const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const path = require('path')
const neo4j = require('neo4j-driver').v1;
const user = "neo4j"
const password = "bsfdc19"
const uri = "bolt://localhost:7687"
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

const resultPromise = session.run(
  'MATCH (c:Character) RETURN c'
)




app.use(express.static('static'))

app.use(express.urlencoded())

const VIEWS_PATH = path.join(__dirname, 'views')

// tell express to use mustache templating engine
app.engine('mustache',mustacheExpress())
app.set('views',VIEWS_PATH)
app.set('view engine','mustache')


app.get('/buttons', (req,res)=>{
    res.render('buttons_selection')
})

app.get('/buttons/:buttontype/characters', (req, res) => {
    res.render('character_selection')
})

app.get('buttons/:buttontype/characters/:charactername', (req,res)=>{
//     let characterName = req.params.charName
    
//     let resultPromise = session.run(
        
//         "MATCH (c:Character) WHERE c.name = $character RETURN c",
//         {character: characterName}
//       )
      
//     resultPromise.then(result => {
//         session.close();
      
//         const singleRecord = result.records[0];
//         const node = singleRecord.get(0);
      
//         let resultsObj = node.properties.name;
        
//         // on application exit:
//         driver.close();

//         res.redirect('results', resultsObj)

// }).catch(error=>console.log(error))

// })
    res.render('character_selection')
})


app.get('/buttons/:buttontype/characters/:charactername/results', (req,res)=>{
    let buttonTypeParam = req.params.buttontype
    let controlType = ''
    let direction = ''
    if((buttonTypeParam).includes('joystick')) {
        controlType = buttonTypeParam.substring(0,buttonTypeParam.indexOf('-'))
        direction = buttonTypeParam.substring(buttonTypeParam.indexOf('-')+1,buttonTypeParam.length)
    } else {
        controlType = buttonTypeParam
    }
    let characterName = req.params.charactername

    //write code to return info from neo4j

})

app.listen(3000, ()=>{
    console.log('server has started')
})