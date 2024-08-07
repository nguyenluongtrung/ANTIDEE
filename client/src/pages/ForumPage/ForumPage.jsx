import { GiVacuumCleaner } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa6";
import { TbArrowRampRight2 } from "react-icons/tb";
import { HiOutlineHome } from "react-icons/hi";
import {
  FaHeart,
  FaImages,
  FaRegBookmark,
  FaRegComment,
  FaUser,
  FaRegHeart
} from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import {
  MdCleaningServices,
  MdDryCleaning,
  MdFiberNew,
  MdOutlineReport,
} from "react-icons/md";
import { BsPostcardHeartFill } from "react-icons/bs";
import "./ForumPage.css";
import { useEffect, useState } from "react";
import { RiEmotionLine } from "react-icons/ri";
import { AiOutlineEllipsis } from "react-icons/ai";
// import { Carousel } from "@material-tailwind/react";
import { Carousel } from "flowbite-react";
import { PiShareFat } from "react-icons/pi";
import { IoSend } from "react-icons/io5";

export const ForumPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const images = [
    "https://afamilycdn.com/150157425591193600/2024/4/21/xunca41610754610138283396792721646981210768392888n-17136875891431871750366-1713695207997-171369520808115892481.jpg",
    "https://kenh14cdn.com/203336854389633024/2024/3/20/photo-7-1710943211596924084338.jpg",
    "https://thanhnien.mediacdn.vn/Uploaded/thanhlongn/2022_02_26/phuong-my-chi-2-8128.jpg",
  ];

  return (
    <div className={`discussion ${isDarkMode ? "dark" : "light"} mt-16`}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-4">
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
              <div className="font-semibold">Các bài mới nhất</div>
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
                <div className=" w-[85%] rounded-full border border-gray flex items-center px-4 font-medium text-gray cursor-pointer hover:bg-[#F6F6F6]">
                  Nêu lên suy nghĩ của bạn?
                </div>
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

          <div className="bg-white shadow-md rounded-lg overflow-hidden mt-4">
            {/* Header */}
            <div className="flex justify-between">
              <div className="flex items-center px-4 py-3">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src="https://via.placeholder.com/150"
                  alt="User avatar"
                />
                <div className="ml-3">
                  <div className="text-sm font-semibold text-gray-900">
                    Đinh Văn Toàn (Người giúp việc)
                  </div>
                  <div className="text-xs text-gray-600">2 hours ago</div>
                </div>
              </div>
              <div className="mx-4 my-3 flex items-center justify-center cursor-pointer w-10 h-10 rounded-full hover:bg-light_gray text-center">
                <AiOutlineEllipsis size={30} />
              </div>
            </div>

            {/* Content */}
            <div className="my-2 px-4 py-2">
              <p className="text-black text-base">
                This is a sample post content. Here you can write your thoughts
                and share with your friends.
              </p>
            </div>

            {/* Image */}
            <img
              className="w-full object-cover"
              src="https://cafefcdn.com/thumb_w/640/203337114487263232/2022/1/26/photo1643191347252-16431913475531025224649.jpg"
              alt="Post image"
            />
            {/* <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
              <Carousel>
              {images.map((image, index) => {
                return (
                  <>
                    <img
                      src={image}
                      alt="image 1"
                      className="w-full object-cover"
                    />
                  </>
                );
              })}
              </Carousel>
            </div> */}

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
            {/* Comments Section */}

            <div className="px-4 py-2 border-t">
              {/* Thẻ comment có chưa phản hồi */}
              <div className="flex mb-4">
                <img
                  className="h-8 w-8 rounded-full object-cover mt-3"
                  src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/391627726_2229687603896740_6420573741491573149_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=J7mzehA4Z1sQ7kNvgEUTQ9j&_nc_ht=scontent.fsgn2-9.fna&gid=A-3Yb5bx_mg6VqvNRuTaZRR&oh=00_AYCGQQe0yWk87DuEteAu_N0Axe-H83yUqD59ce43gpEmvw&oe=66AFCF1D"
                  alt="Commenter avatar"
                />
                <div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
                  <div className="bg-[#f0efef] p-2 w-full rounded-xl">
                    <div className="text-sm font-semibold text-gray-900 flex justify-between">
                      Hưng Đinh
                      <MdOutlineReport
                        size={20}
                        className="hover:text-primary cursor-pointer"
                      />
                    </div>
                    <p className="text-sm text-gray-700">
                      Nội dung thật tuyệt vời
                    </p>
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
                      <div className="flex items-center ">
                        <span className="text-sm mr-1">100</span>
                        <FaHeart className="text-anotherRed" />
                      </div>
                    </div>
                  </div>
                  {/*Thẻ comment Phản hồi */}
                  <div className="flex my-2">
                    <img
                      className="h-8 w-8 rounded-full object-cover mt-3"
                      src="https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/448995705_2362437390816204_1693027978788705460_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=O191nMwmcOQQ7kNvgG2QagT&_nc_ht=scontent.fsgn2-3.fna&oh=00_AYDDqwFe7A8vIhDg9nNP0Q8fXzo16UPSiM78cxLuDDPN5w&oe=66AFCC60"
                      alt="Commenter avatar"
                    />
                    <div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
                      <div className="bg-[#f0efef] p-2 w-full rounded-xl">
                        <div className="text-sm font-semibold text-gray-900 flex justify-between">
                          Lương Trung
                          <MdOutlineReport
                            size={20}
                            className="hover:text-primary cursor-pointer"
                          />
                        </div>
                        <p className="text-sm text-gray-700">Chắc chưa?</p>
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
                          <div className="flex items-center ">
                            <span className="text-sm mr-1">100</span>
                            <FaHeart className="text-anotherRed" />
                          </div>
                        </div>
                      </div>

                      {/* Bấm vào phản hồi thì hiện thẻ này ==================== */}
                      <div className="flex items-center mt-4">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/391627726_2229687603896740_6420573741491573149_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=J7mzehA4Z1sQ7kNvgEUTQ9j&_nc_ht=scontent.fsgn2-9.fna&gid=A-3Yb5bx_mg6VqvNRuTaZRR&oh=00_AYCGQQe0yWk87DuEteAu_N0Axe-H83yUqD59ce43gpEmvw&oe=66AFCF1D"
                          alt="Your avatar"
                        />
                        <input
                          className="ml-3 w-full bg-gray-100 rounded-full px-3 py-2 text-sm text-gray-700"
                          type="text"
                          placeholder="Phản hồi bình luận Trung"
                        />
                      </div>
                      {/* ====================================================== */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Một thẻ Comment căn bản */}
              <div className="flex mb-4">
                <img
                  className="h-8 w-8 rounded-full object-cover mt-3"
                  src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/391627726_2229687603896740_6420573741491573149_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=J7mzehA4Z1sQ7kNvgEUTQ9j&_nc_ht=scontent.fsgn2-9.fna&gid=A-3Yb5bx_mg6VqvNRuTaZRR&oh=00_AYCGQQe0yWk87DuEteAu_N0Axe-H83yUqD59ce43gpEmvw&oe=66AFCF1D"
                  alt="Commenter avatar"
                />
                <div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
                  <div className="bg-[#f0efef] p-2 w-full rounded-xl">
                    <div className="text-sm font-semibold text-gray-900 flex justify-between">
                      Hưng Đinh
                      <MdOutlineReport
                        size={20}
                        className="hover:text-primary cursor-pointer"
                      />
                    </div>
                    <p className="text-sm text-gray-700">
                      Nội dung thật tuyệt vời
                    </p>
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
                      <div className="flex items-center ">
                        <span className="text-sm mr-1">100</span>
                        <FaHeart className="text-anotherRed" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm ml-2 mt-2 flex items-center cursor-pointer hover:text-primary group">
                    <TbArrowRampRight2
                      size={20}
                      className="mr-2 group-hover:text-primary"
                    />
                    Nhấp vào để xem thêm 2 phản hồi khác
                  </div>
                </div>
              </div>

              {/* Một thẻ Comment căn bản */}
              <div className="flex mb-4">
                <img
                  className="h-8 w-8 rounded-full object-cover mt-3"
                  src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/391627726_2229687603896740_6420573741491573149_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=J7mzehA4Z1sQ7kNvgEUTQ9j&_nc_ht=scontent.fsgn2-9.fna&gid=A-3Yb5bx_mg6VqvNRuTaZRR&oh=00_AYCGQQe0yWk87DuEteAu_N0Axe-H83yUqD59ce43gpEmvw&oe=66AFCF1D"
                  alt="Commenter avatar"
                />
                <div className="ml-2 bg-gray-100 rounded-lg px-3 py-2">
                  <div className="bg-[#f0efef] p-2 w-full rounded-xl">
                    <div className="text-sm font-semibold text-gray-900 flex justify-between">
                      Hưng Đinh
                      <MdOutlineReport
                        size={20}
                        className="hover:text-primary cursor-pointer"
                      />
                    </div>
                    <p className="text-sm text-gray-700">
                      Nội dung thật tuyệt vời
                    </p>
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
                      <div className="flex items-center ">
                        <span className="text-sm mr-1">100</span>
                        <FaHeart className="text-anotherRed" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thẻ Nhập bình luận cho bài viết =================================== */}
              <div className="flex items-center mt-5 h-10">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/391627726_2229687603896740_6420573741491573149_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=J7mzehA4Z1sQ7kNvgEUTQ9j&_nc_ht=scontent.fsgn2-9.fna&gid=A-3Yb5bx_mg6VqvNRuTaZRR&oh=00_AYCGQQe0yWk87DuEteAu_N0Axe-H83yUqD59ce43gpEmvw&oe=66AFCF1D"
                  alt="Your avatar"
                />
                <div className="flex items-center ml-3 w-full rounded-full px-3 py-2 group focus-within:border-2">
                  <input
                    className="w-full bg-gray-100 text-sm text-gray-700 focus:outline-none"
                    type="text"
                    placeholder="Viết bình luận của bạn"
                  />
                  <div className="ml-2 text-blue-500">
                    <IoSend className="hover:text-primary cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Thẻ Nhập bình luận cho bài viết =================================== */}
            </div>
          </div>
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
            <div className="flex items-center p-2 gap-x-2 rounded-xl cursor-pointer hover:bg-primary hvr-shutter-in-horizontal mb-4" ><HiOutlineHome  className="mx-2" />Trang chủ</div>
            <div className="flex items-center p-2 gap-x-2 rounded-xl cursor-pointer hover:bg-primary hvr-shutter-in-horizontal mb-4" ><FaRegUser className="mx-2" />Trang cá nhân</div>
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
