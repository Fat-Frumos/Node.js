import { GraphQLEnumType, GraphQLList, GraphQLObjectType } from "graphql";
import { MemberTypeId } from "../../member-types/schemas.js";
import { profileType } from "./profile.js";
import { MemberTypeDto, NoArgs } from "./dtos.model.js";
import { Context } from "node:vm";
import { getFloat, getInt } from "./type.js";

export const memberTypeIdEnum: GraphQLEnumType = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: {
      value: MemberTypeId.BASIC,
    },
    [MemberTypeId.BUSINESS]: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const memberType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: memberTypeIdEnum },
    discount: getFloat(),
    postsLimitPerMonth: getInt(),
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (source: MemberTypeDto, _: NoArgs, { loader }: Context) =>
        loader.load(source.id),
    },
  }),
});
