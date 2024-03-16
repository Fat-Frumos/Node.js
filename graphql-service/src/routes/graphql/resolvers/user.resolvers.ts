import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType
} from "graphql-parse-resolve-info";
import { getUserTypeGraphQLList } from "../types/user.js";
import { GraphQLResolveInfo } from "graphql";
import {
  Context,
  ID,
  NoArgs,
  SubscriptionMutationInput,
  UserInputDto
} from "../types/dtos.model.js";

const getUser = async ({ id }: ID, { userLoader }: Context) => {
  return await userLoader.load(id);
};

const getUsers = async (_: NoArgs, { prisma, userLoader }: Context, resolveInfo: GraphQLResolveInfo) => {
  const { fields }: {
    fields: { [key in string]: ResolveTree }
  } = simplifyParsedResolveInfoFragmentWithType(
    parseResolveInfo(resolveInfo) as ResolveTree,
    getUserTypeGraphQLList()
  );
  
  const users = await prisma.user.findMany({
    include: {
      userSubscribedTo: !!fields.userSubscribedTo,
      subscribedToUser: !!fields.subscribedToUser
    }
  });
  
  users.forEach(user => {
    userLoader.prime(user.id, user);
  });
  
  return users;
};

const createUser = async ({ dto: data }: {
  dto: UserInputDto
}, { prisma }: Context) => {
  return prisma.user.create({ data });
};

const changeUser = async ({ id, dto: data }: ID & { dto: Partial<UserInputDto> }, { prisma }: Context) => {
    return prisma.user.update({ where: { id }, data }).catch(() => null);
};

const deleteUser = async ({ id }: ID, { prisma }: Context) => {
  try {
    await prisma.user.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
};

const subscribeTo = async ({ userId: id, authorId }: SubscriptionMutationInput, { prisma }: Context) => {
      return prisma.user.update({
      where: { id },
      data: { userSubscribedTo: { create: { authorId } } }
    }).catch(() => null);
};

const unsubscribeFrom = async ({ userId: subscriberId, authorId
}: SubscriptionMutationInput, { prisma }: Context) => {
    await prisma.subscribersOnAuthors.delete({
      where: { subscriberId_authorId: { subscriberId, authorId } }
    }).catch(() => null);
};

export default {
  user: getUser,
  users: getUsers,
  createUser,
  changeUser,
  deleteUser,
  subscribeTo,
  unsubscribeFrom
};
