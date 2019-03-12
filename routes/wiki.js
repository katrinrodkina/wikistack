
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


  router.get("/search", async (req, res, next) => {
    try {
      const pages = await Page.findByTag(req.query.search); 
      //if you specify a form's method as GET, it'll put its data in the REQ.QUERY string as opposed to the REQ.BODY
      //The query string is an encoded string at the end of the URL.
      // The request body is sent to the server in binary and is not represented in the URL.

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
      page.setAuthor(user)

     // await page.save();
      res.redirect(`/wiki/${page.slug}`);
    } 
    catch (error) { 
        next(error)
     }
  });

  router.post("/:slug", async (req, res, next) => {
    try {
      const [updatedRowCount, updatedPages] = await Page.update(req.body, {
        where: {
          slug: req.params.slug
        },
        returning: true
      });
  
      res.redirect("/wiki/" + updatedPages[0].slug);
    } catch (error) { next(error) }
  });
  
 
  router.get("/:slug/delete", async (req, res, next) => {
    try {
      await Page.destroy({
        where: {
          slug: req.params.slug
        }
      });
  
      res.redirect("/wiki");
    } catch (error) { next(error) }
  });
  


// /wiki/add
router.get("/add", (req, res) => {
    res.send(addPage());
  });

  
router.get('/:slug', async(req, res, next) => {
   // res.send(`hit dynamic route at ${req.params.slug}`);
   try {
    const page = await Page.findOne({
        where: {slug: req.params.slug}
      })
      if (page === null) {
        res.sendStatus(404);
      }
      else {
        const author = await page.getAuthor();
        res.send(wikiPage(page, author));
      }
  

       // res.json(foundPage)
   }
        catch (error) { 
            next(error)
         } 
  });


  router.get("/:slug/edit", async (req, res, next) => {
    try {
      const page = await Page.findOne({
        where: {slug: req.params.slug}
      })
      if (page === null) {
        res.sendStatus(404);
      }
      else {
        const author = await page.getAuthor();
        res.send(editPage(page, author));
      }
    }
    catch (error) { next(error) }
});


// /wiki/(dynamic value)
router.get("/:slug/similar", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: {
        slug: req.params.slug
      }
    });

    if (page === null) {
      res.sendStatus(404);
    } else {
      const similar = await page.findSimilar();
      res.send(main(similar));
    }
  } catch (error) { next(error) }
});
module.exports = router;


