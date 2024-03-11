import { DataLoaders } from "../facade.js";
import { PrismaClient } from "@prisma/client";
import { MemberTypeId } from "../../member-types/schemas.js";

export interface PostInputDto {
  title: string;
  content: string;
  authorId: string;
}

export interface PostDto extends ID, PostInputDto {}

export interface ProfileDto extends ID, ProfileInputDto {
}

export interface ProfileInputDto {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: MemberTypeId;
  userId: string;
}

export interface MemberTypeDto {
  id: MemberTypeId,
  discount: number,
  postsLimitPerMonth: number
}

export interface UserInputDto {
  name: string;
  balance: number;
}

export interface UserDto extends ID, UserInputDto {
  userSubscribedTo?: Subscription[];
  subscribedToUser?: Subscription[];
}

export interface ID {
  id: string;
}

export interface Subscription {
  subscriberId: string;
  authorId: string;
}

export interface SubscriptionMutationInput {
  userId: string;
  authorId: string;
}

export type NoArgs = Record<string | number | symbol, never>;

export interface Context extends DataLoaders {
  prisma: PrismaClient;
}
