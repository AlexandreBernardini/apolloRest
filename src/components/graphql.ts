// Importation des modules nécessaires
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Définition des interfaces TypeScript pour les entities GraphQL
interface Book {
    title: string;
    author: string;
}

interface Authors {
    id: number;
    name: string;
    books: Book[];
}

// Définition des types de require GraphQL dans TypeScript
interface Query {
    books: Book[];
}

// Données fictive pour les lives
const books: Book[] = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const authors: Authors[] = [
    {
        id: 2,
        name: "Paul Auster",
        books: []
    },
    {
        id: 1,
        name: "Kate Chopin",
        books: []
    }
];

// Définition du schéma GraphQL aver les types Book et Authors
const typeDefs = `#graphql
    type Book {
        title: String!
        author: String!
    }

    type Author {
        id: Int!
        name: String!
        books: [Book!]!
    }

    type Query {
        books: [Book!]!
    }
`;

// Resolvers pour recuperate les types define dans le schéma
const resolvers = {
    Query: {
        books: (): Book[] => books,
       // recentBooks: (): Book[] => books.slice(0, 2),
       // authors: () :Authors[] => authors,
    },


};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const startServer = async (): Promise<void> => {
    try {
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4000 },
        });
        console.log(`🚀  Server ready at: ${url}`);
    } catch (err) {
        console.error('Error starting the server:', err);
    }
};

await startServer();
