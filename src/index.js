const { GraphQLServer } = require('graphql-yoga');

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}];
let idCount = links.length;

// operations
const findById = (list, id) => list.find(item => item.id === id);
const filterEmptyValues = (fields) =>
  Object.entries(fields) // desconstruct the object into an array containing each key:value pair
    // remove entries with empty values
    .filter(field => {
      const [ key, value ] = field;
      return !!value;
    })
    // tie each array entry into an object
    .reduce((prevField, field) => {
      const [ key, value ] = field;
      return {
        ...prevField,
        [key]: value,
      };
    }, {});
// operations:end

const resolvers = {
  Query: {
    feed: (parent) => links,
    link: (parent, args) => findById(links, args.id),

    info: () => 'This is the API for hacker news clone.',
  },
  Mutation: {
    deleteLink: (parent, args) => links.filter(link => link.id === args.id),
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);

      return link;
    },
    updateLink: (parent, args) => {
      const { id, ...fields } = args;

      // Atomically update the "links" array.
      links = links.map(link => {
        const isTheLinkImLookingFor = (link.id === id);
        if (!isTheLinkImLookingFor) return link;

        const updatedLink = { ...link, ...fields };
        return updatedLink;
      });

      const updatedLink = links.find(link => link.id === id);
      return updatedLink;
    },
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
});
server.start(() => console.log('server is running on http://localhost:4000'));