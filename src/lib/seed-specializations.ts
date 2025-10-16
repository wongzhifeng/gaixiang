import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 初始专长数据 - 基于纳瓦尔理念的稀缺专长
const initialSpecializations = [
  {
    name: '儿童围棋启蒙',
    description: '专业的儿童围棋教学，培养逻辑思维和专注力',
    category: '教育',
    subcategory: '棋类教学',
    scarcity: 8,
    demandLevel: 7,
    avgPrice: 200,
    verificationType: 'CERTIFICATE',
    minCaseCount: 3,
  },
  {
    name: '老房水电改造',
    description: '老旧小区水电系统改造与维修，经验丰富',
    category: '维修',
    subcategory: '水电维修',
    scarcity: 9,
    demandLevel: 9,
    avgPrice: 500,
    verificationType: 'CASE',
    minCaseCount: 5,
  },
  {
    name: '钢琴私教',
    description: '个性化钢琴教学，适合各年龄段学员',
    category: '教育',
    subcategory: '音乐教学',
    scarcity: 7,
    demandLevel: 8,
    avgPrice: 150,
    verificationType: 'CERTIFICATE',
    minCaseCount: 2,
  },
  {
    name: '宠物殡葬服务',
    description: '专业的宠物善后服务，尊重生命，贴心关怀',
    category: '生活',
    subcategory: '宠物服务',
    scarcity: 10,
    demandLevel: 6,
    avgPrice: 300,
    verificationType: 'NONE',
    minCaseCount: 0,
  },
  {
    name: '淮扬菜私房宴席',
    description: '正宗淮扬菜私房宴席制作，适合家庭聚会',
    category: '生活',
    subcategory: '烹饪服务',
    scarcity: 8,
    demandLevel: 7,
    avgPrice: 800,
    verificationType: 'CASE',
    minCaseCount: 3,
  },
  {
    name: '儿童编程启蒙',
    description: 'Scratch编程教学，培养孩子的计算思维',
    category: '教育',
    subcategory: '编程教学',
    scarcity: 8,
    demandLevel: 8,
    avgPrice: 180,
    verificationType: 'CERTIFICATE',
    minCaseCount: 2,
  },
  {
    name: '古籍修复',
    description: '专业古籍修复与保护，传承文化遗产',
    category: '文化',
    subcategory: '文物修复',
    scarcity: 10,
    demandLevel: 5,
    avgPrice: 1000,
    verificationType: 'CERTIFICATE',
    minCaseCount: 5,
  },
  {
    name: '家庭园艺设计',
    description: '阳台、庭院园艺设计与种植指导',
    category: '生活',
    subcategory: '园艺服务',
    scarcity: 7,
    demandLevel: 6,
    avgPrice: 400,
    verificationType: 'CASE',
    minCaseCount: 3,
  },
]

async function seedSpecializations() {
  try {
    console.log('开始导入初始专长数据...')

    // 清空现有数据（可选）
    // await prisma.userSpecialization.deleteMany()
    // await prisma.specialization.deleteMany()

    // 检查是否已有数据
    const existingCount = await prisma.specialization.count()
    if (existingCount > 0) {
      console.log(`数据库中已有 ${existingCount} 个专长定义，跳过导入`)
      return
    }

    // 导入初始专长数据
    for (const specData of initialSpecializations) {
      await prisma.specialization.create({
        data: specData,
      })
      console.log(`已创建专长: ${specData.name}`)
    }

    console.log('初始专长数据导入完成！')
    console.log(`共导入 ${initialSpecializations.length} 个专长定义`)

    // 打印专长统计
    const categories = await prisma.specialization.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
    })

    console.log('\n专长分类统计:')
    categories.forEach(cat => {
      console.log(`  ${cat.category}: ${cat._count.id} 个专长`)
    })

  } catch (error) {
    console.error('导入专长数据时出错:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// 如果直接运行此文件，则执行种子脚本
if (require.main === module) {
  seedSpecializations()
}

export { seedSpecializations, initialSpecializations }