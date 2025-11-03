import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import ChatHeader from "../components/ChatHeader.jsx";
import MessageInput from "../components/MessageInput.jsx";
import MessageSkeleton from "../components/skeletons/MessageSkeleton.jsx";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  const scrollIntoView = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    scrollIntoView();
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />

      <div className="sapce-y-4 flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messagesEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col">
              {message.text}
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="my-2 rounded-md sm:max-w-[200px]"
                />
              )}
            </div>
          </div>
        ))}
        {/* <div ref={messagesEndRef} /> */}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
