import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/locale/vi";
import { MdAdd } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  createMessage,
  getAllMessage,
} from "../../features/message/messageSlice";
import toast from "react-hot-toast";
import { errorStyle } from "../../utils/toast-customize";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
moment.locale('vi');

const ChatBox = ({
  chosenChatBox,
  myAccountId,
  messageChat,
  setMessageChat,
  chatting,
  setNewMessages,
}) => {
  const dispatch = useDispatch();
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  }, [selectedFile]);

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
        toast.error("File upload failed", errorStyle);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFileUrl(downloadURL)
        );
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
        file: fileUrl,
      };
      const result = await dispatch(createMessage(messageData));
      if (result.type.endsWith("fulfilled")) {
        socket.emit("sendMessage", messageData);

        setNewMessages((prevNewMessages) => ({
          ...prevNewMessages,
          [chosenChatBox]: false,
        }));
        setMessageText("");
        setSelectedFile(null);
        setFileUrl("");
        setFilePerc(0);
      } else {
        toast.error("Send message failed", errorStyle);
      }
    } catch (error) {
      toast.error("Failed to send message", errorStyle);
    }
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
        style={{ display: 'flex', flexDirection: 'column-reverse', scrollBehavior: 'smooth' }}
      >
        {messageChat
          ?.filter((msg) => msg?.chatId === chosenChatBox)
          .reverse()
          .map((msg) => (
            <div
              key={msg?._id}
              className={`grid shadow-2xl mt-3 w-fit p-3 rounded-lg
                         ${msg?.senderId === myAccountId
                  ? "bg-light_yellow ml-auto"
                  : "bg-light_primary"
                } `}
            >
              {msg.text}
              {msg.file && (
                <div className="mb-2">
                  <a href={msg.file} target="_blank" rel="noopener noreferrer">
                    <img
                      src={msg.file}
                      alt="uploaded"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </a>
                </div>
              )}
              <span className="text-xs text-right">
                {moment(msg?.createdAt).locale("vi").calendar()}
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
          className="bg-green text-black p-2 w-fit rounded-lg flex items-center justify-center">
          <BiSend className="w-7 h-7" />
        </button>
      </form>
      {selectedFile && (
        <div className="mt-2 ml-20 shadow-lg w-fit p-2 rounded-lg bg-light_purple">
          {filePerc > 0 && (
            <div className="text-center ">
              {filePerc === 100 && (
                <div className="text-xs">Tải ảnh thành công</div>
              )}
              <div
                className="h-1 bg-green rounded-lg"
                style={{
                  width: `${filePerc}%`,
                  transition: "width 0.1s linear",
                }}
              />
            </div>
          )}
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            className="w-32 h-32 object-cover inline-block rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
