import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative md:w-full md:h-[665px] h-[640px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className={`md:w-80 w-full bg-slate-800/50 backdrop-blur-sm flex flex-col ${
          selectedUser ? "hidden md:flex" : "flex"
        }`}>
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={`md:flex-1 w-full flex flex-col bg-slate-900/50 backdrop-blur-sm ${
          selectedUser ? "flex" : "hidden md:flex"
        }`}>
          {selectedUser ? <ChatContainer /> : <div className="hidden md:block"><NoConversationPlaceholder /></div>}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;