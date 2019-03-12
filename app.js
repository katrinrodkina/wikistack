
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");

app.use(morgan("dev")); //logging middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public"))); //serving up static files (e.g. css files)
app.use(express.json());
const models = require ('./models')

app.use('/wiki', require('./routes/wiki'));
app.use('/users', require('./routes/user'))
 
app.get("/", (req, res) => {
  res.redirect("/wiki");
})

const errorPage = require('./views/errorPage')
app.use((err, req, res, next) => {
  //console.error(err.stack)
  res.status(500).send(errorPage(err))
  
})


//404 handling
const notFound = require('./views/notFound')
app.use((req, res, next) => {
  res.status(404).send(notFound())
}) 



//If there is an error connecting — for example, if your database process is not running 
//Sequelize will throw an error and your process will halt. To activate this file, require it from your main app.js:

  const { db } = require('./models');
  db.authenticate().
  then(() => {
    console.log('connected to the database');
  })



const layout = require('./views/layout')


//app.use('/posts', routes);



app.get("/", (req, res) => {
    res.send(layout());
  })
  


const init = async () => {
// // this drops all tables then recreates them based on our JS definitions
  //  await  models.db.sync({force: true})
    await models.db.sync()//{ alter: true })
//sync creates the table if it does not exist. alter true creates the tables 
//and makes any changes to keep the modules in sync
 

    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`App listening in port ${PORT}`);
    });
    
}
  

// // this drops all tables then recreates them based on our JS definitions
// models.db.sync({force: true})
init()
