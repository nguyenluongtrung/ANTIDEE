import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import promotionBackground from "../../../assets/img/promotion-background.png";
import giupviec from "../../../assets/img/giupviec.jpg";
import { getAllPromotions } from "../../../features/promotions/promotionSlice";
import { formatDate } from "../../../utils/format";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PromotionPage = () => {
    const [promotionList, setPromotionList] = useState([]);
    const dispatch = useDispatch();


    const isPromotionActive = (promotion) => {
        const today = new Date();
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        return startDate <= today && endDate >= today;
    };

  
    async function initialPromotionList() {
        try {
            const output = await dispatch(getAllPromotions());
            if (output.payload) {
                const activePromotions = output.payload.filter(isPromotionActive);
                setPromotionList(activePromotions);
            }
        } catch (error) {
            console.error("Error fetching promotions:", error);
        }
    }

    useEffect(() => {
        initialPromotionList();
    }, []);

    const NextArrow = (props) => {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute bottom-[-28px] right-14 bg-gray text-white font-bold text-lg 
                rounded-full p-2 shadow-lg hover:bg-gray transition-colors duration-200 
                transform hover:scale-105 w-fit h-6 z-10 flex items-center justify-center"
            >
                &gt;
            </button>
        );
    };

    const PrevArrow = (props) => {
        const { onClick } = props;
        return (
            <button
                onClick={onClick}
                className="absolute bottom-[-28px] left-14 bg-gray text-white font-bold text-lg 
                rounded-full p-2 shadow-lg hover:bg-gray transition-colors duration-200 
                transform hover:scale-105 w-fit h-6 z-10 flex items-center justify-center"
            >
                &lt;
            </button>
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="relative mt-20 w-full h-[35vw]">
            <img
                alt="promotion background"
                src={promotionBackground}
                className="w-full h-full"
            />
            <img
                src={giupviec}
                className="absolute top-[51%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full object-cover w-[420px] h-[420px] border-4 border-primary"
            />
            <div className="absolute top-[36%] left-[22%] transform -translate-x-1/2 rotate-[9deg] text-black font-extrabold text-5xl">
                BÙNG NỔ
            </div>
            <div className="absolute bottom-[29%] left-[21%] transform -translate-x-1/2 rotate-[-7deg] text-black font-extrabold text-3xl">
                CHƯƠNG TRÌNH KHUYẾN MÃI
            </div>
            <div className="absolute top-[30%] right-10 transform w-[30%]">
                {promotionList.length > 0 ? (
                    <Slider {...settings}>
                        {promotionList.map((promotion, index) => (
                            <div
                                key={index}
                                className="text-center p-5 bg-white bg-opacity-80 rounded-lg h-[230px]"
                            >
                                <strong className="text-xl">Hoạt động từ:</strong>
                                <p className="bg-primary bg-opacity-80 rounded-lg p-1 text-white font-semibold text-lg">
                                    {formatDate(promotion.startDate)} -{" "}
                                    {formatDate(promotion.endDate)}
                                </p>
                                <p className="pt-2 font-semibold">
                                    Giảm
                                    <span className="text-red text-xl">
                                        {" "}
                                        {promotion.promotionValue * 100}%{" "}
                                    </span>
                                    cho các dịch vụ:
                                </p>

                                <div className="flex flex-wrap justify-center">
                                    {promotion.serviceIds.map((service, i) => (
                                        <p className="pl-1" key={i}>
                                            {service.name}
                                            {i < promotion.serviceIds.length - 1 ? "," : ""}
                                        </p>
                                    ))}
                                </div>
                                <p className="pt-1 font-semibold">
                                    MÃ KHUYẾN MÃI: 
                                    <span className="text-red text-xl"> {promotion.promotionCode}</span>
                                </p>
                                <p className="text-lg">Số lượng có hạn: {promotion.promotionQuantity}</p>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className="text-center p-5 bg-white bg-opacity-80 rounded-lg h-[230px] flex items-center justify-center">
                        <p className="text-xl text-gray-500">Hiện không có chương trình khuyến mãi nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromotionPage;
