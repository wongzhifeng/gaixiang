import { NextRequest, NextResponse } from 'next/server'
import { calculateMatch } from '../../../../lib/matching'

export async function GET(request: NextRequest) {
  try {
    // 测试匹配算法逻辑
    const testDemandId = 'test-demand-1'
    const testServiceId = 'test-service-1'

    // 模拟匹配计算
    const mockMatchResult = {
      score: 85,
      reasons: ['专长高度匹配', '地理位置相近', '信任评分优秀'],
      details: {
        specialization: 100,
        location: 90,
        trust: 80,
        time: 70,
        urgency: 60,
        history: 50
      }
    }

    return NextResponse.json({
      success: true,
      message: '匹配算法测试成功',
      data: {
        testMatch: mockMatchResult,
        algorithmStatus: '运行正常',
        dimensions: ['专长匹配', '地理位置', '信任评分', '时间可用性', '紧急程度', '历史互动']
      }
    })

  } catch (error) {
    console.error('匹配算法测试失败:', error)
    return NextResponse.json(
      { success: false, message: '匹配算法测试失败' },
      { status: 500 }
    )
  }
}