import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function seed() {
  // ----------------------------------------------------------------------------------------------
  // Delete all existing data
  // ----------------------------------------------------------------------------------------------
  await prisma.recipe.deleteMany()
  console.log('❌ Deleted records in recipe table')

  await prisma.user.deleteMany()
  console.log('❌ Deleted records in user table')

  await prisma.invitation.deleteMany()
  console.log('❌ Deleted records in invitation table')

  await prisma.organization.deleteMany()
  console.log('❌ Deleted records in organization table')

  await prisma.mealType.deleteMany()
  console.log('❌ Deleted records in meal type table')

  await prisma.cuisine.deleteMany()
  console.log('❌ Deleted records in cuisine table')

  // ----------------------------------------------------------------------------------------------
  // Create all global meal types
  // ----------------------------------------------------------------------------------------------
  const mealTypes = await Promise.all(
    getMealTypes().map((mealType) => {
      return prisma.mealType.create({ data: { name: mealType.name, order: mealType.order } })
    }),
  )

  console.log('✅ Created all global meal types')

  // ----------------------------------------------------------------------------------------------
  // Create all global cuisines
  // ----------------------------------------------------------------------------------------------
  const cuisines = await Promise.all(
    getCuisines().map((cuisine) => {
      return prisma.cuisine.create({ data: { name: cuisine } })
    }),
  )

  console.log('✅ Created all global cuisines')

  // ----------------------------------------------------------------------------------------------
  // Create org 1
  // ----------------------------------------------------------------------------------------------
  const org1 = await prisma.organization.create({
    data: {
      name: 'Familjen Wallström',
      invitations: {
        create: {},
      },
    },
  })

  console.log('✅ Created org 1')

  // ----------------------------------------------------------------------------------------------
  // Create org 2
  // ----------------------------------------------------------------------------------------------
  const org2 = await prisma.organization.create({
    data: {
      name: 'The Doe Family',
      invitations: {
        create: {},
      },
    },
  })

  console.log('✅ Created org 2')

  // ----------------------------------------------------------------------------------------------
  // Prepare hashed password
  // ----------------------------------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash('qwerty', 10)

  // ----------------------------------------------------------------------------------------------
  // Create OWNER for org 1
  // ----------------------------------------------------------------------------------------------
  await prisma.user.create({
    data: {
      email: 'simon@wallstrom.com',
      firstName: 'Simon',
      lastName: 'Wallström',
      role: 'OWNER',
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      organization: {
        connect: {
          id: org1.id,
        },
      },
      recipes: {
        create: {
          ...recipes[0], // Lasagna
          organizationId: org1.id,
          mealTypeId: mealTypes[2]?.id, // Weeknight Dinner
          cuisineId: cuisines[10]?.id, // Italian
        },
      },
    },
  })

  console.log('✅ Created OWNER for org 1')

  // ----------------------------------------------------------------------------------------------
  // Create MEMBER for org 1
  // ----------------------------------------------------------------------------------------------
  await prisma.user.create({
    data: {
      email: 'lisa@wallstrom.com',
      firstName: 'Lisa',
      lastName: 'Wallström',
      role: 'MEMBER',
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      organization: {
        connect: {
          id: org1.id,
        },
      },
      recipes: {
        create: {
          ...recipes[1], // Smash burger
          organizationId: org1.id,
          mealTypeId: mealTypes[4]?.id, // Main course
          cuisineId: cuisines[1]?.id, // American
        },
      },
    },
  })

  console.log('✅ Created MEMBER for org 1')

  // ----------------------------------------------------------------------------------------------
  // Create OWNER for org 2
  // ----------------------------------------------------------------------------------------------
  await prisma.user.create({
    data: {
      email: 'john@doe.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'OWNER',
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      organization: {
        connect: {
          id: org2.id,
        },
      },
      recipes: {
        create: {
          ...recipes[2], // Tuna
          organizationId: org2.id,
          mealTypeId: mealTypes[2]?.id, // Weeknight dinner
          cuisineId: cuisines[15]?.id, // Nordic
        },
      },
    },
  })

  console.log('✅ Created OWNER for org 2')
}

seed()

function getMealTypes() {
  return [
    { name: 'Breakfast', order: 1 },
    { name: 'Lunch', order: 2 },
    { name: 'Weeknight Dinner', order: 3 },
    { name: 'Appetizers', order: 4 },
    { name: 'Main Courses', order: 5 },
    { name: 'Sides', order: 6 },
    { name: 'Sauces', order: 7 },
    { name: 'Desserts', order: 8 },
    { name: 'Baking', order: 9 },
  ]
}

