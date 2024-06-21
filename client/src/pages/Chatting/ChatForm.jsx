import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { errorStyle, successStyle } from "../../utils/toast-customize";
import toast from "react-hot-toast";
import { Sidebar, Spinner } from "../../components";
import { createChat, getAllChats } from "../../features/chatting/chattingSlice";
import "../Chatting/ChatForm.css";
import { BiSearch, BiSend } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import {
  getAccountInformation,
  getAllAccounts,
} from "../../features/auth/authSlice";
import {
  createMessage,
  getAllMessage,
  getMessage,
} from "../../features/message/messageSlice";
import moment from "moment";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

import { io } from "socket.io-client";
const socket = io("http://localhost:5000");

export const ChatForm = () => {
  const dispatch = useDispatch();
  const { account, isLoading: accountLoading } = useSelector(
    (state) => state.auth
  );
  const { isLoading: chatLoading } = useSelector((state) => state.chatting);
  const { isLoading: messageLoading } = useSelector((state) => state.messages);

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
  const [fileUrl, setFileUrl] = useState('');
  const scroll = useRef();

  //===============================================
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      setMessageChat((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
    if (chosenChatBox) {
      socket.emit('joinChat', chosenChatBox);
    }
  }, [chosenChatBox]);
  //==================================================

  //lấy thông tin cần thiết
  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());

    setMyAccountId(output.payload._id);
  }
  async function initialAccountList() {
    let output = await dispatch(getAllAccounts());

    setAccounts(output.payload);
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


  useEffect(()=>{
    scroll.current?.scrollIntoView({behavior: "smooth" })
},[messageChat])




  // File upload handler
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `chatImages/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
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

  const onSearchChange = (e) => {
    setSearchName(e.target.value);
  };
  //thực hiện tạo hộp chat mới
  const handleCreateChat = async (secondUserId) => {
    try {
      const chatData = {
        firstId: myAccountId,
        secondId: secondUserId,
      };

      const result = await dispatch(createChat(chatData));
      if (result.type.endsWith("fulfilled")) {
        toast.success("Chat created successfully", successStyle);
        initialChatting();
        setSearchName("");
      } else {
        toast.success("Open Chat", successStyle);
        return setOpenChatBox(true);
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat", errorStyle);
    }
  };



  const handleMessageChange = (e) => {
    setMessageText(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const messageData = {
        chatId: chosenChatBox,
        senderId: myAccountId,
        text: messageText,
        file: fileUrl
      };
      const result = await dispatch(createMessage(messageData));
      if (result.type.endsWith("fulfilled")) {
        setMessageText("");
        setSelectedFile(null);
        setFileUrl('');
        setFilePerc(0);
        socket.emit('sendMessage', messageData);
      } else {
        toast.error("Send message failed", errorStyle);
      }
    } catch (error) {
      toast.error("Failed to send message", errorStyle);
    }
  };


  if (accountLoading || chatLoading || messageLoading) {
    return <Spinner />;
  }

  return (
    <div className="popup active p-4 md:p-10 shadow-2xl bg-white m-4 md:m-20 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1">
        <div className="flex items-center shadow-lg p-2 rounded-lg bg-white">
          <BiSearch className="text-gray-500 mr-2" />
          <input
            className="w-full p-2 outline-none text-gray-700"
            placeholder="Search"
            value={searchName}
            onChange={onSearchChange}
          />
        </div>
        <div className="absolute bg-white shadow-lg rounded-lg">
          {searchName && filteredUsers.length > 0 && (
            <div>
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-4 p-4 rounded-2xl shadow-lg mt-2"
                  onClick={() => {
                    handleCreateChat(user._id);
                    
                  }}
                >
                  <img
                    src={user?.avatar}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border border-gray-300"
                  />
                  <div className="grid">
                    <span className="text-gray-700 font-medium">
                      {user?.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {chatting
          .filter(
            (chat) =>
              String(myAccountId) === String(chat?.firstId?._id) ||
              String(myAccountId) === String(chat?.secondId?._id)
          )
          .map((chat) => {
            return (
              <div key={chat?._id}>
                <div
                  className="flex items-center space-x-4 p-4 rounded-2xl shadow-lg mt-2"
                  onClick={() => {
                    // getMessageChat();
                    setChosenChatBox(chat?._id);
                    setOpenChatBox(true);
                  }}
                >
                  <img
                    src={
                      String(myAccountId) === String(chat?.firstId?._id)
                        ? String(chat?.secondId?.avatar)
                        : String(chat?.firstId?.avatar)
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full border border-gray-300"
                  />
                  <div className="grid">
                    <span className="text-gray-700 font-medium">
                      {String(myAccountId) === String(chat?.firstId?._id)
                        ? String(chat?.secondId?.name)
                        : String(chat?.firstId?.name)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="col-span-1 md:col-span-2">
        {openChatBox && chosenChatBox && (
          <div className="flex flex-col h-full">
            <div className="flex justify-center mb-4 md:mb-0">
              <strong>
                {String(myAccountId) === String(chatting.find((chat) => String(chat._id) === String(chosenChatBox))?.firstId?._id)
                  ? String(chatting.find((chat) => String(chat._id) === String(chosenChatBox))?.secondId?.name)
                  : String(chatting.find((chat) => String(chat._id) === String(chosenChatBox))?.firstId?.name)}
              </strong>
            </div>
            <div ref={scroll} className="bg-light_purple shadow-2xl rounded-xl h-64 md:h-96 p-5 overflow-y-auto">
              {messageChat
                ?.filter((msg) => msg?.chatId === chosenChatBox)
                .map((msg) => (
                  <div
                    key={msg?._id}
                    className={`grid shadow-2xl mt-3 w-fit p-3 rounded-lg
                           ${msg?.senderId === account?._id
                        ? "bg-light_yellow ml-auto"
                        : "bg-light_primary"
                      } `}
                  >
                    {msg.text}
                    {msg.file && (
                      <div className="mb-2">
                        <a href={msg.file} target="_blank" rel="noopener noreferrer">
                          <img src={msg.file} alt="uploaded" className="w-32 h-32 object-cover rounded-lg" />
                        </a>
                      </div>
                    )}

                    <span className="text-xs text-right">
                      {moment(msg?.createdAt).calendar()}
                    </span>
                  </div>
                ))}
            </div>
            <form className="flex mt-5" onSubmit={handleSendMessage}>
              <div className="relative p-2 w-fit rounded-lg cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <MdAdd className="text-gray hover:text-green mr-2" size={24} />
                </label>
              </div>
              <input

                className="p-2 shadow-lg rounded-lg w-full mr-2 outline-none"
                value={messageText}
                onChange={handleMessageChange}
              />
              <button
                type="submit"
                className="bg-green text-black p-2 w-fit rounded-lg flex items-center justify-center"
              >
                <BiSend className="w-7 h-7" />
              </button>
            </form>
            {selectedFile && (

              <div className="mt-2 ml-20 shadow-lg w-fit p-2 rounded-lg bg-light_purple">
                {filePerc > 0 && (
                  <div className="mt-2 text-center ">
                    {filePerc === 100 && <div className="text-xs">Tải ảnh thành công</div>}
                    <div className="h-1 bg-green rounded-lg" style={{ width: `${filePerc}%`, transition: 'width 0.1s linear' }} />

                  </div>
                )}
                <img src={URL.createObjectURL(selectedFile)} alt="preview"
                  className="w-32 h-32 object-cover inline-block rounded-lg" />

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
