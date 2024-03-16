import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType
} from "graphql";
import { memberType, memberTypeIdEnum } from "./member.js";
import { userType } from "./user.js";
import { NoArgs, ProfileDto } from "./dtos.model.js";
import { Context } from "node:vm";
import { getBoolean, getInt, getTypeIdEnum, getUUId } from "./type.js";

export function getMemberType() {
  return {
    type: new GraphQLNonNull(memberType),
    resolve: async (source: ProfileDto, _: NoArgs, { loader }: Context) => loader.load(source.memberTypeId)
  };
}

export function getUser() {
  return {
    type: userType,
    resolve: async (source: ProfileDto, _: NoArgs, { loader }: Context) => loader.load(source.userId)
  };
}

export const profileType: GraphQLObjectType = new GraphQLObjectType({
  name: "Profile",
  fields: () => ({
    id: getUUId(),
    isMale: getBoolean(),
    yearOfBirth: getInt(),
    memberType: getMemberType(),
    user: getUser()
  })
});

export const createProfileInputType = new GraphQLInputObjectType({
  name: "CreateProfileInput",
  fields: {
    isMale: getBoolean(),
    yearOfBirth: getInt(),
    memberTypeId: getTypeIdEnum(),
    userId: getUUId()
  }
});

export const changeProfileInputType = new GraphQLInputObjectType({
  name: "ChangeProfileInput",
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: memberTypeIdEnum }
  }
});
