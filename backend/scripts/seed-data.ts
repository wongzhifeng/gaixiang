import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始写入测试数据...');

  // 清理现有数据
  await prisma.match.deleteMany();
  await prisma.response.deleteMany();
  await prisma.demand.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  console.log('清理完成，开始创建用户...');

  // 创建测试用户
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'zhang@example.com',
        name: '张阿姨',
        phone: '13800138001',
        locationText: '西湖区',
        trustLevel: 80,
        onlineStatus: true,
        isVerified: true,
        skills: JSON.stringify(['家电维修', '烹饪', '照看老人']),
        interests: JSON.stringify(['社区活动', '烹饪分享']),
        helpCount: 12,
        receiveCount: 5
      },
      {
        email: 'li@example.com',
        name: '李叔叔',
        phone: '13800138002',
        locationText: '江干区',
        trustLevel: 65,
        onlineStatus: false,
        isVerified: true,
        skills: JSON.stringify(['跑腿代购', '搬运', '修理']),
        interests: JSON.stringify(['健身', '社区服务']),
        helpCount: 8,
        receiveCount: 3
      },
      {
        email: 'wang@example.com',
        name: '王奶奶',
        phone: '13800138003',
        locationText: '上城区',
        trustLevel: 90,
        onlineStatus: true,
        isVerified: true,
        skills: JSON.stringify(['编织', '照看小孩', '传统手工艺']),
        interests: JSON.stringify(['传统文化', '社区教育']),
        helpCount: 20,
        receiveCount: 8
      },
      {
        email: 'chen@example.com',
        name: '陈医生',
        phone: '13800138004',
        locationText: '下城区',
        trustLevel: 95,
        onlineStatus: true,
        isVerified: true,
        skills: JSON.stringify(['医疗咨询', '急救知识', '健康指导']),
        interests: JSON.stringify(['健康科普', '社区义诊']),
        helpCount: 25,
        receiveCount: 2
      }
    ]
  });

  console.log('用户创建完成，开始创建需求和服...');

  // 获取创建的用户
  const createdUsers = await prisma.user.findMany();
  const zhangUser = createdUsers.find(u => u.name === '张阿姨');
  const liUser = createdUsers.find(u => u.name === '李叔叔');
  const wangUser = createdUsers.find(u => u.name === '王奶奶');
  const chenUser = createdUsers.find(u => u.name === '陈医生');

  if (!zhangUser || !liUser || !wangUser || !chenUser) {
    throw new Error('用户创建失败');
  }

  // 创建测试需求
  const demands = await prisma.demand.createMany({
    data: [
      {
        title: '帮忙买药',
        description: '需要帮忙去药店买降压药，老人行动不便',
        type: 'EMERGENCY',
        status: 'ACTIVE',
        urgency: 4,
        locationText: '西湖区',
        tags: JSON.stringify(['买药', '老人', '紧急']),
        category: '医疗',
        userId: zhangUser.id
      },
      {
        title: '修理门锁',
        description: '家里的门锁坏了，需要帮忙修理',
        type: 'REPAIR',
        status: 'COMPLETED',
        urgency: 3,
        locationText: '江干区',
        tags: JSON.stringify(['修理', '门锁', '家庭']),
        category: '维修',
        userId: liUser.id
      },
      {
        title: '照看小孩2小时',
        description: '需要临时照看3岁小孩2小时，有急事外出',
        type: 'CARE',
        status: 'ACTIVE',
        urgency: 3,
        locationText: '上城区',
        tags: JSON.stringify(['照看小孩', '临时', '紧急']),
        category: '育儿',
        userId: wangUser.id
      },
      {
        title: '健康咨询',
        description: '最近感觉身体不适，需要专业医疗建议',
        type: 'GENERAL',
        status: 'ACTIVE',
        urgency: 2,
        locationText: '下城区',
        tags: JSON.stringify(['医疗', '咨询', '健康']),
        category: '医疗',
        userId: chenUser.id
      }
    ]
  });

  // 创建测试服务
  const services = await prisma.service.createMany({
    data: [
      {
        title: '家电维修',
        description: '提供家电维修服务，经验丰富',
        type: 'REPAIR',
        status: 'ACTIVE',
        locationText: '西湖区',
        tags: JSON.stringify(['维修', '家电', '专业']),
        category: '维修',
        userId: zhangUser.id
      },
      {
        title: '跑腿代购',
        description: '提供跑腿代购服务，快速可靠',
        type: 'SHOPPING',
        status: 'PAUSED',
        locationText: '江干区',
        tags: JSON.stringify(['跑腿', '代购', '快速']),
        category: '生活服务',
        userId: liUser.id
      },
      {
        title: '传统手工艺教学',
        description: '教授传统编织和手工艺，适合老年人学习',
        type: 'TEACHING',
        status: 'ACTIVE',
        locationText: '上城区',
        tags: JSON.stringify(['教学', '手工艺', '传统文化']),
        category: '教育',
        userId: wangUser.id
      },
      {
        title: '免费健康咨询',
        description: '提供免费健康咨询和基础医疗建议',
        type: 'GENERAL',
        status: 'ACTIVE',
        locationText: '下城区',
        tags: JSON.stringify(['医疗', '咨询', '免费']),
        category: '医疗',
        userId: chenUser.id
      }
    ]
  });

  console.log('需求和服创建完成，开始创建匹配...');

  // 获取创建的需求和服务
  const createdDemands = await prisma.demand.findMany();
  const createdServices = await prisma.service.findMany();

  const buyMedicineDemand = createdDemands.find(d => d.title === '帮忙买药');
  const repairService = createdServices.find(s => s.title === '家电维修');
  const healthConsultDemand = createdDemands.find(d => d.title === '健康咨询');
  const healthConsultService = createdServices.find(s => s.title === '免费健康咨询');

  // 创建测试匹配
  if (buyMedicineDemand && repairService) {
    await prisma.match.create({
      data: {
        userAId: zhangUser.id,
        userBId: liUser.id,
        demandId: buyMedicineDemand.id,
        serviceId: repairService.id,
        score: 75,
        reason: '位置相近，技能匹配',
        type: 'DEMAND_SERVICE'
      }
    });
  }

  if (healthConsultDemand && healthConsultService) {
    await prisma.match.create({
      data: {
        userAId: chenUser.id,
        userBId: wangUser.id,
        demandId: healthConsultDemand.id,
        serviceId: healthConsultService.id,
        score: 90,
        reason: '专业医疗需求匹配',
        type: 'DEMAND_SERVICE'
      }
    });
  }

  console.log('测试数据写入完成！');
  console.log('用户数量:', createdUsers.length);
  console.log('需求数量:', createdDemands.length);
  console.log('服务数量:', createdServices.length);
}

main()
  .catch((e) => {
    console.error('写入测试数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });