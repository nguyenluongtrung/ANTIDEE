import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";


import { getMessage } from "../../../features/message/messageSlice";
import { getAllChats } from "../../../features/chatting/chattingSlice";
import { AdminChatbox } from "./AdminChatBox";


export const AdminChatManager = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [userName, setUserName]=useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    // Lấy danh sách các cuộc trò chuyện của admin
    const fetchChats = async () => {
      const output = await dispatch(getAllChats());
      setChats(output.payload);
    };

    fetchChats();
  }, [dispatch]);

  const handleSelectChat = async (chatId) => {
    setSelectedChat(chatId);
    // Lấy danh sách tin nhắn của cuộc trò chuyện được chọn
    const output = await dispatch(getMessage(chatId));
    setMessageList(output.payload);
  };

  return (
    <div className="admin-chat-manager">
      <h2>Danh sách trò chuyện</h2>
      <div className="chat-list">
        {chats.map((chat) => (
          <div
            key={chat._id}
            className={`chat-item ${selectedChat === chat._id ? "active" : ""}`}
            onClick={() => {handleSelectChat(chat._id);
                setUserName(chat.firstId.name)
            }}
          >
            <p>
              {chat.firstId.name || "User"} - {chat.secondId.name || "Admin"}
            </p>
          </div>
        ))}
      </div>

      {selectedChat && (
        <AdminChatbox
          openChat={true}
          setIsOpenChat={() => setSelectedChat(null)}
          chatId={selectedChat}
          messageList={messageList}
          userName={userName}
        />
      )}
    </div>
  );
};
