
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");

app.use(morgan("dev")); //logging middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const models = require ('./models')
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/user');
// ...
app.use('/wiki', wikiRouter);
// or, in one line: app.use('/wiki', require('./routes/wiki'));
app.use('/users', userRouter)

app.get("/", (req, res) => {
  res.redirect("/wiki");
})
app.use(express.static(path.join(__dirname, "./public"))); //serving up static files (e.g. css files)




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

    await models.db.sync()


    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`App listening in port ${PORT}`);
    });
    
}
  

// // this drops all tables then recreates them based on our JS definitions
// models.db.sync({force: true})
init()
