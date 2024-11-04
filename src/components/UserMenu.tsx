import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, LogOut, MessageCircle, Building } from 'lucide-react';
import { User } from '../types';

interface UserMenuProps {
  user: User;
  onLogout: () => void;
  onViewMessages: () => void;
  onViewListings?: () => void;
}

export default function UserMenu({ user, onLogout, onViewMessages, onViewListings }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
      >
        <UserIcon size={20} />
        <span>{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          {user.type === 'landlord' && onViewListings && (
            <button
              onClick={() => {
                onViewListings();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
            >
              <Building size={20} />
              <span>Mine Annoncer</span>
            </button>
          )}
          
          <button
            onClick={() => {
              onViewMessages();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50"
          >
            <MessageCircle size={20} />
            <span>Beskeder</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-50 text-red-600"
          >
            <LogOut size={20} />
            <span>Log ud</span>
          </button>
        </div>
      )}
    </div>
  );
}