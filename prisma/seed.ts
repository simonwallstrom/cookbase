import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function seed() {
  // 1. Delete all existing data
  await prisma.recipe.deleteMany()
  console.log('❌ Deleted records in recipe table')

  await prisma.user.deleteMany()
  console.log('❌ Deleted records in user table')

  await prisma.organization.deleteMany()
  console.log('❌ Deleted records in organization table')

  await prisma.mealType.deleteMany()
  console.log('❌ Deleted records in meal type table')

  await prisma.cuisine.deleteMany()
  console.log('❌ Deleted records in cuisine table')

  // 2. Create all global meal types
  const mealTypes = await Promise.all(
    getMealTypes().map((mealType) => {
      return prisma.mealType.create({ data: { name: mealType.name, order: mealType.order } })
    }),
  )

  console.log('✅ Created all global meal types')

  // 3. Create all global cuisines
  const cuisines = await Promise.all(
    getCuisines().map((cuisine) => {
      return prisma.cuisine.create({ data: { name: cuisine } })
    }),
  )

  console.log('✅ Created all global cuisines')

  // 4. Create a user with a password and an organization
  const hashedPassword = await bcrypt.hash('qwerty', 10)

  const user = await prisma.user.create({
    data: {
      email: 'simon.wallstrom@gmail.com',
      firstName: 'Simon',
      lastName: 'Wallström',
      role: 'OWNER',
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      organization: {
        create: {
          name: 'Familjen Wallström',
        },
      },
    },
  })

  console.log('✅ Created a user with an organization')

  // 5. Create some recipes and assign it to the organization
  await Promise.all(
    getRecipes().map((recipe) => {
      const data = {
        organizationId: user.organizationId,
        userId: user.id,
        mealTypeId: mealTypes[2]?.id, // Weeknight Dinner
        cuisineId: cuisines[10]?.id, // Italian
        ...recipe,
      }
      return prisma.recipe.create({ data })
    }),
  )

  console.log('✅ Created recipes')
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

function getRecipes() {
  return [
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
  ]
}
