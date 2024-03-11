import { MemberType, PrismaClient, Profile } from "@prisma/client";
import DataLoader from "dataloader";
import { MemberTypeId } from "../member-types/schemas.js";
import { PostDto, UserDto } from "./types/dtos.model.js";

export interface DataLoaders {
  postsByAuthorIdLoader: DataLoader<string, PostDto[]>,
  profileByUserIdLoader: DataLoader<string, Profile>,
  profilesByMemberTypeIdLoader: DataLoader<string, Profile[]>,
  memberTypeLoader: DataLoader<MemberTypeId, MemberType>,
  userLoader: DataLoader<string, UserDto>,
}

export const facadeDataLoaders = (prisma: PrismaClient): DataLoaders => {
  
  const getUserById = async (ids: readonly string[]) => {
    const users = await prisma.user.findMany({
      where: { id: { in: ids as string[] } },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true
      }
    });
    
    return ids.map(id => users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {})[id]);
  };
  
  const getPostsByAuthorId = async (ids: readonly string[]) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: ids as string[] } }
    });
    
    return ids.map(id => posts.reduce((acc, post) => {
      const id = post.authorId;
      acc[id] = acc[id] ? acc[id].concat(post) : [post];
      return acc;
    }, {})[id]);
  };
  
  const getProfileByUserId = async (ids: readonly string[]) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: ids as string[] } }
    });
    
    return ids.map(id => profiles.reduce((acc, profile) => {
      acc[profile.userId] = profile;
      return acc;
    }, {})[id]);
  };
  
  const getProfilesByMemberTypeId = async (ids: readonly MemberTypeId[]) => {
    const profiles = await prisma.profile.findMany({
      where: { memberTypeId: { in: ids as MemberTypeId[] } }
    });
    
    return ids.map(id => profiles.reduce((acc, profile) => {
      const id = profile.memberTypeId;
      acc[id] = acc[id] ? acc[id].concat(profile) : [profile];
      return acc;
    }, {})[id]);
  };
  
  const getMemberType = async (ids: readonly MemberTypeId[]) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids as MemberTypeId[] } }
    });
    
    return ids.map(id => memberTypes.reduce((acc, memberType) => {
      acc[memberType.id] = memberType;
      return acc;
    }, {})[id]);
  };
  
  return {
    postsByAuthorIdLoader: new DataLoader(getPostsByAuthorId),
    profileByUserIdLoader: new DataLoader(getProfileByUserId),
    profilesByMemberTypeIdLoader: new DataLoader(getProfilesByMemberTypeId),
    memberTypeLoader: new DataLoader(getMemberType),
    userLoader: new DataLoader(getUserById)
  };
};
