import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isOwner: boolean;
  loginWithGoogle: (email?: string, name?: string, photo?: string) => Promise<User>;
  completeOnboarding: (username: string, displayName: string, bio?: string, profileImage?: string) => { success: boolean; error?: string };
  switchUser: (userId: string) => void;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
  refreshUsers: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());

  const refreshUsers = () => {
    setUsers(storage.getUsers());
    setCurrentUser(storage.getCurrentUser());
  };

  useEffect(() => {
    const unsub = storage.subscribe((event) => {
      if (['USER_UPDATED', 'CURRENT_USER_CHANGED'].includes(event)) {
        refreshUsers();
      }
    });
    return unsub;
  }, []);

  const isOwner = currentUser?.role === 'OWNER' || currentUser?.username_normalized === '4xwiiiin';

  // Google OAuth 2.0 flow simulation (returns verified Google account profile)
  const loginWithGoogle = async (
    customEmail?: string,
    customName?: string,
    customPhoto?: string
  ): Promise<User> => {
    const email = customEmail || 'developer.nesto@gmail.com';
    const name = customName || 'Nesto Explorer';
    const photo = customPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

    // Check if user already exists with this email
    const allUsers = storage.getUsers();
    let existingUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existingUser) {
      // Create new onboarded or pending user
      const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const baseName = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_');
      let candidateUsername = baseName;
      let counter = 1;
      while (storage.isUsernameTaken(candidateUsername) || storage.isUsernameReserved(candidateUsername)) {
        candidateUsername = `${baseName}_${counter++}`;
      }

      existingUser = {
        id,
        username: candidateUsername,
        username_normalized: candidateUsername.toLowerCase(),
        display_name: name,
        email,
        profile_image: photo,
        bio: 'Just joined Nesto! 🚀 Ready to connect and share moments.',
        role: candidateUsername.toLowerCase() === '4xwiiiin' ? 'OWNER' : 'USER',
        status: 'online',
        created_at: Date.now(),
        last_active_at: Date.now(),
        verified: false,
      };

      storage.saveUser(existingUser);
      storage.logAuditEvent(existingUser, 'ACCOUNT_REGISTER_GOOGLE', `Registered via Google OAuth verified email: ${email}`, 'info');
    } else {
      existingUser.status = 'online';
      existingUser.last_active_at = Date.now();
      storage.saveUser(existingUser);
      storage.logAuditEvent(existingUser, 'AUTH_LOGIN_GOOGLE', `Logged in via Google OAuth: ${email}`, 'info');
    }

    storage.setCurrentUser(existingUser);
    setCurrentUser(existingUser);
    refreshUsers();
    return existingUser;
  };

  const completeOnboarding = (
    username: string,
    displayName: string,
    bio?: string,
    profileImage?: string
  ): { success: boolean; error?: string } => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    const check = storage.validateUsername(username, currentUser.id);
    if (!check.valid) {
      return { success: false, error: check.error };
    }

    const normalized = username.trim().toLowerCase();
    const updatedUser: User = {
      ...currentUser,
      username: username.trim(),
      username_normalized: normalized,
      display_name: displayName.trim() || username.trim(),
      bio: bio?.trim() || currentUser.bio,
      profile_image: profileImage || currentUser.profile_image,
      role: normalized === '4xwiiiin' ? 'OWNER' : currentUser.role,
      last_active_at: Date.now(),
    };

    storage.saveUser(updatedUser);
    storage.setCurrentUser(updatedUser);
    setCurrentUser(updatedUser);
    refreshUsers();
    storage.logAuditEvent(updatedUser, 'PROFILE_ONBOARDING_COMPLETED', `Configured handle @${updatedUser.username}`);
    return { success: true };
  };

  const switchUser = (userId: string) => {
    const target = storage.getUserById(userId);
    if (target) {
      target.status = 'online';
      target.last_active_at = Date.now();
      storage.saveUser(target);
      storage.setCurrentUser(target);
      setCurrentUser(target);
      refreshUsers();
      storage.logAuditEvent(target, 'SWITCH_SESSION', `Switched active active session to @${target.username}`);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates, last_active_at: Date.now() };
    storage.saveUser(updated);
    storage.setCurrentUser(updated);
    setCurrentUser(updated);
    refreshUsers();
  };

  const logout = () => {
    if (currentUser) {
      storage.logAuditEvent(currentUser, 'AUTH_LOGOUT', `Logged out`);
      const offlineUser = { ...currentUser, status: 'offline' as const, last_active_at: Date.now() };
      storage.saveUser(offlineUser);
    }
    storage.setCurrentUser(null);
    setCurrentUser(null);
    refreshUsers();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isOwner,
        loginWithGoogle,
        completeOnboarding,
        switchUser,
        updateProfile,
        logout,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
