'use client'

import { useState, useEffect } from 'react'
import { Search, Bell } from 'lucide-react'
import { api } from '@/lib/api'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: string
}

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'error' | 'warning' | 'info'
  read: boolean
}

export function TopBar({ selectedAction, setSelectedAction }: { 
  selectedAction?: string
  setSelectedAction?: (action: string) => void 
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [userData, notificationsData] = await Promise.all([
        api.getCurrentUser(),
        api.getNotifications()
      ])
      setUser(userData)
      setNotifications(notificationsData.notifications)
      setUnreadCount(notificationsData.unreadCount)
    }
    fetchData()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleMarkAsRead = async (notificationId: string) => {
    await api.markNotificationAsRead(notificationId)
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleMarkAllAsRead = async () => {
    await api.markAllNotificationsAsRead()
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const actions = ['Overview', 'Testing', 'Logs', 'Management']

  return (
    <div className="flex items-center justify-between h-full px-6">
      <div className="flex gap-1">
        {actions.map((action) => (
          <Button
            key={action}
            variant="ghost"
            onClick={() => setSelectedAction?.(action)}
            className={`${
              selectedAction === action
                ? 'bg-secondary'
                : 'hover:bg-secondary'
            }`}
          >
            {action}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full bg-[#18181B] text-gray-100 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-gray-600"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 hover:bg-gray-800 rounded-lg"
          >
            <Bell className="w-5 h-5 text-gray-300" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-800 hover:bg-[#18181B] ${
                      !notification.read ? 'bg-gray-800/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-2 rounded-full ${
                        notification.type === 'error' ? 'bg-red-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-blue-400 hover:text-blue-300"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-100">{user.name}</div>
              <div className="text-xs text-gray-400">{user.role}</div>
            </div>
            <button className="flex items-center p-1 hover:bg-gray-800 rounded-lg">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
} 