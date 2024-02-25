import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({
  errorFormat: 'pretty',
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
})

prisma.$on('query', (e) => {
  console.log('QUERY ––––––––––––––––––\n ' + e.query)
  console.log('PARAMS –––––––––––––––––\n ' + e.params)
  console.log('DURATION –––––––––––––––\n ' + e.duration + 'ms\n\n')
})

export { prisma }
