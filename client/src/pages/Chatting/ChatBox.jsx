import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { createMessage } from "../../features/message/messageSlice";
import toast from "react-hot-toast";
import { errorStyle } from "../../utils/toast-customize";
import { io } from "socket.io-client";
import { formatDateMessage} from "../../utils/format";
const socket = io("http://localhost:5000");

const ChatBox = ({
  chosenChatBox,
  myAccountId,
  messageChat,
  setNewMessages,
  chatting,
}) => {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePercs, setFilePercs] = useState([]);
  const [fileUrls, setFileUrls] = useState([]);

  console.log(filePercs);
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
        files: fileUrls,
      };
      const result = await dispatch(createMessage(messageData));
      if (result.type.endsWith("fulfilled")) {
        socket.emit("sendMessage", messageData);

        setNewMessages((prevNewMessages) => ({
          ...prevNewMessages,
          [chosenChatBox]: false,
        }));
        setMessageText("");
        setSelectedFiles([]);
        setFileUrls([]);
        setFilePercs([]);
      } else {
        toast.error("Send message failed", errorStyle);
      }
    } catch (error) {
      toast.error("Failed to send message", errorStyle);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center mb-4 md:mb-0">
        <strong>
          {(() => {
            const chatBox = chatting.find(
              (chat) => String(chat._id) === String(chosenChatBox)
            );
            if (!chatBox) return "";

            return String(myAccountId) === String(chatBox.firstId?._id)
              ? chatBox.secondId?.name
              : chatBox.firstId?.name;
          })()}
        </strong>
      </div>

      <div
        className="bg-light_purple shadow-2xl rounded-xl h-64 md:h-96 p-5 overflow-y-auto"
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          scrollBehavior: "smooth",
        }}
      >
        {messageChat
          ?.filter((msg) => msg?.chatId === chosenChatBox)
          .reverse()
          .map((msg) => (
            <div
              key={msg?._id}
              className={`grid shadow-2xl mt-3 w-fit p-3 rounded-lg
                 ${
                   msg?.senderId === myAccountId
                     ? "bg-light_yellow ml-auto"
                     : "bg-light_primary"
                 } `}
            >
              {msg.text}
              {msg.files && (
                <div
                  className={`grid gap-2 ${
                    msg.files.length === 1
                      ? "grid-cols-1"
                      : msg.files.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {msg.files.map((file, index) => (
                    <div key={index} className="mb-2">
                      <a href={file} target="_blank" rel="noopener noreferrer">
                        <img
                          src={file}
                          alt="uploaded"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </a>
                    </div>
                  ))}
                </div>
              )}
              <span className="text-xs text-right">
                {formatDateMessage(msg?.createdAt)}
              </span>
            </div>
          ))}
      </div>

      <form className="flex mt-5" onSubmit={handleSendMessage}>
        <div className="relative p-2 w-fit rounded-lg cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="file-upload"
            onChange={(e) => setSelectedFiles([...e.target.files])}
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
      {selectedFiles.length > 0 && (
        <div className="mt-2 ml-20 shadow-lg w-fit p-2 rounded-lg bg-light_purple flex">
          {filePercs.map((perc, index) => (
            <div key={index} className="text-center mb-2 mr-5">
              {perc > 0 && (
                <>
                  {perc === 100 && (
                    <div className="text-xs">Tải ảnh thành công</div>
                  )}
                  <div
                    className="h-1 bg-green rounded-lg"
                    style={{
                      width: `${perc}%`,
                      transition: "width 0.1s linear",
                    }}
                  />
                </>
              )}
              <img
                src={URL.createObjectURL(selectedFiles[index])}
                alt="preview"
                className="w-32 h-32 object-cover inline-block rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
