import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMessage } from "../../../features/message/messageSlice";
import { getAllChats } from "../../../features/chatting/chattingSlice";
import { Chatbox } from "../../Chatting/ChatBox";
import { getAccountInformation } from "../../../features/auth/authSlice";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { BiTrash } from "react-icons/bi";

export const AdminChatManager = () => {
  const [chats, setChats] = useState([]);
  console.log(chats)
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [myAccountId, setMyAccountId] = useState("");
  const [myRole, setMyRole] = useState('')

  const [notificationMessage, setNotificationMessage] = useState();
  const dispatch = useDispatch();

  async function initialAccountId() {
    let output = await dispatch(getAccountInformation());
    setMyAccountId(output.payload._id);
    setMyRole(output.payload.role)
  }

  useEffect(() => {
    initialAccountId();
  }, []);


  useEffect(() => {
    const fetchChats = async () => {
      const output = await dispatch(getAllChats());
      setChats(output.payload);
    };

    fetchChats();
  }, [dispatch]);

  const handleSelectChat = async (chatId) => {
    setSelectedChat(chatId);
    const output = await dispatch(getMessage(chatId));
    setMessageList(output.payload);
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-row">
      <AdminSidebar />
      <div className="flex-1 px-10 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Chăm sóc người dùng</h1>
            <p className="text-sm font-medium text-gray pt-1">Trả lời, giải đáp thắc mắc từ phía người dùng.</p>
          </div>
          <div className="flex">
            <div className="px-5 flex flex-col items-center">
              <h2 className="text-2xl font-semibold">{chats.length}</h2>
              <h1 className="text-sm font-medium text-gray">Hội thoại</h1>
            </div>
          </div>
        </div>

        <table className="w-full border-b border-gray mt-3">
          <thead>
            <tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
              <td className="py-2 px-4 text-center font-bold">STT</td>
              <td className="py-2 px-4 text-center font-bold">Tên</td>
              <td className="py-2 px-4 text-center font-bold">Vai trò</td>
              <td className="py-2 px-4 text-center font-bold">Email</td>

              <td className="py-2 px-4 text-center font-bold">Hành động</td>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat, index) => (
              <tr
                key={index}
                className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink hover:cursor-pointer"
                onClick={() => {
                  handleSelectChat(chat._id);
                  setUserName(chat.firstId.name)
                  setUserAvatar(chat.firstId.avatar)
                }}
              >
                <td className="font-medium text-center text-gray p-3">{index + 1}</td>
                <td className="font-medium text-center text-gray">
                  {chat.firstId.name}
                </td>
                <td className="font-medium text-center text-gray">
                  {chat.firstId.role}
                </td>
                <td className="font-medium text-center text-gray">
                  {chat.firstId.email}
                </td>
                <td >
                  <button className="flex items-center justify-start p-3 text-xl group">
                    <BiTrash className="text-red group-hover:text-primary m-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      {selectedChat && (
        <Chatbox
          openChat={true}
          setIsOpenChat={() => setSelectedChat(null)}
          chatId={selectedChat}
          messageList={messageList}
          userName={userName}
          myAccountId={myAccountId}
          myRole={myRole}
          userAvatar={userAvatar}
        />
      )}
    </div>
  );
};
