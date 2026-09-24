import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { CallProvider, useCall } from './context/CallContext';

import { Sidebar } from './components/common/Sidebar';
import { BottomNav } from './components/common/BottomNav';
import { ConversationList } from './components/chat/ConversationList';
import { ChatWindow } from './components/chat/ChatWindow';
import { StoryViewerModal } from './components/chat/StoryViewerModal';
import { CreateStoryModal } from './components/chat/CreateStoryModal';
import { ActiveCallOverlay } from './components/call/ActiveCallOverlay';
import { IncomingCallModal } from './components/call/IncomingCallModal';
import { OwnerDashboard } from './components/admin/OwnerDashboard';
import { ProfileView } from './components/profile/ProfileView';
import { CallsView } from './components/call/CallsView';
import { HomeView } from './components/home/HomeView';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { SearchModal } from './components/search/SearchModal';
import { LoginModal } from './components/auth/LoginModal';
import { OnboardingModal } from './components/auth/OnboardingModal';

import { Story } from './types';
import { Search, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeConversation, setActiveConversationId } = useChat();

  const [currentTab, setCurrentTab] = useState<'explore' | 'chats' | 'calls' | 'notifications' | 'profile' | 'admin'>('explore');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // If user is not logged in
  if (!currentUser) {
    return <LoginModal isOpen={true} onSuccess={() => setShowLoginModal(false)} />;
  }

  // Determine if on mobile we should show chat window or conversation list
  const showMobileChatWindow = currentTab === 'chats' && activeConversation !== null;

  return (
    <div className="nesto-app-layout">
      {/* Desktop/Tablet Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab as any);
        }}
        openSearch={() => setShowSearchModal(true)}
      />

      {/* Main Body Area */}
      <main
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mobile Header */}
        <header
          className="mobile-only"
          style={{
            height: '56px',
            backgroundColor: 'var(--bg-surface-1)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/favicon.svg" alt="Nesto" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
              }}
              className="text-nesto-gradient"
            >
              NESTO
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowSearchModal(true)}
              className="btn-icon"
              style={{ width: '34px', height: '34px' }}
            >
              <Search size={16} />
            </button>
            <img
              src={currentUser.profile_image}
              alt={currentUser.display_name}
              onClick={() => setCurrentTab('profile')}
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
            />
          </div>
        </header>

        {/* Dynamic Views */}
        <div style={{ flex: 1, height: 'calc(100% - 56px)', display: 'flex', overflow: 'hidden' }}>
          {currentTab === 'explore' && (
            <HomeView
              onSelectStory={(s) => setActiveStory(s)}
              onOpenCreateStory={() => setShowCreateStory(true)}
              onOpenChat={() => setCurrentTab('chats')}
            />
          )}

          {currentTab === 'chats' && (
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              {/* Conversation List: hidden on mobile if chat is active */}
              <div
                style={{
                  width: '360px',
                  height: '100%',
                  display: showMobileChatWindow ? 'none' : 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                }}
                className={showMobileChatWindow ? 'desktop-only' : ''}
              >
                <ConversationList
                  onSelectStory={(s) => setActiveStory(s)}
                  onOpenCreateStory={() => setShowCreateStory(true)}
                  onOpenNewChat={() => setShowSearchModal(true)}
                />
              </div>

              {/* Active Chat Window: full width on mobile or right side on desktop */}
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  display: !showMobileChatWindow ? 'none' : 'flex',
                  flexDirection: 'column',
                }}
                className={!showMobileChatWindow ? 'desktop-only' : ''}
              >
                <ChatWindow
                  onBackMobile={() => setActiveConversationId(null)}
                  onOpenPartnerProfile={() => setCurrentTab('profile')}
                />
              </div>
            </div>
          )}

          {currentTab === 'calls' && <CallsView />}

          {currentTab === 'notifications' && (
            <NotificationsDrawer onOpenConversation={() => setCurrentTab('chats')} />
          )}

          {currentTab === 'profile' && <ProfileView />}

          {currentTab === 'admin' && <OwnerDashboard />}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav currentTab={currentTab} setCurrentTab={(tab) => setCurrentTab(tab as any)} />
      </main>

      {/* Global Interactive Overlays */}
      <ActiveCallOverlay />
      <IncomingCallModal />

      {activeStory && (
        <StoryViewerModal story={activeStory} onClose={() => setActiveStory(null)} />
      )}

      {showCreateStory && (
        <CreateStoryModal isOpen={true} onClose={() => setShowCreateStory(false)} />
      )}

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onOpenConversation={() => setCurrentTab('chats')}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <CallProvider>
          <MainAppContent />
        </CallProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
