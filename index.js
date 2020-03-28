const express = require('express');
const server = express();
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const schema = require('./schema/schema');

const port = 5000;


mongoose
 .connect(
  "mongodb+srv://cglab:1234@cluster0-uvusu.mongodb.net/books-db?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
 )
 .then(() => console.log("Connected to MongoDB Atlas"))
 .catch(err => console.log("Error: ", err.message));

mongoose.connection.once('open', ()=>{
    console.log('connected to database');
});

server.use('/books-api', graphqlHTTP({
    schema,
    graphiql: true
}));

server.listen(port, ()=> console.log(`listening port:${port}`));