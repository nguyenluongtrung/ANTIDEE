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
import { app } from "../../../firebase";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import moment from "moment";
import { createMessage } from "../../../features/message/messageSlice";
moment.locale("vi");

const socket = io("http://localhost:5173/");

export const AdminChatbox = ({
  openChat,
  setIsOpenChat,
  chatId,
  messageList,
  userName,
}) => {
  if (!openChat) return null;

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePercs, setFilePercs] = useState([]);
  const [messages, setMessages] = useState(messageList);
  const [adminId, setAdminId] = useState("6631e32a7bd68b4a01b2f363");
  const messageEndRef = useRef(null);

  socket.on("sendMessage", (data) => {
    // Broadcast message to the specific chat room
    socket.to(data.chatId).emit("receiveMessage", data);
  });

  useEffect(() => {
    // Join the room only if the chatBoxId is present
    if (chatId) {
      socket.emit("joinChat", chatId);
    }
  
    // Listen for incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessageList((prevList) => [...prevList, newMessage]);
      scrollToBottom();
    });
  
    return () => {
      // Cleanup on component unmount or when dependencies change
      socket.off("receiveMessage");
    };
  }, [chatId]);
  

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    setMessages(messageList);
  }, [messageList]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevList) => [...prevList, newMessage]);
      scrollToBottom();
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      chatId,
      senderId: adminId,
      text: message,
      files: fileUrls,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevList) => [...prevList, messageData]);
    scrollToBottom();

    setMessage("");
    setSelectedFiles([]);
    setFileUrls([]);
    setFilePercs([]);

    socket.emit("sendMessage", messageData);
    const result = await dispatch(createMessage(messageData));
    if (result && result.payload) {
      toast.success("Send message success", successStyle);
    } else {
      toast.error("Send message failed", errorStyle);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
    }
  };

  const formatMessageDate = (createdAt) => {
    let createdAtMoment = moment(createdAt);
    let now = moment();
    let diffDays = now.diff(createdAtMoment, "days");

    if (diffDays === 0) {
      return "hôm nay, " + createdAtMoment.format("HH:mm");
    } else if (diffDays === 1) {
      return "hôm qua, " + createdAtMoment.format("HH:mm");
    } else {
      return createdAtMoment.format("DD/MM/YYYY [lúc] HH:mm");
    }
  };

  return (
    <div className="relative z-50">
      <div
        className="fixed inset-0 bg-black opacity-30"
        onClick={() => setIsOpenChat(false)}
      ></div>
      <div className="fixed h-[32rem] right-4 bottom-20 bg-light_green rounded-lg shadow-lg max-w-sm w-full grid grid-rows-[auto_1fr_auto]">
        <AiOutlineClose
          className="absolute top-2 right-2 text-gray hover:cursor-pointer hover:text-primary_dark"
          onClick={() => setIsOpenChat(false)}
        />

        <div className="bg-light_purple rounded-t-lg p-4 flex items-center justify-between">
          <strong className="text-lg">{userName}</strong>
        </div>

        <div className="h-[90%] bg-super_light_purple rounded m-2 overflow-y-scroll p-2">
          {messages.map((msg) => (
            <div
              key={msg._id || msg.createdAt}
              className={`mb-4 p-2 rounded-lg ${
                msg.senderId === adminId
                  ? "bg-light_yellow text-white self-end ml-auto"
                  : "bg-green text-white self-start mr-auto"
              } max-w-xs w-fit`}
            >
              <p className="mb-1">
                <strong>{msg.senderId === adminId ? "Admin" : userName}</strong>{" "}
                <p> {msg.text}</p>
              </p>
              <p className="text-xs text-black mb-2">
                {formatMessageDate(msg.createdAt)}
              </p>
              {msg.files && msg.files.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {msg.files.map((fileUrl, fileIndex) => (
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

        <div className="flex items-center gap-2 bg-light_gray p-2 rounded-b-lg">
          <div className="w-fit">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FaImages className="text-gray hover:text-green mr-2" size={24} />
            </label>
          </div>

          <input
            className="flex-grow p-2 border border-light_gray rounded-full focus:outline-none focus:border-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn của bạn..."
          />

          <button
            className="w-fit bg-primary text-white rounded-md px-4 py-4 hover:bg-primary_dark transition-colors duration-200"
            onClick={handleSendMessage}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};
