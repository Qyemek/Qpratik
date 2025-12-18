import { PrismaClient, LanguageLevel, ContentType, QuestionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@qpratik.com' },
    update: {},
    create: {
      email: 'admin@qpratik.com',
      username: 'admin',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isEmailVerified: true,
      acceptedTerms: true,
      acceptedPrivacy: true,
      userStats: { create: {} },
    },
  });

  console.log('✅ Admin user created');

  // Create badges
  const badges = [
    {
      name: 'first_lesson',
      nameEn: 'First Steps',
      nameTr: 'İlk Adımlar',
      description: 'Complete your first lesson',
      descriptionEn: 'Complete your first lesson',
      descriptionTr: 'İlk dersini tamamla',
      iconUrl: '/badges/first-lesson.svg',
      requirement: 'complete_1_lesson',
    },
    {
      name: 'beginner',
      nameEn: 'Beginner',
      nameTr: 'Başlangıç',
      description: 'Reach A2 level',
      descriptionEn: 'Reach A2 level',
      descriptionTr: 'A2 seviyesine ulaş',
      iconUrl: '/badges/beginner.svg',
      requirement: 'reach_A2',
    },
    {
      name: 'intermediate',
      nameEn: 'Intermediate',
      nameTr: 'Orta Seviye',
      description: 'Reach B1 level',
      descriptionEn: 'Reach B1 level',
      descriptionTr: 'B1 seviyesine ulaş',
      iconUrl: '/badges/intermediate.svg',
      requirement: 'reach_B1',
    },
    {
      name: 'social_butterfly',
      nameEn: 'Social Butterfly',
      nameTr: 'Sosyal Kelebek',
      description: 'Make 10 friends',
      descriptionEn: 'Make 10 friends',
      descriptionTr: '10 arkadaş edin',
      iconUrl: '/badges/social.svg',
      requirement: 'make_10_friends',
    },
    {
      name: 'streak_master',
      nameEn: 'Streak Master',
      nameTr: 'Süreklilik Ustası',
      description: 'Maintain a 7-day streak',
      descriptionEn: 'Maintain a 7-day streak',
      descriptionTr: '7 günlük seri oluştur',
      iconUrl: '/badges/streak.svg',
      requirement: '7_day_streak',
    },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }

  console.log('✅ Badges created');

  // Create content for each level
  const levels: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  for (const level of levels) {
    // Grammar content
    await prisma.content.create({
      data: {
        type: 'GRAMMAR',
        level,
        title: `${level} Grammar Basics`,
        titleEn: `${level} Grammar Basics`,
        titleTr: `${level} Dilbilgisi Temelleri`,
        description: `Essential grammar rules for ${level} level`,
        descriptionEn: `Essential grammar rules for ${level} level`,
        descriptionTr: `${level} seviyesi için temel dilbilgisi kuralları`,
        content: `This is the grammar content for ${level} level...`,
        contentEn: `This is the grammar content for ${level} level...`,
        contentTr: `Bu ${level} seviyesi için dilbilgisi içeriğidir...`,
        order: 1,
        xpReward: 10,
      },
    });

    // Vocabulary content
    await prisma.content.create({
      data: {
        type: 'VOCABULARY',
        level,
        title: `${level} Essential Vocabulary`,
        titleEn: `${level} Essential Vocabulary`,
        titleTr: `${level} Temel Kelimeler`,
        description: `Important words and phrases for ${level} level`,
        descriptionEn: `Important words and phrases for ${level} level`,
        descriptionTr: `${level} seviyesi için önemli kelime ve ifadeler`,
        content: `Vocabulary list for ${level}...`,
        contentEn: `Vocabulary list for ${level}...`,
        contentTr: `${level} için kelime listesi...`,
        order: 2,
        xpReward: 15,
      },
    });

    // Daily expressions
    await prisma.content.create({
      data: {
        type: 'DAILY_EXPRESSIONS',
        level,
        title: `${level} Daily Expressions`,
        titleEn: `${level} Daily Expressions`,
        titleTr: `${level} Günlük İfadeler`,
        description: `Common expressions for everyday conversations`,
        descriptionEn: `Common expressions for everyday conversations`,
        descriptionTr: `Günlük konuşmalar için yaygın ifadeler`,
        content: `Daily expressions for ${level}...`,
        contentEn: `Daily expressions for ${level}...`,
        contentTr: `${level} için günlük ifadeler...`,
        order: 3,
        xpReward: 10,
      },
    });

    // Create test for each level
    const test = await prisma.test.create({
      data: {
        level,
        title: `${level} Level Test`,
        titleEn: `${level} Level Test`,
        titleTr: `${level} Seviye Testi`,
        description: `Comprehensive test for ${level} level`,
        descriptionEn: `Comprehensive test for ${level} level`,
        descriptionTr: `${level} seviyesi için kapsamlı test`,
        duration: 30,
        passingScore: 70,
      },
    });

    // Create sample questions
    await prisma.question.createMany({
      data: [
        {
          testId: test.id,
          type: 'MULTIPLE_CHOICE',
          question: 'What is the correct form of the verb?',
          questionEn: 'What is the correct form of the verb?',
          questionTr: 'Fiilin doğru hali nedir?',
          options: JSON.stringify(['go', 'goes', 'going', 'gone']),
          correctAnswer: 'goes',
          explanation: 'Third person singular uses "goes"',
          explanationEn: 'Third person singular uses "goes"',
          explanationTr: 'Üçüncü tekil şahıs "goes" kullanır',
          points: 1,
          order: 1,
        },
        {
          testId: test.id,
          type: 'FILL_BLANK',
          question: 'She _____ to school every day.',
          questionEn: 'She _____ to school every day.',
          questionTr: 'O her gün okula _____.',
          correctAnswer: 'goes',
          explanation: 'Present simple tense',
          explanationEn: 'Present simple tense',
          explanationTr: 'Geniş zaman',
          points: 1,
          order: 2,
        },
      ],
    });
  }

  console.log('✅ Content and tests created');

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
