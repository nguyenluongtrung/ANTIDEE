import { useState, useEffect } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createChat, getAllChats } from "../../features/chatting/chattingSlice";
import { getAccountInformation } from "../../features/auth/authSlice";
import { Chatbox } from "../../pages/Chatting/ChatBox";

export const Chat = () => {
  const [myAccountId, setMyAccountId] = useState("");
  const [adminId, setAdminId] = useState("6631e32a7bd68b4a01b2f363");
  const [openChat, setIsOpenChat] = useState(false);
  const [chatId, setChatId] = useState("");
  const [myRole, setMyRole] = useState("");
  const [userName, setUserName]=useState("");


  const dispatch = useDispatch();
  console.log(myAccountId);

  async function initialAccountId() {
    let output = await dispatch(getAccountInformation());
    const accountId = output.payload._id;
    const name = output.payload.name;
    setMyAccountId(accountId);
    setUserName(name);
    setMyRole(output.payload.role);
    initialChatList(accountId);
  }

  async function initialChatList(accountId) {
    let output = await dispatch(getAllChats());
    const foundChat = output.payload.find(
      (chat) =>
        chat.firstId._id === accountId || chat.secondId._id === accountId
    );
    if (foundChat) {
      setChatId(foundChat._id);
    }
  }

  useEffect(() => {
    initialAccountId();
  }, []);

  const handleOpenAndCreateChat = () => {
    setIsOpenChat(true);
    const chatData = {
      firstId: myAccountId,
      secondId: adminId,
    };
    dispatch(createChat(chatData));
  };

  return (
    <div className="fixed bottom-[14%] md:bottom-[20%] right-[4.8%] lg:bottom-32 lg:right-12  z-50">
      <strong
        className="text-white bg-green flex items-center justify-center p-2 md:p-4 rounded-full cursor-pointer shadow-lg transform "
        onClick={handleOpenAndCreateChat}
      >
        <BsFillChatDotsFill size={24} />
      </strong>
      {openChat && (
        <Chatbox
          openChat={openChat}
          setIsOpenChat={setIsOpenChat}
          myAccountId={myAccountId}
          adminId={adminId}
          chatId={chatId}
          myRole={myRole}
          userName={userName}
        />
      )}
    </div>
  );
};
