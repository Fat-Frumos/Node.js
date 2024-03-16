import { Type } from "@fastify/type-provider-typebox";
import { UUIDType } from "./types/uuid.js";
import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from "graphql";
import {
  changeUserInputType,
  createUserInputType, getUserTypeGraphQLList,
  userType
} from "./types/user.js";
import { memberType } from "./types/member.js";
import {
  changePostInputType,
  createPostInputType,
  postType
} from "./types/post.js";
import {
  changeProfileInputType,
  createProfileInputType,
  profileType
} from "./types/profile.js";
import { getArgs, getTypeIdEnum, getUUId } from "./types/type.js";

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any()
  })
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any()))
    },
    {
      additionalProperties: false
    }
  )
};

const query = new GraphQLObjectType({
  name: "Query",
  fields: {
    user: {
      type: userType,
      args: {
        id: getUUId()
      }
    },
    users: {
      type: getUserTypeGraphQLList()
    },
    memberType: {
      type: memberType,
      args: {
        id: getTypeIdEnum()
      }
    },
    memberTypes: {
      type: new GraphQLList(memberType)
    },
    post: {
      type: postType,
      args: {
        id: getUUId()
      }
    },
    posts: {
      type: new GraphQLList(postType)
    },
    profile: {
      type: profileType,
      args: {
        id: getUUId()
      }
    },
    profiles: {
      type: new GraphQLList(profileType)
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: userType,
      args: {
        dto: { type: createUserInputType }
      }
    },
    changeUser: {
      type: userType,
      args: {
        id: getUUId(),
        dto: { type: changeUserInputType }
      }
    },
    deleteUser: {
      type: UUIDType,
      args: {
        id: getUUId()
      }
    },
    createPost: {
      type: postType,
      args: {
        dto: { type: createPostInputType }
      }
    },
    changePost: {
      type: postType,
      args: {
        id: getUUId(),
        dto: { type: changePostInputType }
      }
    },
    deletePost: {
      type: UUIDType,
      args: {
        id: getUUId()
      }
    },
    createProfile: {
      type: profileType,
      args: {
        dto: { type: createProfileInputType }
      }
    },
    changeProfile: {
      type: profileType,
      args: {
        id: getUUId(),
        dto: { type: changeProfileInputType }
      }
    },
    deleteProfile: {
      type: UUIDType,
      args: {
        id: getUUId()
      }
    },
    subscribeTo: {
      type: userType,
      args: getArgs()
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: getArgs()
    }
  }
});

export const gqlSchema = new GraphQLSchema({ query, mutation });
