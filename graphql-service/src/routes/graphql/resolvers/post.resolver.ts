
import { Context } from "node:vm";
import { ID, NoArgs, PostInputDto } from "../types/dtos.model.js";

const getPost = async ({ id }: ID, { prisma }: Context) => {
  return await prisma.post.findUnique({ where: { id } });
};

const getPosts = async (_: NoArgs, { prisma }: Context) => {
  return await prisma.post.findMany();
};

const createPost = async ({ dto: data }: { dto: PostInputDto }, { prisma }: Context) => {
  return await prisma.post.create({ data });
};

const changePost = async ({ id, dto: data}: ID & { dto: Partial<PostInputDto> }, { prisma }: Context) => {
  return prisma.post.update({ where: { id }, data }).catch(()=> null);
};

const deletePost = async ({ id }: ID, { prisma }: Context) => {
  try {
    await prisma.post.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
};

export default {
  post: getPost,
  posts: getPosts,
  createPost,
  changePost,
  deletePost,
};
