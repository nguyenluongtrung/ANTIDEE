import { GiVacuumCleaner } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa6";
import { TbArrowRampRight2, TbMessageReport } from "react-icons/tb";
import { HiOutlineHome } from "react-icons/hi";
import {
  FaHeart,
  FaImages,
  FaRegBookmark,
  FaRegComment,
  FaUser,
  FaRegHeart,
} from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import {
  MdCleaningServices,
  MdDeleteForever,
  MdDryCleaning,
  MdEdit,
  MdFiberNew,
  MdOutlineReport,
} from "react-icons/md";
import { BsPostcardHeartFill } from "react-icons/bs";
import "./ForumPage.css";
import { useEffect, useRef, useState } from "react";
import { RiEmotionLine } from "react-icons/ri";
import { AiOutlineEllipsis } from "react-icons/ai";
// import { Carousel } from "@material-tailwind/react";
import { Carousel } from "flowbite-react";
import { PiShareFat } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  deleteForumPost,
  getAllForumPosts,
  hideForumPost,
  unhideForumPost
} from "../../features/forumPost/forumPostSlice";
import { formatDateForumPost } from "../../utils/format";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../utils/toast-customize";
import { getAccountInformation } from "../../features/auth/authSlice";
import { CreatePostForum } from './CreatePostForum/CreatePostForum';
export const ForumPage = () => {
  const [isOpenCreatePostForum, setIsOpenCreatePostForum] = useState(false);
  const [isOpenUpdatePostForum, setIsOpenUpdatePostForum] = useState(false);
  
  const [chosenPostForumId, setChosenPostForumId] = useState('');
  const dispatch = useDispatch();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPostOptions, setShowPostOptions] = useState();
  const [hiddenPostIds, setHiddenPostIds] = useState([]);
  const postOptionsRef = useRef(null);
  const [undoPostId, setUndoPostId] = useState(null); // trạng thái hoàn tác

  const [accountId, setAccountId] = useState();
  console.log(accountId);

  const [forumPost, setForumPost] = useState([]);

 // Lấy danh sách bài viết
 async function initialForumPostList() {
  try {
    let output = await dispatch(getAllForumPosts());
    console.log(output.payload); // Kiểm tra dữ liệu trả về từ API
    if (output.payload) {
      let sortedPosts = [...output.payload].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setForumPost(sortedPosts);
    } else {
      console.error('No posts found.');
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}
  useEffect(() => {
    console.log(forumPost); // Kiểm tra giá trị của forumPost
  }, [forumPost]);


  useEffect(() => {
    initialForumPostList();
  }, []);
  async function initialAccountInfomation() {
    let output = await dispatch(getAccountInformation());
    setAccountId(output.payload._id);
  }

  useEffect(() => {
    initialAccountInfomation();
  }, []);

  const handleShowPostOptions = (postId) => {
    setShowPostOptions((prevState) => (prevState === postId ? null : postId));
  };
  const handleGetAllForumPosts = async () => {
    let output = await dispatch(getAllForumPosts());
    let sortedPosts = [...output.payload].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setForumPost(sortedPosts);
};
  const handleOpenCreateForumPost = () => {
    setIsOpenCreatePostForum(true);
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        postOptionsRef.current &&
        !postOptionsRef.current.contains(event.target)
      ) {
        setShowPostOptions(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Delete post

 const handleDeleteForumPost = async (forumPostId) => {
    const result = await dispatch(deleteForumPost(forumPostId));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Bài viết đã được xóa", successStyle);
  
      // Cập nhật lại danh sách bài viết sau khi xóa
      setForumPost((prevPosts) =>
        prevPosts.filter((post) => post._id !== forumPostId)
      );
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };  
  


    const handleHidePost = async (postId) => {
      try {
        const result = await dispatch(hideForumPost(postId)).unwrap();
        setHiddenPostIds((prevHiddenIds) => [...prevHiddenIds, postId]);
        // Hiển thị nút hoàn tác
        setUndoPostId(postId);
        setTimeout(() => {
          setUndoPostId(null);  // Ẩn nút hoàn tác sau một khoảng thời gian
        }, 5000);  // Ví dụ: 5 giây
      } catch (error) {
        console.error("Đã xảy ra lỗi khi ẩn bài viết:", error);
      }
    };
    const handleUndoHidePost = async (postId) => {
      try {
        const result = await dispatch(unhideForumPost(postId)).unwrap();
        console.log(`Bài viết với ID ${postId} đã được khôi phục.`);
    
        setHiddenPostIds((prevHiddenIds) =>
          prevHiddenIds.filter(id => id !== postId)
        );
    
        // Cập nhật lại trạng thái của forumPost
        setForumPost((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, isHidden: false } : post
          )
        );
      } catch (error) {
        console.error("Lỗi khi khôi phục bài viết:", error);
      }
    };

  const images = [
    "https://afamilycdn.com/150157425591193600/2024/4/21/xunca41610754610138283396792721646981210768392888n-17136875891431871750366-1713695207997-171369520808115892481.jpg",
    "https://kenh14cdn.com/203336854389633024/2024/3/20/photo-7-1710943211596924084338.jpg",
    "https://thanhnien.mediacdn.vn/Uploaded/thanhlongn/2022_02_26/phuong-my-chi-2-8128.jpg",
  ];

  return (
    <div className={`discussion ${isDarkMode ? "dark" : "light"} mt-16`}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4">
      {isOpenCreatePostForum && (
                    <CreatePostForum
                    setIsOpenCreatePostForum={setIsOpenCreatePostForum}
                        handleGetAllForumPosts={handleGetAllForumPosts}
                    />
                )}
        <div className="p-4">
          <div
            className={`bg-white ${
              isDarkMode ? "bg-dark" : "bg-light"
            } rounded-lg shadow-md p-4 space-y-2`}
          >
            <button
              className="bg-primary text-white rounded-xl px-5 py-2 w-full font-semibold	hover:bg-primary_dark fea-item"
              //   onClick={() => setIsCreateDiscussionOpen(true)}
            >
              Tạo thảo luận
            </button>
            <div className="flex items-center p-3 rounded-md gap-2 hover:bg-primary transition duration-300 cursor-pointer hvr-shutter-in-horizontal">
              <MdFiberNew className="text-white bg-red rounded-full w-7 h-7 p-1 " />
              <div className="font-semibold">Các bài mới nhất </div>
            </div>
            <div className="flex items-center p-3 rounded-md gap-2 hover:bg-primary  transition duration-300 cursor-pointer hvr-shutter-in-horizontal">
              <BsPostcardHeartFill className="text-white bg-green rounded-full w-7 h-7 p-1" />
              <div className="font-semibold">Phổ biến nhất trong ngày</div>
            </div>
            <div className="flex items-center p-3 rounded-md gap-2 hover:bg-primary  transition duration-300 cursor-pointer hvr-shutter-in-horizontal">
              <FaUser className="text-white bg-blue rounded-full w-7 h-7 p-1" />
              <div className="font-semibold">Đang theo dõi</div>
            </div>
          </div>

          <div
            className={`bg-white ${
              isDarkMode ? "bg-dark" : "bg-light"
            } mt-4 p-6 rounded-lg shadow-lg`}
          >
            <h2 className="text-base font-semibold mb-3">Chủ đề phổ biến</h2>
            <div>
              <div className="flex items-center mb-4 hover:bg-primary p-2 rounded-lg cursor-pointer hvr-shutter-in-horizontal group">
                <MdCleaningServices className="mr-2 text-red w-8 h-8 group-hover:text-white" />
                <div className="font-semibold">Giúp việc</div>
              </div>
              <div className="flex items-center mb-4 hover:bg-primary p-2 rounded-lg cursor-pointer hvr-shutter-in-horizontal group">
                <MdDryCleaning className="mr-2 text-blue w-8 h-8 group-hover:text-white" />
                <div className="font-semibold">Chăm sóc người bệnh</div>
              </div>
              <div className="flex items-center mb-4 hover:bg-primary p-2 rounded-lg cursor-pointer hvr-shutter-in-horizontal group">
                <GiVacuumCleaner className="mr-2 text-green w-8 h-8 group-hover:text-white" />
                <div className="font-semibold">Đi chợ</div>
              </div>
            </div>
            {/* <button
              className="flex items-center w-full justify-center text-sm
                             text-white font-semibold rounded-md p-2
                              bg-orange hover:bg-orange-600 transition duration-300"
            >
              Đăng tin
              <FaPenSquare className="mt-1 ml-2" />
            </button> */}
          </div>
        </div>
        <div className="p-4">
          <div className="">
            <div
              className={`relative flex flex-col  ${
                isDarkMode ? "bg-dark" : "bg-light"
              } rounded-lg shadow-lg p-4`}
            >
              <div className="flex justify-around">
                <div className="">
                  <img
                    alt="avatar"
                    src="https://m.media-amazon.com/images/I/51WHgHxF5YL._AC_UF1000,1000_QL80_.jpg"
                    className="w-14 h-14 rounded-full"
                  />
                </div>
                <button className=" w-[85%] rounded-full border border-gray flex items-center px-4 font-medium text-gray cursor-pointer hover:bg-[#F6F6F6]" 
                onClick={handleOpenCreateForumPost}
                >
                
                  Nêu lên suy nghĩ của bạn?
                </button>
              </div>
              <div className="flex justify-around border-0 border-t-2 border-light_gray mt-4 p-4 pb-0">
                <div className="flex justify-center items-center w-[45%] hover:bg-light_gray cursor-pointer rounded-xl">
                  <FaImages size={30} className="m-2 ml-0 text-green" /> Thêm
                  ảnh và video
                </div>
                <div className="flex justify-center items-center w-[45%] hover:bg-light_gray cursor-pointer rounded-xl">
                  <RiEmotionLine size={30} className="m-2 ml-0 text-yellow" />
                  Hoạt động
                </div>
              </div>
            </div>
          </div>

          {/* Header */}

          

      {forumPost?.map((post, index) => {
        const isHidden = hiddenPostIds.includes(post._id);

        return (
          <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
            {isHidden ? (
              <div className="flex justify-center mt-4">
                <button
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                  onClick={() => handleUndoHidePost(post._id)}
                >
                  Hoàn tác Ẩn
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between">
                  <div className="flex items-center px-4 py-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={post?.author?.avatar}
                      alt="User avatar"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-semibold text-gray-900">
                        <div>{post?.author?.name} ({post?.author?.role})</div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatDateForumPost(post?.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="mx-4 my-3 flex items-center justify-center cursor-pointer w-10 h-10 rounded-full hover:bg-light_gray text-center">
                    <AiOutlineEllipsis
                      size={30}
                      onClick={() => handleShowPostOptions(post?._id)}
                    />
                    {showPostOptions === post?._id && (
                      <div
                        ref={postOptionsRef}
                        className="absolute bg-white shadow-lg rounded-lg p-2 max-w-48"
                      >
                        <ul>
                          <li className="cursor-pointer hover:bg-light_gray rounded-lg p-2">
                            <div className="flex items-center">
                              <MdEdit className="mr-2" />
                              <span>Chỉnh sửa</span>
                            </div>
                            <p className="text-xs text-gray text-left">
                              Chỉnh sửa nội dung bài đăng của bạn
                            </p>
                          </li>
                          {post?.author?._id === accountId ? (
                            <li className="cursor-pointer hover:bg-light_gray rounded-lg p-2"  onClick={() => handleDeleteForumPost(post?._id)}>
                              <div
                                className="flex items-center"  >
                                <MdDeleteForever className="mr-2" />
                                <span>Xóa</span>
                              </div>
                              <p className="text-xs text-gray text-left">
                                Bài đăng này của bạn sẽ bị xóa vĩnh viễn
                              </p>
                            </li>
                          ) : (
                            <li className="cursor-pointer hover:bg-light_gray rounded-lg p-2" onClick={() => handleHidePost(post._id)}>
                              <div className="flex items-center">
                                <MdDeleteForever className="mr-2" />
                                <span>Ẩn</span>
                              </div>
                              <p className="text-xs text-gray text-left">
                                Bài viết sẽ bị ẩn khỏi bạn
                              </p>
                            </li>
                          )}
                          <li className="cursor-pointer hover:bg-light_gray rounded-lg p-2">
                            <div className="flex items-center">
                              <TbMessageReport className="mr-2" />
                              <span>Báo cáo bài viết</span>
                            </div>
                            <p className="text-xs text-gray text-left">
                              Hãy cho chúng tôi biết bài viết này có vấn đề gì
                            </p>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nội dung bài viết */}
                <div className="my-2 px-4 py-2">
                  <p className="text-black text-base">{post?.content}</p>
                </div>

                {/* Hình ảnh của bài viết */}
                {post?.images?.map((image, index) => (
                  <img
                    key={index}
                    className="w-full object-cover"
                    src={image}
                    alt="Post image"
                  />
                ))}

                <div className="my-3 flex justify-around items-center">
                  <div className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal">
                    <FaRegHeart className="mr-2" />
                    Thích
                  </div>
                  <div className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal">
                    <FaRegComment className="mr-2" /> Bình Luận
                  </div>
                  <div className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal">
                    <PiShareFat className="mr-2" />
                    Chia sẻ
                  </div>
                  <div className="flex items-center cursor-pointer rounded-xl hover:bg-primary hover:text-white px-3 py-2 hvr-shutter-in-horizontal">
                    <FaRegBookmark className="mr-2" />
                    Lưu
                  </div>
                </div>

                {/* Phần bình luận */}
                <div className="px-4 py-2 border-t">
                  {post.comments.map((comment, index) => (
                    <div className="flex mb-4" key={index}>
                      <img
                        className="h-8 w-8 rounded-full object-cover mt-3"
                        src={comment.author?.avatar}
                        alt="Commenter avatar"
                      />
                      <div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
                        <div className="bg-[#f0efef] p-2 w-full rounded-xl">
                          <div className="text-sm font-semibold text-gray-900 flex justify-between">
                            {comment.author?.name}
                            <MdOutlineReport
                              size={20}
                              className="hover:text-primary cursor-pointer"
                            />
                          </div>
                          <p className="text-sm text-gray-700">{comment?.content}</p>
                        </div>
                        <div className="flex justify-between mt-2 ml-2 pr-2 w-full">
                          <div className="flex">
                            <button className="flex items-center hover:text-anotherRed">
                              <FaRegHeart className="mr-1" />
                              <span className="text-sm">Thích</span>
                            </button>
                            <button className="flex items-center ml-6 hover:text-primary">
                              <FaRegComment className="mr-1" />
                              <span className="text-sm w-[60px]">Phản hồi</span>
                            </button>
                          </div>
                          <div className="flex">
                            <div className="flex items-center">
                              <span className="text-sm mr-1">100</span>
                              <FaHeart className="text-anotherRed" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Thẻ nhập bình luận */}
                  <div className="flex items-center mt-5 h-10">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/391627726_2229687603896740_6420573741491573149_n.jpg"
                      alt="Your avatar"
                    />
                    <div className="flex items-center ml-3 w-full rounded-full px-3 py-2 group focus-within:border-2">
                      <input
                        className="w-full bg-gray text-sm text-gray focus:outline-none"
                        type="text"
                        placeholder="Viết bình luận của bạn"
                      />
                      <div className="ml-2 text-blue">
                        <IoSend className="hover:text-primary cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}



        </div>
        <div className="p-4">
          <div
            className={`bg-white ${
              isDarkMode ? "bg-dark" : "bg-light"
            } p-4 mt-4 rounded-lg shadow-md`}
          >
            <strong className="text-base font-bold block mb-4">
              Thảo luận hàng đầu
            </strong>
            <div className="flex items-center p-2 gap-x-2 rounded-xl cursor-pointer hover:bg-primary hvr-shutter-in-horizontal mb-4">
              <HiOutlineHome className="mx-2" />
              Trang chủ
            </div>
            <div className="flex items-center p-2 gap-x-2 rounded-xl cursor-pointer hover:bg-primary hvr-shutter-in-horizontal mb-4">
              <FaRegUser className="mx-2" />
              Trang cá nhân
            </div>
          </div>
          <div
            className={`bg-white ${
              isDarkMode ? "bg-dark" : "bg-light"
            } p-4 mt-4 rounded-lg shadow-md`}
          >
            <strong className="text-base font-bold block mb-4">
              Thảo luận hàng đầu
            </strong>
            {/* {topDiscussions?.map((discussion) => {
              return ( */}
            <div className="p-2 rounded-lg mb-3 border border-light_gray hover:bg-light_gray cursor-pointer">
              <p className="text-base font-semibold mb-3">
                {/* {discussion.title} */}
                Lộ clip dọn nhà
              </p>
              <div>
                {/* {discussion.topics.map((topic) => {
                      return ( */}
                <span className="bg-primary mr-3 px-4 py-1 rounded-md text-white">
                  {/* {topic} */}
                  giúp việc
                </span>
                {/* //   );
                    // })} */}

                <p className=" mt-3 text-sm flex items-center gap-1">
                  1<FaRegHeart size={10} />
                </p>
              </div>
            </div>
            {/* );
            })} */}
          </div>
          <div
            className={`bg-white ${
              isDarkMode ? "bg-dark" : "bg-light"
            } p-4 mt-4 rounded-lg shadow-md`}
          >
            <div className="flex justify-between gap-10">
              <strong className="text-base font-bold block mb-4">
                Lượt truy cập người dùng
              </strong>
              <p className="text-blue font-semibold hover:text-blue-900 cursor-pointer">
                Tất cả
              </p>
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <img
                  alt="avatar"
                  src="https://m.media-amazon.com/images/I/51WHgHxF5YL._AC_UF1000,1000_QL80_.jpg"
                  className="rounded-full border w-8 h-8"
                />
                <div className="ml-4">
                  <p className="block font-semibold">Hung Dinh</p>
                  <p className="text-gray">#hungdinh@</p>
                </div>
                <div className="ml-auto flex items-center rounded-full border border-blue text-blue hover:bg-blue hover:text-white">
                  <IoIosAdd className=" text-2xl ml-1" />
                  <button className=" text-sm font-semibold py-1 px-2">
                    Theo dõi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};