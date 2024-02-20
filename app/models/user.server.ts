import type { Password, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma } from '~/lib/prisma.server'
export type { User } from '@prisma/client'

export async function getUserById(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
    include: { organization: true },
  })
}

export async function getUserByEmail(email: User['email']) {
  return prisma.user.findUnique({ where: { email } })
}

type createUser = {
  firstName: User['firstName']
  lastName: User['lastName']
  email: User['email']
  password: string
}

export async function createUser(user: createUser) {
  const hashedPassword = await bcrypt.hash(user.password, 10)

  const createdUser = await prisma.user.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      organization: {
        create: {
          name: `The ${user.lastName} family`,
        },
      },
    },
  })

  await prisma.invitation.create({
    data: {
      organizationId: createdUser.organizationId,
    },
  })

  return createdUser
}

export async function createInvitedUser(user: createUser & { organizationId: string }) {
  const hashedPassword = await bcrypt.hash(user.password, 10)

  return prisma.user.create({
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      organizationId: user.organizationId,
    },
  })
}

export async function verifyLogin(email: User['email'], password: Password['hash']) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
      organization: true,
    },
  })

  if (!userWithPassword || !userWithPassword.password) {
    return null
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password.hash)

  if (!isValid) {
    return null
  }

  // if (userWithPassword.status === 'PENDING') {
  //   return null
  // }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { password: _password, ...userWithoutPassword } = userWithPassword

  return userWithoutPassword
}
