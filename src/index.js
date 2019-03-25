const { GraphQLServer } = require('graphql-yoga');

const typeDefs = `
  type Query {
    info: String!
    feed: [Link!]!
  }

  type Link {
    id: ID!
    description: String!
    url: String!
  }
`;

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}];

const resolvers = {
  Query: {
    info: () => 'This is the API for hacker news clone.',
    feed: (parent) => links,
  },

  // Link: {
  //   id: (parent) => {console.log('# parent.id', parent); return `ID: ${parent.id}`},
  //   description: (parent) => {console.log('# parent.description', parent); return parent.description},
  //   url: (parent) => {console.log('# parent.url', parent); return parent.url},
  // }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});
server.start(() => console.log('server is running on http://localhost:4000'));