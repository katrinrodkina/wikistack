const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false  //Sequelize will output the SQL command text of each query it makes to the database, which you may notice in your terminal after calling .sync
});

const Page = db.define('page', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      //since we are searching, editing, deleting by slug, these need to be unique
      unique: true
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('open', 'closed')
    },
    tags:  {
      type: Sequelize.ARRAY(Sequelize.STRING), // an array of text strings (Postgres only)
      defaultValue: []
    }
  });
  function generateSlug (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  }
  Page.beforeValidate((page) => {
    //make sure tags are an array
    if (typeof page.tags === "string") {
        page.tags = page.tags.split(",").map(str => str.trim());
    }
  
    page.slug = generateSlug (page.title)
  })
  


  Page.findByTag = function (tag) {
    return this.findAll({
      where: {
        tags: { $contains: [tag] }
      }
    });
  }
  // method that is specific to an instance of Page
  Page.prototype.findSimilar = function () {
    return Page.findAll({
      where: {
        id: { $ne: this.id },
        tags: { $overlap: this.tags }
      }
    });
  }
  
  // const Op = Sequelize.Op;

  // Page.findAll({
  //     // Op.overlap matches a set of possibilities
  //     where : {
  //         tags: {
  //             [Op.overlap]: ['someTag', 'someOtherTag']
  //         }
  //     }    
  // });


  const User = db.define('user', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    }
  });

  // We include { as: 'author' } in order to be more descriptive about the relation itself, 
  // rather than a user being associated with a page more generically.
  //  Note that this aliasing will affect how we interact with this association later on.
  // //This adds methods to 'Page', such as '.setAuthor'. 
  //It also creates a foreign key attribute on the Page table pointing on the User table
 
 
  Page.belongsTo(User, {as: 'author'}); 

  User.hasMany(Page, {foreignKey: 'authorId'})


  module.exports = { db, Page, User };


