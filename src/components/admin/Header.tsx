'use client'

import { signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={user.image || ''} alt={user.name || ''} />
            <AvatarFallback>
              {user.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        >
          Sign out
        </Button>
      </div>
    </header>
  )
} 