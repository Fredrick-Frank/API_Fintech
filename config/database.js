const env = process.env.NODE_ENV || 'development'
const config = require('../knexfile')
const knex = require('knex')(config)

//check for connection
knex.raw("SELECT VERSION()").then( () => {
    console.log(`Connection to db successful`)
})
.catch((err) => { console.log(err); throw err})
.finally(() => {
    knex.destroy();
});

module.exports = require('knex')(config);