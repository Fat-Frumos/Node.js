import { ID, NoArgs, ProfileInputDto } from "../types/dtos.model.js";
import { Context } from "node:vm";

const getProfile = async ({ id }: ID, { prisma }: Context) => {
  return await prisma.profile.findUnique({ where: { id } });
};

const getProfiles = async (_: NoArgs, { prisma }: Context) => {
  return await prisma.profile.findMany();
}

const createProfile = async ({ dto: data}: { dto: ProfileInputDto }, { prisma }: Context) => {
    return await prisma.profile.create({ data }).catch(()=> null);
};

const changeProfile = async ({ id, dto: data}: ID & { dto: Partial<ProfileInputDto> }, { prisma }: Context) => {
    return prisma.profile.update({ where: { id }, data }).catch(()=> null);
};

const deleteProfile = async ({ id }: ID, { prisma }: Context) => {
  try {
    await prisma.profile.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
};

export default {
  profile: getProfile,
  profiles: getProfiles,
  createProfile,
  changeProfile,
  deleteProfile,
};
