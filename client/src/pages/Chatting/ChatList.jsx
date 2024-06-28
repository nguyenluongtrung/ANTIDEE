import React from "react";
import { BiSearch } from "react-icons/bi";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createChat } from "../../features/chatting/chattingSlice";

const ChatList = ({
  myAccountId,
  accounts,
  account,
  searchName,
  setSearchName,
  filteredUsers,
  chatting,
  newMessages,
  setChosenChatBox,
  setOpenChatBox,
  initialChatting,
}) => {
  const dispatch = useDispatch();
  console.log(myAccountId)

  const handleCreateChat = async (secondUserId) => {
    try {
      const chatData = {
        firstId: myAccountId,
        secondId: secondUserId,
      };

      const result = await dispatch(createChat(chatData));
      if (result.type.endsWith("fulfilled")) {
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

  const onSearchChange = (e) => {
    setSearchName(e.target.value);
  };

  return (
    <div className="col-span-1">
      <div className="flex items-center shadow-lg p-2 rounded-lg bg-white">
        <BiSearch className="text-gray mr-2" />
        <input
          className="w-full p-2 outline-none text-gray"
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
                className={`flex items-center space-x-4 p-4 rounded-2xl shadow-lg mt-2 ${
                  newMessages[chat._id] ? "bg-yellow" : ""
                }`}
                onClick={() => {
                  setChosenChatBox(chat?._id);
                  setOpenChatBox(true);
                }}
              >
                <div className="relative inline-block">
                  {newMessages[chat._id] && (
                    <div className="w-3 h-3 bg-red rounded-full absolute top-0 right-0"></div>
                  )}
                  <img
                    src={
                      String(myAccountId) === String(chat?.firstId?._id)
                        ? String(chat?.secondId?.avatar)
                        : String(chat?.firstId?.avatar)
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full border border-gray"
                  />
                </div>
                <div className="grid">
                  <span className="text-gray font-medium">
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
  );
};

export default ChatList;
