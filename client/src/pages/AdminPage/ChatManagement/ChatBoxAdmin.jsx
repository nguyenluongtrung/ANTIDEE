import { useEffect, useState, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { FaImages } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import moment from "moment";
import { createMessage, getMessage } from "../../../features/message/messageSlice";
import { app } from "../../../firebase";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { getAccountInformation } from "../../../features/auth/authSlice";
moment.locale("vi");
const socket = io("https://antidee.onrender.com/");

export const ChatBoxAdmin = ({
  openChat,
  setIsOpenChat,
  myAccountId,
  chatId,
  myRole,
  userName,
  userAvatar,
  phoneNumber,
  gender,
  address,
  email
}) => {
  if (!openChat) return null;

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePercs, setFilePercs] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const messageEndRef = useRef(null);
  const [account, setAccountInfor] = useState('');

  socket.on("sendMessage", (data) => {
    socket.to(data.chatId).emit("receiveMessage", data);
  });

  useEffect(() => {
    if (chatId) {
      socket.emit("joinChat", chatId);
    }
    socket.on("receiveMessage", (newMessage) => {
      setMessageList((prevList) => [...prevList, newMessage]);
      scrollToBottom();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "auto" });
  };


  const initialMessageList = async () => {
    const output = await dispatch(getMessage(chatId));
    setMessageList(output.payload);
  };

  useEffect(() => {
    if (openChat && chatId) {
      initialMessageList();
    }
  }, [openChat, chatId]);


  useEffect(() => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file, index) => handleFileUpload(file, index));
    }
  }, [selectedFiles]);

  const handleFileUpload = (file, index) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `chatImages/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercs((prev) => {
          const newPercs = [...prev];
          newPercs[index] = Math.round(progress);
          return newPercs;
        });
      },
      (error) => {
        toast.error("File upload failed", errorStyle);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFileUrls((prev) => [...prev, downloadURL]);
        });
      }
    );
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() && selectedFiles.length === 0) return;
    const messageData = {
      chatId: chatId,
      senderId: myAccountId,
      text: message,
      files: fileUrls,
      createdAt: new Date().toISOString(),
    };
    socket.emit("sendMessage", messageData);
    scrollToBottom();
    setMessage("");
    setSelectedFiles([]);
    setFileUrls([]);
    setFilePercs([]);
    const result = await dispatch(createMessage(messageData));
    if (result && result.payload) {
      toast.success("Message sent", successStyle);
    } else {
      toast.error("Failed to send message", errorStyle);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage(e);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) setSelectedFiles(files);
  };

  const formatMessageDate = (createdAt) => {
    const createdAtMoment = moment(createdAt);
    const now = moment();
    const diffDays = now.diff(createdAtMoment, "days");
    if (diffDays === 0) {
      return "Hôm nay, " + createdAtMoment.format("HH:mm");
    } else if (diffDays === 1) {
      return "Hôm qua, " + createdAtMoment.format("HH:mm");
    } else {
      return createdAtMoment.format("DD/MM/YYYY [lúc] HH:mm");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <div className="flex h-[85%] rounded-lg shadow-lg mt-[4.2rem]">
      <div className=" flex flex-col flex-1">
        <div className="flex-1 overflow-y-scroll p-2 mt-4">
          {messageList.map((message, index) => (
            <div key={message._id || `${message.createdAt}-${index}`}>
              <div
                className={`mb-2 p-2 max-w-64 w-fit ${message.senderId === myAccountId
                  ? "bg-light_yellow rounded text-white ml-auto"
                  : "bg-green rounded text-white mr-auto"
                  }`}
              >
                <p className="mb-1 text-sm">{message.text}</p>
                {message.files?.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {message.files.map((fileUrl, fileIndex) => (
                      <img
                        key={fileIndex}
                        src={fileUrl}
                        alt="Message attachment"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
              </div>
              <p
                className={`text-xs ${message.senderId === myAccountId
                  ? "text-gray text-right"
                  : "text-gray text-left"
                  }`}
              >
                {formatMessageDate(message.createdAt)}
              </p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        {selectedFiles.length > 0 && (
          <div className="flex gap-3 p-3 overflow-x-auto">
            {filePercs.map((perc, index) => (
              <div key={index} className="text-center">
                <img
                  src={URL.createObjectURL(selectedFiles[index])}
                  alt="preview"
                  className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-lg"
                />
                {perc > 0 && (
                  <div className="mt-1">
                    <div
                      className="h-1 bg-green rounded-lg mt-1"
                      style={{
                        width: `${perc}%`,
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-5 bg-super_light_purple p-3 rounded-b-lg shadow-inner">
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FaImages className="text-blue hover:text-dark_blue transition-colors duration-200" size={24} />
            </label>
          </div>
          <input
            className="flex-grow p-2 border border-gray rounded-full focus:outline-none focus:border-green focus:ring-1 focus:ring-green placeholder-gray"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn của bạn"
          />
          <button
            className="w-10 h-10 flex items-center justify-center text-blue hover:text-dark_blue rounded-full transition duration-200"
            onClick={handleSendMessage}
          >
            <IoSend size={20} />
          </button>
        </div>


      </div>

      <div className="w-2/5 bg-white p-4 border-l border-gray text-center">
        <img className="rounded-full w-36 h-36 mx-auto" src={userAvatar} alt="User Avatar" />
        <h3 className="text-lg font-semibold mt-2 mb-4">{userName}</h3>
        <div className="border mb-5"></div>

        <h1 className="text-lg font-bold mb-2">Thông tin cá nhân</h1>
        <p>
          <span className="font-bold">Email: </span>
          {email}
        </p>
        <p>
          <span className="font-bold">Số điện thoại: </span>
          {phoneNumber}
        </p>
        <p>
          <span className="font-bold">Giới tính: </span>
          {gender}
        </p>
        <p>
          <span className="font-bold">Địa chỉ: </span>
          {address}
        </p>
      </div>
    </div>
  );
};
