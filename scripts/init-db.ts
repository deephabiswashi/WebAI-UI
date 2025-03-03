import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create initial global settings
  await prisma.globalSettings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      theme: 'light',
      apiEndpoint: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    },
  })

  console.log('Database initialized successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 