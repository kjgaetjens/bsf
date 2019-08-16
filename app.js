const express = require('express')
const mustacheExpress = require('mustache-express')
const app = express()
const neo4j = require('neo4j-driver').v1;
const user = "neo4j"
const password = "123"
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

app.get('/buttons/:buttontype', (req,res)=>{
    
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

   if((buttonTypeParam).includes('joystick')) {
       controlType = buttonTypeParam.substring(0,buttonTypeParam.indexOf('-'))
       direction = buttonTypeParam.substring(buttonTypeParam.indexOf('-')+1,buttonTypeParam.length)
   } else {
       controlType = buttonTypeParam
   }

   let characterName = req.params.charactername
    
    let resultPromise = session.run(
        "MATCH (c:Character) WHERE c.name = $character RETURN c",
        {character: characterName}
      )
      
    resultPromise.then(result => {
        session.close();
      
        const singleRecord = result.records[0];
        const node = singleRecord.get(0);
      
        let resultsObj = node.properties.name;
        console.log(resultsObj)
        
        // on application exit:
        driver.close();

        res.render('results', {character: characterName})

}).catch(error=>console.log(error))
})



app.listen(3000, ()=>{
    console.log('server has started')
})