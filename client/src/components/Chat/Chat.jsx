import { useState, useEffect } from "react";
import { BsFillChatDotsFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { createChat } from "../../features/chatting/chattingSlice";
import { getAccountInformation } from "../../features/auth/authSlice";
import { Chatbox } from "../../pages/Chatting/ChatBox";

export const Chat = () => {
    const [myAccountId, setMyAccountId] = useState("");
    const [adminId, setAdminId] = useState("6631e32a7bd68b4a01b2f363");
    const [openChat, setIsOpenChat] = useState(false);
    const dispatch = useDispatch();
    console.log(myAccountId)

    async function initialAccountId() {
        let output = await dispatch(getAccountInformation());
        setMyAccountId(output.payload._id);
    }

    useEffect(() => {
        initialAccountId();
    }, [myAccountId]);

    const handleOpenAndCreateChat= () => {
        setIsOpenChat(true);

        const chatData = {
            firstId: myAccountId,
            secondId: adminId,
        };

        dispatch(createChat(chatData));
    };



    return (
        <div className="fixed bottom-[7%] right-[4.8%] lg:bottom-32 lg:right-[3%]  z-50">
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
            />
        )}
    </div>
    

    );
};
