import { PrismaClient } from ".prisma/client";

const prisma = new PrismaClient()

function list (job?: string) {
  if (job) return prisma.unitCode.findMany({ where: { property: job }})  
  return prisma.unitCode.findMany()
}

function get (unit, property) {
  return prisma.unitCode.findFirst({
    where: {
      unit,
      property,
    }
  })  
}

function create (data) {
  return prisma.unitCode.create({
    data, 
  })
}

async function update (id: number, data) {
  const updateRes = await prisma.unitCode.update({
    where: { id: Number(id) },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
  if (updateRes.id) { // May be a way to do with with the update
    return prisma.unitCode.findUnique({
      where: { id: updateRes.id },
    })
  }
}

async function del (id: number) {
  const devToDelete = await prisma.unitCode.findUnique({ where: { id }})
  if (!devToDelete) return Promise.reject(`unitCode not found`)

  return prisma.unitCode.delete({ where: { id }})
}

async function listProperties () {
  const uniques = (await prisma.unitCode.findMany({
    distinct: [`property`]
  })).sort(sortMostRecent)
  return uniques.map(x => x.property)
}

function sortMostRecent (a, b) {
  if (new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()) return 1
  if (new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime()) return -1
  return 0 
}

export default {
  get,
  list,
  create,
  del,
  update,
  listProperties,
}