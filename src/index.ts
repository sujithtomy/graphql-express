import express from 'express';
import graphqlHTTP from 'express-graphql';

import schema from './schema/index';

const app = express();


// The root provides a resolver function for each API endpoint
var root = {
    hello: (root: any, args: any) => {
        return 'Hello world!';
    },
};

app.use(graphqlHTTP(req => {
    return {
        schema: schema,
        rootValue: root,
        graphiql: true
    }
}));

app.listen(3000, () => console.log('GraphQL running at port http://localhost:3000'));