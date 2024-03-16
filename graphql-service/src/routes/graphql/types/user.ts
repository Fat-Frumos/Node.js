import { GraphQLInputObjectType, GraphQLObjectType } from "graphql";
import {
  getFloat,
  getChangeUserFields,
  getCreateUserFields,
  getString, getPostResolve,
  getProfileResolve,
  getSubscribedToUserResolve,
  getUserSubscribedResolve,
  getUUId
} from "./type.js";
import { GraphQLList } from "graphql/index.js";
import { profileType } from "./profile.js";
import { postType } from "./post.js";


export const userType:GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: getUUId(),
    name: getString(),
    balance: getFloat(),
    profile: getProfile(),
    posts: getPosts(),
    userSubscribedTo: getUserSubscribedTo(),
    subscribedToUser: getSubscribedToUser()
  }),
});

export const createUserInputType:GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: getCreateUserFields(),
});

export const changeUserInputType:GraphQLInputObjectType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: getChangeUserFields(),
});

export function getSubscribedToUser() {
  return {
    type: getUserTypeGraphQLList(),
    resolve: getSubscribedToUserResolve()
  };
}

export function getUserTypeGraphQLList() {
  return new GraphQLList(userType);
}

export function getUserSubscribedTo() {
  return {
    type: getUserTypeGraphQLList(),
    resolve: getUserSubscribedResolve()
  };
}

export function getProfile() {
  return {
    type: profileType,
    resolve: getProfileResolve()
  };
}

export function getPosts() {
  return {
    type: new GraphQLList(postType),
    resolve: getPostResolve()
  };
}
