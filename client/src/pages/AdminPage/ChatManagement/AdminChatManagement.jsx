import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMessage } from "../../../features/message/messageSlice";
import { getAllChats } from "../../../features/chatting/chattingSlice";
import { getAccountInformation } from "../../../features/auth/authSlice";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import { BiTrash } from "react-icons/bi";
import { ChatBoxAdmin } from "./ChatBoxAdmin";


export const AdminChatManager = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageList, setMessageList] = useState([]);
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [myAccountId, setMyAccountId] = useState("");
  const [myRole, setMyRole] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')



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
    < div className="w-full max-h-[80%] min-h-screen bg-white flex flex-row">
      <AdminSidebar />
      <div className="w-1/4 bg-white border-r border-gray mt-[1.05rem]">
        <div className="px-4 py-3 border-b border-gray">
          <h2 className="text-lg font-semibold">Chăm sóc khách hàng</h2>
        </div>
        {chats.map((chat, index) => (
          <ul className="mt-4 hover:bg-light_primary rounded-lg" key={index} onClick={() => {
            handleSelectChat(chat._id);
            setUserName(chat.firstId.name)
            setUserAvatar(chat.firstId.avatar)
            setAddress(chat.firstId.address)
            setGender(chat.firstId.gender)
            setPhoneNumber(chat.firstId.phoneNumber)
            setEmail(chat.firstId.email)

          }} >
            <li className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray">
              <img
                src={
                  chat.firstId.avatar ||
                  "https://via.placeholder.com/40?text=Avatar"
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <h3 className="font-semibold">{chat.firstId.name} <p className="text-xs">({chat.firstId.role})</p></h3>
              </div>
            </li>
          </ul>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex-1">
        {selectedChat && (
          <ChatBoxAdmin
            openChat={true}
            setIsOpenChat={() => setSelectedChat(null)}
            chatId={selectedChat}
            messageList={messageList}
            userName={userName}
            myAccountId={myAccountId}
            myRole={myRole}
            userAvatar={userAvatar}
            phoneNumber={phoneNumber}
            gender={gender}
            address={address}
            email={email}
          />
        )}
      </div>
    </div>

  );
};
