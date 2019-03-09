
const router = require('express').Router();
const models = require("../models");
const Page = models.Page;
const User = models.User;

//const { Page, User } = require("../models");

const { main, addPage, editPage, wikiPage } = require("../views");

//const addPage = require("../views/addPage");  

// router.get('/', (req, res, next) => {
//     res.send(wikiPage())
// })
router.get("/", async (req, res, next) => {
    try {
      const pages = await Page.findAll();
      //invoking main page module with the array of pages
      res.send(main(pages));
    } catch (error) { next(error) }
  });

  
router.post('/', async (req, res, next) => {

    try {   
       // const page = new Page({
       //    title: req.body.title,
       //   content: req.body.content
       //  });   
      const [user, wasCreated] = await User.findOrCreate({where: {name: req.body.name, email:req.body.email}})

      const page = await Page.create(req.body);
  // Sequelize automatically placed magic instance methods 
   //on our page objects in order to manage this association. page.setAuthor will be very useful to us here.
      page.setAuthor(user)
     // await page.save();
      res.redirect(`/wiki/${page.slug}`);
    } 
    catch (error) { 
        next(error)
     }
  });



// /wiki/add
router.get("/add", (req, res) => {
    res.send(addPage());
  });

  
router.get('/:slug', async(req, res, next) => {
   // res.send(`hit dynamic route at ${req.params.slug}`);
   try {
    const foundPage = await Page.findOne({
        where: {slug:req.params.slug}
      })
     const author = await foundPage.getAuthor();
     res.send(wikiPage(foundPage, author));

       // res.json(foundPage)
   }
        catch (error) { 
            next(error)
         } 
  });
module.exports = router;


