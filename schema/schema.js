const graphql = require('graphql');
const _=require('lodash');

const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema, 
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

let books = [
    {name: 'Name of the Wind', genere: 'Fantasy', id: '1', authorid: '1'},
    {name: 'The Final Empire', genere: 'Fantasy', id: '2', authorid: '2'},
    {name: 'The Long Earth', genere: 'Sci-Fi', id: '3', authorid: '3'},
    {name: 'The Hero of Ages', genere: 'Fantasy', id: '4', authorid: '2'},
    {name: 'The Colour of Magic', genere: 'Fantasy', id: '5', authorid: '3'},
    {name: 'The Light Fantastic', genere: 'Fantasy', id: '6', authorid: '3'}
];

let authors = [
    {name: 'Patrick Rothfuss', age: 44, id: '1'},
    {name: 'Brandon Snaderson', age: 42, id: '2'},
    {name: 'Terry Pratchett', age: 62, id: '3'}
];

const BookType = new GraphQLObjectType({
    name: 'book',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genere: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorid});

                return Author.findById(parent.authorid);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return _.filter(books, {authorid: parent.id});

                return Book.find({authorid: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: ()=>({
        book: {
            type: BookType,
            args: {id: { type: GraphQLID}},
            resolve(parent, args){
                //return _.find(books, {id: args.id});
                
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent,args){
                //return _.find(authors, {id: args.id});

                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                //return books;

                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                //return authors;

                return Author.find({});
            }
        }
    })
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genere: {type: new GraphQLNonNull(GraphQLString)},
                authorid: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genere: args.genere,
                    authorid: args.authorid
                });

                return book.save();
            }
        }
    }
}); 

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});