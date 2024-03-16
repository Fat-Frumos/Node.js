import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
  createGqlResponseSchema,
  gqlResponseSchema,
  gqlSchema
} from "./schemas.js";
import { graphql, parse, validate } from "graphql";
import depthLimit from "graphql-depth-limit";
import memberTypeResolvers from './resolvers/member.resolver.js';
import postResolvers from './resolvers/post.resolver.js';
import profileResolvers from './resolvers/profile.resolver.js';
import { facadeDataLoaders } from './facade.js';
import userResolvers from "./resolvers/user.resolvers.js";

const rootValue = {
  ...userResolvers,
  ...memberTypeResolvers,
  ...postResolvers,
  ...profileResolvers
};

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  
  fastify.route({
    url: "/",
    method: "POST",
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema
      }
    },
    async handler(req) {
      const source = req.body.query;
      
      const errors = validate(gqlSchema, parse(source), [depthLimit(5)]);
      if (errors.length > 0) {
        return { errors };
      }
      
      return await graphql({
        schema: gqlSchema,
        source: source,
        rootValue: rootValue,
        variableValues: req.body.variables,
        contextValue: { prisma, ...facadeDataLoaders(prisma) }
      });
    }
  });
};

export default plugin;
