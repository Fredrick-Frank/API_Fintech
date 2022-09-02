# API_Fintech
* This project aimed at building an API using Nodejs technology for a payment procedure, it used the KNEXJS ORM (Object-relational mapping) to sync with the MYSQL database. The MYSQL database stored the Users data.

# DEPENDENCIES USED:
* The bcrypts
* The cors
* The knex
* The mysql/mysql2
* The jsonwebtoken
* The expressjs framework
* The dotenv 
* The testing dependencies: mocha & supertest
* The nodemon

## THE KNEXJS PROCESS:
* The knexjs used a methodology for migrating & seed: knex migrate: make user for creating a schema
* The kenxjs for seeding is used for entrying data into the schema created; using knex seed: make 01_user
* The knexjs ORM is a good Object relatinal mapping that utilizes Mysql database easily.

## The JSONWEBTOKEN 
* This library helped in creating/generating a token for authentication doing a login or registration scenario. 

## The bcrypts
* Bcrypt is a popular and trusted method for salt and hashing passwords. You have learned how to use bcrypt's NodeJS library to salt and hash a password before storing it in a database. You have also learned how to use the bcrypt compare function to compare a password to a hash, which is necessary for authentication
