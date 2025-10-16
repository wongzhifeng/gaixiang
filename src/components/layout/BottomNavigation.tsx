'use client'

import { usePathname } from 'next/navigation'
import { Heart, MessageCircle, Users, Home } from 'lucide-react'

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: '首页',
      active: pathname === '/'
    },
    {
      href: '/mutual-aid',
      icon: MessageCircle,
      label: '互助',
      active: pathname === '/mutual-aid'
    },
    {
      href: '/conversations',
      icon: Users,
      label: '对话',
      active: pathname === '/conversations'
    },
    {
      href: '/profile',
      icon: Heart,
      label: '我的',
      active: pathname === '/profile'
    }
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <a
            key={item.href}
            href={item.href}
            className={`nav-item ${item.active ? 'active' : 'inactive'}`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
            <span className="text-xs sm:text-sm">{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}