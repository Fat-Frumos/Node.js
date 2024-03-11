import { GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import {
  getChangePostFields,
  getCreatePostFields,
  getPostFields
} from "./type.js";

export const postType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Post',
  fields: () => getPostFields(),
});

export const createPostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: getCreatePostFields(),
});

export const changePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: getChangePostFields(),
});
