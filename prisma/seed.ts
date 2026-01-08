import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding users...')
  const adminPassword = await bcrypt.hash('jose32neitor', 10)
  const inspectoriaPassword = await bcrypt.hash('2026', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      // Optional: update password if you want to reset it on seed
      // passwordHash: adminPassword, 
    },
    create: {
      username: 'admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  })

  const inspectoria = await prisma.user.upsert({
    where: { username: 'inspectoria' },
    update: {
       // Optional: update password if you want to reset it on seed
       // passwordHash: inspectoriaPassword,
    },
    create: {
      username: 'inspectoria',
      passwordHash: inspectoriaPassword,
      role: Role.INSPECTORIA,
    },
  })

  console.log('Users seeded:', { admin: admin.username, inspectoria: inspectoria.username })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
