const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const defaultCriteria = [
  { key: 'strategy', nameRu: 'Стратегическое развитие', nameEn: 'Strategic Development', category: 'work', description: 'Работа над долгосрочными целями и стратегическими инициативами', isDefault: true, order: 1 },
  { key: 'operations', nameRu: 'Операционное управление', nameEn: 'Operational Management', category: 'work', description: 'Выполнение текущих операционных задач и процессов', isDefault: true, order: 2 },
  { key: 'team', nameRu: 'Работа с командой', nameEn: 'Team Management', category: 'work', description: 'Взаимодействие с командой, делегирование, менторинг', isDefault: true, order: 3 },
  { key: 'efficiency', nameRu: 'Эффективность времени', nameEn: 'Time Efficiency', category: 'work', description: 'Оптимальное использование времени и ресурсов', isDefault: true, order: 4 },
  { key: 'relationships', nameRu: 'Личные отношения', nameEn: 'Personal Relationships', category: 'personal', description: 'Качество отношений с близкими людьми', isDefault: false, order: 5 },
  { key: 'family', nameRu: 'Семья', nameEn: 'Family', category: 'personal', description: 'Время и забота о семье', isDefault: false, order: 6 },
  { key: 'friends', nameRu: 'Друзья и социальная жизнь', nameEn: 'Friends & Social', category: 'personal', description: 'Общение с друзьями и социальная активность', isDefault: false, order: 7 },
  { key: 'learning', nameRu: 'Обучение', nameEn: 'Learning', category: 'development', description: 'Изучение нового, курсы, книги', isDefault: false, order: 8 },
  { key: 'skills', nameRu: 'Развитие навыков', nameEn: 'Skills Development', category: 'development', description: 'Практика и улучшение профессиональных навыков', isDefault: false, order: 9 },
  { key: 'career', nameRu: 'Карьерный рост', nameEn: 'Career Growth', category: 'development', description: 'Действия для продвижения по карьерной лестнице', isDefault: false, order: 10 },
  { key: 'physical_health', nameRu: 'Физическое здоровье', nameEn: 'Physical Health', category: 'health', description: 'Спорт, питание, сон, общее физическое состояние', isDefault: false, order: 11 },
  { key: 'mental_health', nameRu: 'Ментальное здоровье', nameEn: 'Mental Health', category: 'health', description: 'Психологическое состояние, стресс, эмоциональный баланс', isDefault: false, order: 12 },
  { key: 'goals', nameRu: 'Достижение целей', nameEn: 'Goal Achievement', category: 'achievements', description: 'Прогресс в достижении поставленных целей', isDefault: false, order: 13 },
  { key: 'results', nameRu: 'Конкретные результаты', nameEn: 'Tangible Results', category: 'achievements', description: 'Измеримые результаты и достижения дня', isDefault: false, order: 14 },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Seed evaluation criteria
  console.log('📊 Inserting evaluation criteria...')
  for (const criteria of defaultCriteria) {
    await prisma.evaluationCriteria.upsert({
      where: { key: criteria.key },
      update: {},
      create: criteria,
    })
  }

  // Insert default selected criteria for user 1
  console.log('✅ Setting default criteria for user...')
  const defaultCriteriaIds = await prisma.evaluationCriteria.findMany({
    where: { isDefault: true },
    select: { id: true, order: true }
  })

  for (const criteria of defaultCriteriaIds) {
    await prisma.userSelectedCriteria.upsert({
      where: {
        userId_criteriaId: {
          userId: 1,
          criteriaId: criteria.id
        }
      },
      update: {},
      create: {
        userId: 1,
        criteriaId: criteria.id,
        isEnabled: true,
        order: criteria.order
      }
    })
  }

  console.log('✅ Seeding completed!')
  console.log(`📊 Created ${defaultCriteria.length} criteria`)
  console.log(`👤 Set ${defaultCriteriaIds.length} default criteria for user`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
