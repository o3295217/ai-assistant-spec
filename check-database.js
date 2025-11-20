const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDB() {
  console.log('🔍 Проверка базы данных...\n')

  try {
    // Check tables
    const criteria = await prisma.evaluationCriteria.findMany()
    console.log(`✅ evaluation_criteria: ${criteria.length} записей`)

    const userCriteria = await prisma.userSelectedCriteria.findMany()
    console.log(`✅ user_selected_criteria: ${userCriteria.length} записей`)

    const dailyEntries = await prisma.dailyEntry.findMany()
    console.log(`✅ daily_entries: ${dailyEntries.length} записей`)

    const dreamGoals = await prisma.dreamGoal.findMany()
    console.log(`✅ dream_goal: ${dreamGoals.length} записей`)

    console.log('\n🎯 Критерии оценки:')
    const selectedCriteria = await prisma.userSelectedCriteria.findMany({
      where: { userId: 1, isEnabled: true },
      include: { criteria: true },
      orderBy: { order: 'asc' }
    })

    if (selectedCriteria.length > 0) {
      selectedCriteria.forEach(sc => {
        console.log(`  - ${sc.criteria.nameRu} (${sc.criteria.category})`)
      })
    } else {
      console.log('  ⚠️  Нет выбранных критериев!')
    }

    console.log('\n✅ База данных в порядке!')

  } catch (error) {
    console.error('❌ Ошибка:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkDB()
