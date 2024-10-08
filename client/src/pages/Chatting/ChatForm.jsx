import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../components";
import { getAllChats } from "../../features/chatting/chattingSlice";
import "../Chatting/ChatForm.css";
import {
  getAccountInformation,
  getAllAccounts,
} from "../../features/auth/authSlice";
import {
  getAllMessage,
} from "../../features/message/messageSlice";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

import { io } from "socket.io-client";
import ChatBox from "./ChatBox";
import ChatList from "./ChatList";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";
const socket = io("http://localhost:5000");

export const ChatForm = () => {
  const dispatch = useDispatch();
  const { account, isLoading: accountLoading } = useSelector(
    (state) => state.auth
  );
  const { isLoading: chatLoading } = useSelector((state) => state.chatting);

  const [myAccountId, setMyAccountId] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [openChatBox, setOpenChatBox] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [chatting, setChatting] = useState([]);
  const [messageChat, setMessageChat] = useState([]);

  const [chosenChatBox, setChosenChatBox] = useState();

  //send message
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const scroll = useRef(null);

  const [newMessages, setNewMessages] = useState(() => {
    // Load initial state from localStorage
    const savedMessages = localStorage.getItem("newMessages");
    return savedMessages ? JSON.parse(savedMessages) : {};
  });

  const [openChat, setIsOpenChat] = useState(false);

  const [notificationMessage, setNotificationMessage] = useState();

  //lấy thông tin cần thiết
  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());

    setMyAccountId(output.payload._id);
  }
  async function initialAccountList() {
    let output = await dispatch(getAllAccounts());

    if(output.type.endsWith('fulfilled')){
      setAccounts(output.payload);
    }else{
      setAccounts([]);
    }
  }
  async function initialChatting() {
    let output = await dispatch(getAllChats());

    setChatting(output.payload);
  }
  async function initialMessageChat() {
    let output = await dispatch(getAllMessage());

    setMessageChat(output.payload);
  }

  useEffect(() => {
    initialChatting();
  }, []);
  useEffect(() => {
    initialAccountList();
  }, []);
  useEffect(() => {
    initiateAccountInformation();
  }, []);
  useEffect(() => {
    initialMessageChat();
  }, []);
  //end lấy thông tin

  useEffect(() => {
    if (selectedFile) {
      setFileUploadError(false);
      handleFileUpload(selectedFile);
    }
  }, [selectedFile]);

  //scroll

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTop = scroll.current.scrollHeight;
    }
  }, [messageChat]);

  // File upload handler
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `chatImages/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFileUrl(downloadURL)
        );
      }
    );
  };

  console.log(accounts)

  //lọc tìm kiếm theo role
  const filteredUsers =
    accounts
      ?.filter((user) => {
        if (account?.role === "Khách hàng") {
          return user.role === "Người giúp việc";
        } else if (account?.role === "Người giúp việc") {
          return user.role === "Khách hàng";
        } else {
          return true;
        }
      })
      .filter((user) => {
        const matchesSearchName =
          user.name &&
          user.name.toLowerCase().includes(searchName.toLowerCase());
        return matchesSearchName;
      }) || [];

  //===============================================
  useEffect(() => {
    socket.on("notification", (message) => {
      if (message.senderId !== myAccountId) {
        const senderName =
          accounts.find((acc) => acc._id === message.senderId)?.name ||
          "Someone";
        const notifiMess = `Bạn có tin nhắn mới từ ${senderName}`;
        setNotificationMessage(notifiMess);
        // toast.success(notificationMessage);

        setNewMessages((prevNewMessages) => {
          const updatedNewMessages = {
            ...prevNewMessages,
            [message.chatId]: true,
          };
          localStorage.setItem(
            "newMessages",
            JSON.stringify(updatedNewMessages)
          );
          return updatedNewMessages;
        });
      }
    });
    return () => {
      socket.off("notification");
    };
  }, [accounts, myAccountId]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessageChat((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (chosenChatBox) {
      socket.emit("joinChat", chosenChatBox);

      // Clear new message notification for the current chat
      setNewMessages((prevNewMessages) => {
        const updatedNewMessages = {
          ...prevNewMessages,
          [chosenChatBox]: false,
        };
        localStorage.setItem("newMessages", JSON.stringify(updatedNewMessages));
        return updatedNewMessages;
      });
      const fetchMessagesForChatBox = async () => {
        let output = await dispatch(getAllMessage());
        setMessageChat(
          output.payload.filter((msg) => msg.chatId === chosenChatBox)
        );
      };
      fetchMessagesForChatBox();
    }
  }, [chosenChatBox]);
  //==================================================

  if (accountLoading || chatLoading) {
    return <Spinner />;
  }

  const hasNewMessages = Object.values(newMessages).some(
    (value) => value === true
  );

  return (
    <div className="fixed right-0 top-0 flex items-center h-screen z-50 mr-[-40px]">
      <strong
        className="text-white bg-green transform -rotate-90 items-center flex gap-2 p-2 rounded-md cursor-pointer"
        onClick={() => setIsOpenChat(!openChat)}
      >
        <BsFillChatDotsFill size={24} />
        Nhắn tin
        {hasNewMessages && (
          <span className="absolute top-2 right-2 mt-[-10px] mr-[-10px] w-3 h-3 bg-red rounded-full"></span>
        )}
      </strong>
      {openChat && (
        <div className="popup active ">
          <div className="overlay" onClick={() => setIsOpenChat(false)}></div>
          <div className="content rounded-md relative w-[90%] h-[80%] ">
            <AiOutlineClose
              className="absolute top-2 right-2 text-sm hover:cursor-pointer"
              onClick={() => setIsOpenChat(false)}
            />
            <div className="popup active p-4 md:p-10 shadow-2xl bg-white rounded-xl grid grid-cols-1 md:grid-cols-3  gap-4">
              {/* list chat */}
              <ChatList
                myAccountId={myAccountId}
                accounts={accounts}
                account={account}
                searchName={searchName}
                setSearchName={setSearchName}
                filteredUsers={filteredUsers}
                chatting={chatting}
                newMessages={newMessages}
                setChosenChatBox={setChosenChatBox}
                setOpenChatBox={setOpenChatBox}
                initialChatting={initialChatting}
                setNewMessages={setNewMessages}
              />
              {/* Chat Box */}
              <div className="col-span-1 md:col-span-2">
                {openChatBox && chosenChatBox ? (
                  <ChatBox
                    chosenChatBox={chosenChatBox}
                    myAccountId={myAccountId}
                    messageChat={messageChat}
                    setMessageChat={setMessageChat}
                    chatting={chatting}
                    setNewMessages={setNewMessages}
                  />
                ) : (
                  <div className="flex justify-center">
                    <strong className="text-xl">
                      Chọn cuộc trò chuyện để bắt đầu
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
