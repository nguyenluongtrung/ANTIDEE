import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteReply,
  getAllFeedbacks,
  replyFeedback,
  updateReply,
} from "../../../features/domesticHelperFeedback/domesticHelperFeedbackSlice";
import { Spinner } from "../../../components";
import { formatDateTime } from "../../../utils/format";
import { GoReply } from "react-icons/go";
import { MdOutlineInsertComment } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../utils/toast-customize";

export const ReplyFeedback = () => {
  const dispatch = useDispatch();
  const { account, isLoading: accountLoading } = useSelector(
    (state) => state.auth
  );
  const { domesticHelperFeedbacks, isLoading } = useSelector(
    (state) => state.domesticHelperFeedbacks
  );
  const [replyInputs, setReplyInputs] = useState({});
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyOptions, setShowReplyOptions] = useState();
  const [showUpdateReply, setShowUpdateReply] = useState();
  const [updatedContent, setUpdatedContent] = useState();
  const [visibleUpdateReply, setVisibleUpdateReply] = useState(null);
 

  useEffect(() => {
    dispatch(getAllFeedbacks());
  }, [dispatch]);

const handleReplyClick = (feedbackId) => {
    setReplyInputs((prevState) => (prevState === feedbackId?null:feedbackId));

    setVisibleUpdateReply(null);
    setShowUpdateReply(null);

  };

  const handleCommentClick = (feedbackId) => {
    setReplyVisible((prevVisible) => (prevVisible === feedbackId?null:feedbackId));
  };

  const handleReplySubmit = async (feedbackId) => {
    if (replyContent.trim() !== "") {
      await dispatch(
        replyFeedback({
          replyData: { userId: account?._id, content: replyContent },
          feedbackId: feedbackId,
        })
      );
      setReplyContent("");
      setReplyInputs((prevState) => ({
        ...prevState,
        [feedbackId]: false,
      }));
      await dispatch(getAllFeedbacks());
    }
  };

  const toggleEditReplyVisibility = (replyId) => {
    setShowUpdateReply((prevState) => (prevState === replyId ? null : replyId));
    setReplyInputs({});
    setReplyContent("");
  };

  const handleShowReplyOptions = (replyId) => {
    setShowReplyOptions((prevState) =>
      prevState === replyId ? null : replyId
    );
  };

  //delete reply
  const handleDeleteReply = async (feedbackId, replyId) => {
    const result = await dispatch(deleteReply({ feedbackId, replyId }));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Xoá reply thành công", successStyle);
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    await dispatch(getAllFeedbacks());
  };

  //updateReply
  const handleUpdateReply = async (e, feedbackId, replyId) => {
    e.preventDefault();
    const result = await dispatch(
      updateReply({ feedbackId, replyId, content: updatedContent })
    );
    if (result.type.endsWith("fulfilled")) {
      toast.success("Cập nhật reply thành công", successStyle);
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    setShowUpdateReply(null);
    await dispatch(getAllFeedbacks());
  };

  if (isLoading && accountLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex justify-center">
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {domesticHelperFeedbacks?.map((feedback) => (
            <div className="w-80" key={feedback._id}>
              <div className="border p-4 rounded-md shadow-sm">
                <div className="flex">
                  <img
                    src={feedback?.customerId?.avatar}
                    alt="avatar"
                    className="ml-3 mr-5 rounded-full w-8 h-8 bg-green"
                  />
                  <div>
                    <p className="font-semibold">
                      {feedback?.customerId?.name}
                    </p>
                    <p className="text-xs mb-1">
                      {formatDateTime(feedback?.createdAt)}
                    </p>
                    <p className="ml-8 text-ellipsis break-words whitespace-pre-wrap">
                      {feedback?.content}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end text-sm gap-5">
                  <MdOutlineInsertComment
                    className="w-6 h-6 hover:text-green cursor-pointer"
                    onClick={() => handleCommentClick(feedback?._id)}
                  />
                  <GoReply
                    className="w-6 h-6 hover:text-green cursor-pointer"
                    onClick={() => handleReplyClick(feedback?._id)}
                  />
                </div>
              </div>
              {replyVisible === feedback?._id && (
                <div className="grid gap-3 mt-5 ">
                  {feedback?.reply?.length > 0 ? (
                    feedback.reply.map((reply) => (
                      <div className="flex  w-96">
                        <img
                          src={reply?.userId?.avatar}
                          alt="avatar"
                          className="ml-3 mr-5 rounded-full w-8 h-8 bg-green"
                        />
                        <div>
                          <div className="flex  ">
                            <p className="font-semibold w-60">
                              {reply?.userId?.name}{" "}
                            </p>
                            <HiOutlineDotsVertical
                              className="justify-end"
                              onClick={() => handleShowReplyOptions(reply?._id)}
                            />
                            {showReplyOptions === reply?._id && (
                              <div
                                className="absolute ml-64
                                                         bg-white p-2 shadow-md rounded-lg
                                                          overflow-hidden"
                              >
                                <p
                                  className="hover:text-green"
                                  onClick={() =>
                                    toggleEditReplyVisibility(reply?._id)
                                  }
                                >
                                  Update
                                </p>
                                <p
                                  className="hover:text-green"
                                  onClick={() =>
                                    handleDeleteReply(feedback?._id, reply?._id)
                                  }
                                >
                                  Delete
                                </p>
                              </div>
                            )}
                          </div>

                          <p className="text-xs mb-1">
                            {formatDateTime(reply?.createdAt)}
                          </p>
                          <p className="text-balance">{reply?.content}</p>
                          {showUpdateReply === reply?._id && (
                            <form
                              onSubmit={(e) =>
                                handleUpdateReply(e, feedback?._id, reply?._id)
                              }
                            >
                              <textarea
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Write your reply..."
                                onChange={(e) =>
                                  setUpdatedContent(e.target.value)
                                }
                                defaultValue={reply?.content}
                                required
                                maxLength={255}
                              />
                              <div className="flex justify-end gap-3">
                                <button
                                  type="submit"
                                  className="w-fit p-2 hover:text-green"
                                >
                                  Edit
                                </button>
                                <button
                                  className="w-fit p-2 hover:text-green"
                                  type="button"
                                  onClick={() =>
                                    toggleEditReplyVisibility(feedback?._id)
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No replies available</p>
                  )}
                </div>
              )}

              {replyInputs===feedback?._id && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Write your reply..."
                    value={replyContent}
                    maxLength={255}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <button
                    className="hover:text-green flex justify-end"
                    onClick={() => handleReplySubmit(feedback._id)}
                  >
                    <BiSend className=" w-8 h-8" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
