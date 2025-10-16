'use client'

import { useState } from 'react'
import { User, Settings, Heart, Users, Clock, MapPin, Edit3 } from 'lucide-react'
import { mockUsers, getUserDemands, getUserServices, MockDemand, MockService, MockUser } from '../../lib/mock-data'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { useAuth } from '../../contexts/AuthContext'
import LoginPrompt from '../../components/auth/LoginPrompt'

// 模拟当前用户（后期替换为真实认证）
const currentUser = mockUsers[0]

type ProfileTab = 'info' | 'demands' | 'services' | 'history'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('info')
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: currentUser.name,
    location: currentUser.location,
    skills: currentUser.skills.join(', ')
  })
  const { isAuthenticated } = useAuth()

  const userDemands = getUserDemands(currentUser.id)
  const userServices = getUserServices(currentUser.id)

  const handleSave = () => {
    // 模拟保存用户信息
    setIsEditing(false)
    // 这里后期可以调用API更新用户信息
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 1000))}分钟前`
    } else if (diff < 24 * 60 * 60 * 1000) {
      return `${Math.floor(diff / (60 * 60 * 1000))}小时前`
    } else {
      return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'paused': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃中'
      case 'pending': return '待处理'
      case 'completed': return '已完成'
      case 'cancelled': return '已取消'
      case 'paused': return '已暂停'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部个人信息 - 响应式 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="responsive-container py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-7 h-7 sm:w-10 sm:h-10 text-primary-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                    className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-primary-500 focus:outline-none"
                  />
                ) : (
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userInfo.name}</h1>
                )}
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="p-1 sm:p-2 text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-600 text-sm sm:text-base">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>帮助 {currentUser.helpCount} 次</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>接受 {currentUser.receiveCount} 次</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>信任度 {currentUser.trustLevel}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 位置信息 - 响应式 */}
          <div className="flex items-center gap-2 text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
            {isEditing ? (
              <input
                type="text"
                value={userInfo.location}
                onChange={(e) => setUserInfo({...userInfo, location: e.target.value})}
                className="flex-1 border-b border-gray-300 focus:border-primary-500 focus:outline-none text-sm sm:text-base"
                placeholder="请输入您的位置"
              />
            ) : (
              <span>{userInfo.location}</span>
            )}
          </div>

          {/* 技能标签 - 响应式 */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">我的技能</h3>
            {isEditing ? (
              <input
                type="text"
                value={userInfo.skills}
                onChange={(e) => setUserInfo({...userInfo, skills: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
                placeholder="请输入您的技能，用逗号分隔"
              />
            ) : (
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {userInfo.skills ? (
                  userInfo.skills.split(',').map((skill, index) => (
                    <span key={index} className="px-2 sm:px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs sm:text-sm">
                      {skill.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs sm:text-sm">暂无技能标签</span>
                )}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleSave}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setUserInfo({
                    name: currentUser.name,
                    location: currentUser.location,
                    skills: currentUser.skills.join(', ')
                  })
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 标签栏 - 响应式 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="responsive-container">
          <div className="flex overflow-x-auto">
            {(['info', 'demands', 'services', 'history'] as ProfileTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-center font-medium border-b-2 transition-colors whitespace-nowrap text-xs sm:text-sm ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'info' && '个人信息'}
                {tab === 'demands' && `我的需求 (${userDemands.length})`}
                {tab === 'services' && `我的服务 (${userServices.length})`}
                {tab === 'history' && '互助历史'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 - 响应式 */}
      <main className="responsive-container py-4 sm:py-6">
        {activeTab === 'demands' && (
          <div className="space-y-3 sm:space-y-4">
            {userDemands.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">暂无求助需求</h3>
                <p className="text-gray-500 text-sm">发布您的第一个求助需求吧</p>
              </div>
            ) : (
              userDemands.map((demand: MockDemand) => (
                <div key={demand.id} className="card">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{demand.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(demand.status)}`}>
                      {getStatusText(demand.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{demand.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      {formatTime(demand.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm">
                        编辑
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm">
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-3 sm:space-y-4">
            {userServices.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">暂无提供服务</h3>
                <p className="text-gray-500 text-sm">分享您的技能帮助邻居吧</p>
              </div>
            ) : (
              userServices.map((service: MockService) => (
                <div key={service.id} className="card">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{service.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{service.description}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0">
                    <span>
                      {service.availableFrom && service.availableTo && (
                        `服务时间: ${new Date(service.availableFrom).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})} - ${new Date(service.availableTo).toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}`
                      )}
                    </span>
                    <div className="flex gap-2">
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-xs sm:text-sm">
                        编辑
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-medium text-xs sm:text-sm">
                        {service.status === 'active' ? '暂停' : '激活'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="text-center py-8 sm:py-12">
            <Settings className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">互助历史功能开发中</h3>
            <p className="text-gray-500 text-sm">即将上线，敬请期待</p>
          </div>
        )}
      </main>

      {/* 使用提示 - 响应式 */}
      <div className="fixed bottom-20 left-2 right-2 sm:left-4 sm:right-4 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm text-blue-800">
        <h4 className="font-semibold mb-1">个人中心使用提示</h4>
        <ul className="space-y-1">
          <li>• 点击编辑按钮可以修改个人信息</li>
          <li>• 在我的需求中管理发布的求助</li>
          <li>• 在我的服务中管理提供的帮助</li>
          {!isAuthenticated && (
            <li>• 请先登录以查看和编辑个人信息</li>
          )}
        </ul>
      </div>

      {/* 底部导航 */}
      <BottomNavigation />

      {/* 未登录提示 */}
      {!isAuthenticated && (
        <LoginPrompt message="请先登录以查看和编辑个人信息" />
      )}
    </div>
  )
}