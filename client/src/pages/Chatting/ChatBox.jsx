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
import { createMessage, getMessage } from "../../features/message/messageSlice";
import { app } from "../../firebase";
import { errorStyle, successStyle } from "../../utils/toast-customize";
moment.locale("vi");

const socket = io("http://localhost:5000");

export const Chatbox = ({
  openChat,
  setIsOpenChat,
  myAccountId,
  chatId,
  myRole,
  userName,
  userAvatar
}) => {
  if (!openChat) return null;

  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [fileUrls, setFileUrls] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePercs, setFilePercs] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const messageEndRef = useRef(null);

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
      return "Today, " + createdAtMoment.format("HH:mm");
    } else if (diffDays === 1) {
      return "Yesterday, " + createdAtMoment.format("HH:mm");
    } else {
      return createdAtMoment.format("DD/MM/YYYY [at] HH:mm");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

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
          <strong className="text-base">
            {myRole === "Admin" ? (
              <>
                <img src={userAvatar} alt="User Avatar" className="inline-block w-6 h-6 rounded-full mr-2" />
                {userName}
              </>
            ) : (
              "Admin"
            )}
          </strong>
        </div>
        <div className="h-[90%] rounded m-2 overflow-y-scroll p-2 flex flex-col">
          {messageList.map((message, index) => (
            <div>
              <div
                key={message._id || `${message.createdAt}-${index}`}
                className={`mb-2 p-2 max-w-64 w-fit ${message.senderId === myAccountId
                  ? "bg-light_yellow rounded text-white self-end ml-auto"
                  : "bg-green rounded text-white self-start mr-auto"
                  } max-w-xs w-fit`}
              >
                <p className="mb-1 text-sm ml-2">
                  {message.text}{ }
                </p>
                {message.files && message.files.length > 0 && (
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
              <p className={`text-xs${message.senderId === myAccountId
                  ? " text-gray self-end ml-auto"
                  : " text-gray self-start mr-auto"
                  } max-w-xs w-fit`}>
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
            placeholder="Nhập tin nhắn của bạn"
          />
          <button
            className="w-fit  text-primary rounded-md px-4 py-4 transition-colors duration-200"
            onClick={handleSendMessage}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};
