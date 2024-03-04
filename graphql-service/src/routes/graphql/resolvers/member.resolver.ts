import { Context } from "node:vm";
import { ID, NoArgs } from "../types/dtos.model.js";

const getMemberType = async ({ id }: ID, { prisma }: Context) => {
  return prisma.memberType.findUnique({ where: { id } });
}

const getMemberTypes = async (_: NoArgs, { prisma }: Context) => {
  return prisma.memberType.findMany();
}

export default {
  memberType: getMemberType,
  memberTypes: getMemberTypes,
};
