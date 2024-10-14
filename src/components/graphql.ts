import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// Définition des interfaces TypeScript pour les entités GraphQL
interface Book {
    title: string;
    authorId: number;
    categoryId: number;
}

interface Author {
    id: number;
    name: string;
    books: Book[];
}

interface Category {
    id: number;
    name: string;
    books: Book[];
}

interface CreateBookInput {
    title: string;
    authorId: number;
    categoryId: number;
}

interface UpdateBookInput {
    title: string;
    authorId: number;
    categoryId: number;
}

// Données fictives pour les livres
const books: Book[] = [
    {
        title: 'The Awakening',
        authorId: 1,
        categoryId: 1,
    },
    {
        title: 'City of Glass',
        authorId: 2,
        categoryId: 2,
    },
];

const authors: Author[] = [
    {
        id: 1,
        name: "Kate Chopin",
        books: books.filter((book) => book.authorId === 1),
    },
    {
        id: 2,
        name: "Paul Auster",
        books: books.filter((book) => book.authorId === 2),
    },
];

const categories: Category[] = [
    {
        id: 1,
        name: 'Fiction',
        books: books.filter((book) => book.categoryId === 1),
    },
    {
        id: 2,
        name: 'Non-Fiction',
        books: books.filter((book) => book.categoryId === 2),
    },
];

// Définition du schéma GraphQL avec les types Book, Author, Category, et une mutation pour créer et mettre à jour des livres
const typeDefs = `#graphql
    type Book {
        title: String!
        author: Author!
        category: Category!
    }

    type Author {
        id: Int!
        name: String!
        books: [Book!]!
    }
    
    type Category {
        id: Int!
        name: String!
        books: [Book!]!
    }

    type Query {
        books: [Book!]!
        bookById(id: Int!): Book
        categories: [Category!]!
        authors: [Author!]!
    }

    input CreateBookInput {
        title: String!
        authorId: Int!
        categoryId: Int!
    }
    
    input UpdateBookInput {
        title: String!
        authorId: Int!
        categoryId: Int!
    }
    
    type Mutation {
        createBook(input: CreateBookInput!): Book!
        updateBook(id: Int!, input: UpdateBookInput!): Book!
    }
`;


const resolvers = {
    Query: {
        books: () => books,
        bookById: (_: any, { id }: { id: number }) => books.find((book) => book.authorId === id),
        authors: () => authors,
        categories: () => categories,
    },

    Mutation: {
        createBook: (_: any, { input }: { input: CreateBookInput }) => {
            const newBook = { ...input };
            books.push(newBook);
            return newBook;
        },
        updateBook: (_: any, { id, input }: { id: number; input: UpdateBookInput }) => {

            const bookIndex = books.findIndex((book) => book.authorId === id);

            if (bookIndex === -1) {
                throw new Error("Book not found");
            }

            books[bookIndex] = { ...books[bookIndex], ...input };
            return books[bookIndex];
        },
    },

    Book: {
        author: (book: Book) => authors.find((author) => author.id === book.authorId),
        category: (book: Book) => categories.find((category) => category.id === book.categoryId),
    },
    Author: {
        books: (author: Author) => books.filter((book) => book.authorId === author.id),
    },
    Category: {
        books: (category: Category) => books.filter((book) => book.categoryId === category.id),
    },
};

// Création du serveur Apollo avec le schéma et les résolveurs
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Fonction pour démarrer le serveur
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

// Démarrage du serveur
await startServer();