function getCuisines() {
  return [
    'African',
    'American',
    'British',
    'Caribbean',
    'Chinese',
    'East European',
    'French',
    'Greek',
    'Indian',
    'Irish',
    'Italian',
    'Japanese',
    'Korean',
    'Mexican',
    'Middle Eastern',
    'Nordic',
    'North African',
    'Pakistani',
    'Portuguese',
    'South-East Asian',
    'South American',
    'Spanish',
  ]
}

const recipes = [
  {
    title: 'Lasagne med soltorkade tomater',
    servings: 4,
    ingredients:
      'Bechamelsås:\nSalt\nPeppar\n3 dl crème fraîche\n2 dl grädde\n2 klyftor vitlök\n100 g grottlagrad 24 månader parmesanost\n\nKöttfärssåsen:\n600 g nötfärs\n1 gul lök (stor)\n0,5 purjolök\n1 zucchini\n1 dl rött vin\n500 g krossade tomater\n2 tsk dragon\n\nGarnering:\nPersilja',
    instructions:
      'Bechamelsås:\nSmält smöret i en kastrull. Vispa ner mjölet.\nTillsätt mjölken lite i taget, koka upp och låt koka under fortsatt vispning 3-5 min. Smaka av med salt och peppar.\n\nKöttfärssåsen:\nBryn färsen i en kastrull. Skala och skär lök och purjolök.\nSkär zucchinin i små bitar och stek den tillsammans med löken och solroskärnor.\nBlanda färsen med lökblandningen, rött vin, krossade tomater och alla kryddor till en smakrik köttfärssås. Låt sjuda i ca 10 minuter.\nVarva köttfärssås, gräddblandningen och lasagneplattor i en form. Avsluta med ett fint lager riven Grana Padano på toppen.\nTillaga lasagnen i ugnen på 225 grader i cirka 20-30 minuter, tills den har fått fin färg.',
  },
  {
    title: 'Smash burger med karamelliserad lök',
    servings: 4,
    ingredients:
      'Bechamelsås:\nSalt\nPeppar\n3 dl crème fraîche\n2 dl grädde\n2 klyftor vitlök\n100 g grottlagrad 24 månader parmesanost\n\nKöttfärssåsen:\n600 g nötfärs\n1 gul lök (stor)\n0,5 purjolök\n1 zucchini\n1 dl rött vin\n500 g krossade tomater\n2 tsk dragon\n\nGarnering:\nPersilja',
    instructions:
      'Bechamelsås:\nSmält smöret i en kastrull. Vispa ner mjölet.\nTillsätt mjölken lite i taget, koka upp och låt koka under fortsatt vispning 3-5 min. Smaka av med salt och peppar.\n\nKöttfärssåsen:\nBryn färsen i en kastrull. Skala och skär lök och purjolök.\nSkär zucchinin i små bitar och stek den tillsammans med löken och solroskärnor.\nBlanda färsen med lökblandningen, rött vin, krossade tomater och alla kryddor till en smakrik köttfärssås. Låt sjuda i ca 10 minuter.\nVarva köttfärssås, gräddblandningen och lasagneplattor i en form. Avsluta med ett fint lager riven Grana Padano på toppen.\nTillaga lasagnen i ugnen på 225 grader i cirka 20-30 minuter, tills den har fått fin färg.',
  },
  {
    title: 'Tonfisk i currysås med ris',
    servings: 4,
    ingredients:
      '2 burkar tonfisk i vatten\n1 gullök\n2 vitlöksklyftor\n1 röd paprika\n2 tsk curry\n1 tsk gurkmeja\n1 msk kycklingfond\n5 dl crème fraiche',
    instructions:
      'Låt tonfisken rinna av.\nHacka lök och vitlök och fräs dem tills löken mjuknar.\nHacka paprikan och blanda i stekpannan tillsammans med löken.\nTillsätt curry och gurkmeja och fräs allting i 2-3 min.\nHäll i grädde, crème fraîche, kycklingfond och koka upp allting. Låt sjuda långsamt i ca 10-15 min. Smaka av och krydda eventuellt mer.\nVänd i tonfisken försiktigt utan att smula till den för mycket.\nStäng av värmen och servera med ris.',
  },
]
