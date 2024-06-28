import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillChatDotsFill } from "react-icons/bs";
import { ChatForm } from "../../pages/Chatting/ChatForm";

export const Chat = () => {
    const [openChat, setIsOpenChat] = useState(false);

    return (
        <div className="fixed right-0 top-0 flex items-center h-screen z-50 mr-[-40px]">
            <strong
                className="text-white bg-green transform -rotate-90 items-center flex gap-2 p-2 rounded-md cursor-pointer"
                onClick={() => setIsOpenChat(!openChat)} 
            >
                <BsFillChatDotsFill size={24} />
                Nhắn tin
            </strong>
            {openChat && (
                <div className="popup active">
                    <div
                        className="overlay"
                        onClick={() => setIsOpenChat(false)}
                    ></div>
                    <div className="content rounded-md relative">
                        <AiOutlineClose
                            className="absolute top-2 right-2 text-sm hover:cursor-pointer"
                            onClick={() => setIsOpenChat(false)}
                        />
                   
                    </div>
                </div>
            )}
        </div>
    );
};
