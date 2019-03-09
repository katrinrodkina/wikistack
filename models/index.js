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
    }
  });
  function generateSlug (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  }
  Page.beforeValidate((page) => {
    page.slug = generateSlug (page.title)
  })
  
  


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


  //This adds methods to 'Page', such as '.setAuthor'. 
  //It also creates a foreign key attribute on the Page table pointing ot the User table
  Page.belongsTo(User, {as: 'author'});
  
  module.exports = { db, Page, User };


