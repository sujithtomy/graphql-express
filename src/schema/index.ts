import fetch from 'node-fetch';

import { GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLInt } from 'graphql';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const GeoType = new GraphQLObjectType({
    name: 'Geo',
    description: '...',
    fields: {
        lat: {
            type: GraphQLString
        },
        lng: {
            type: GraphQLString
        }
    }
});

const AddressType = new GraphQLObjectType({
    name: 'Address',
    description: '...',
    fields: {
        street: {
            type: GraphQLString
        },
        suite: {
            type: GraphQLString
        },
        city: {
            type: GraphQLString
        },
        zipcode: {
            type: GraphQLString
        },
        geo: {
            type: GeoType
        }
    }
});

const PersonType = new GraphQLObjectType({
    name: 'Person',
    description: '...',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        address: {
            type: AddressType
        }
    })
});

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: '...',
    fields: {
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        }
    }
});


const PostType = new GraphQLObjectType({
    name: 'Post',
    description: '...',
    fields: {
        id: {
            type: GraphQLID
        },
        title: {
            type: GraphQLString
        },
        body: {
            type: GraphQLString
        },
        author: {
            type: PersonType,
            resolve: (post, args, context, info) => {
                return fetch(`${BASE_URL}/users/${post.userId}`).then(res => res.json())
            }
        },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: (post, args, context, info) => {
                let limit = (args.count) ? args.count : 0;
                return fetch(`${BASE_URL}/comments/?postId=${post.id}&_limit=${limit}`).then(res => res.json())
            },
            args: {
                count: { type: GraphQLInt }
            },
        }
    }
});


const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'root for all query type',
    fields: () => ({
        peoples: {
            type: new GraphQLList(PersonType),
            description: '...',
            resolve: (root, args, context, info) => {
                console.log(args);
                let limit = (args.count) ? args.count : 0;
                return fetch(`${BASE_URL}/users?_limit=${limit}`).then(res => res.json())
            },
            args: {
                count: { type: GraphQLInt }
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            description: '...',
            resolve: (root, args, context, info) => {
                return fetch(`${BASE_URL}/posts`).then(res => res.json())
            }
        }
    })
});

export default new GraphQLSchema({
    query: QueryType
});
