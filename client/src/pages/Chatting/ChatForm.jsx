import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { errorStyle, successStyle } from "../../utils/toast-customize";
import toast from "react-hot-toast";
import { Spinner } from "../../components";
import { createChat } from "../../features/chatting/chattingSlice";

export const ChatForm = ({ domesticHelperId }) => {
    const { isLoading: isChatLoading } = useSelector((state) => state.chatting);
    const { account, isLoading: isAuthLoading } = useSelector(
        (state) => state.auth
    );

    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleCreateChat = async (data) => {
        const chatData = {
            ...data,
            customerId,
            domesticHelperId,
        };
        const result = await dispatch(createChat(chatData));
        console.log(result);
        if (result.type.endsWith("fulfilled")) {
            toast.success("tạo chat thành công", successStyle);
        } else if (result?.error?.message === "Rejected") {
            toast.error(result?.payload, errorStyle);
        }
    };

    if (isAuthLoading || isChatLoading) {
        return <Spinner />;
    }

    return (
        <div className="popup active w-96 h-80 p-10">
        <div className="table-header-group">
            <strong>CHATBOX</strong>
        </div>
        <div className="h-72 border bg-gray p-2 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <span>chỗ này bỏ text</span>
                <span>chỗ này là thời gian</span>
            </div>
        </div>
        <div className="flex gap-2 mt-2">
            <input className="w-full border p-2" placeholder="Type your message here"></input>
            <button className="w-fit p-2 bg-green text-white">Send Message</button>
        </div>
    </div>
    
    );
};
