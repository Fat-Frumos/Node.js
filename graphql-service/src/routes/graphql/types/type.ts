import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString
} from "graphql/index.js";
import { Context, NoArgs, PostDto, UserDto } from "./dtos.model.js";
import { UUIDType } from "./uuid.js";
import { memberTypeIdEnum } from "./member.js";
import { userType } from "./user.js";

export function getFloat() {
  return { type: new GraphQLNonNull(GraphQLFloat) };
}

export function getString() {
  return { type: new GraphQLNonNull(GraphQLString) };
}

export function getUUId() {
  return { type: new GraphQLNonNull(UUIDType) };
}

export function getInt() {
  return { type: new GraphQLNonNull(GraphQLInt) };
}

export function getBoolean() {
  return { type: new GraphQLNonNull(GraphQLBoolean) };
}

export function getTypeIdEnum() {
  return { type: new GraphQLNonNull(memberTypeIdEnum) };
}

export function getChangeUserFields() {
  return {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat }
  };
}

export function getChangePostFields() {
  return {
    title: { type: GraphQLString },
    content: { type: GraphQLString }
  };
}

export function getArgs() {
  return {
    userId: getUUId(),
    authorId: getUUId()
  };
}

export function getCreateUserFields() {
  return {
    name: getString(),
    balance: getFloat()
  };
}

export function getCreatePostFields() {
  return {
    title: getString(),
    content: getString(),
    authorId: getUUId()
  };
}

export function getPostFields() {
  return {
    id: getUUId(),
    title: getString(),
    content: getString(),
    author: getAuthor()
  };
}

export function getAuthor() {
  return {
    type: userType,
    resolve: async (source: PostDto, _: NoArgs, { userLoader }: Context) => userLoader.load(source.authorId)
  };
}

export function getPostResolve() {
  return async (source: UserDto, _: NoArgs, { postsByAuthorIdLoader }: Context) => postsByAuthorIdLoader.load(source.id);
}

export function getProfileResolve() {
  return async (source: UserDto, _: NoArgs, { profileByUserIdLoader }: Context) =>
    profileByUserIdLoader.load(source.id);
}

export function getUserSubscribedResolve() {
  return async (source: UserDto, _: NoArgs, { userLoader }: Context) =>
    source.userSubscribedTo
      ? userLoader.loadMany(source.userSubscribedTo.map(({ authorId }) => authorId))
      : null;
}

export function getSubscribedToUserResolve() {
  return async (source: UserDto, _: NoArgs, { userLoader }: Context) =>
    source.subscribedToUser
      ? userLoader.loadMany(source.subscribedToUser.map(({ subscriberId }) => subscriberId))
      : null;
}
