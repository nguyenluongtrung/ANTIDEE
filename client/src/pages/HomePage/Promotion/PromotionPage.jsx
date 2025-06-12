import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import { getAllPromotions } from "../../../features/promotions/promotionSlice";
import { formatDate } from "../../../utils/format";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PromotionPage = () => {
    const [promotionList, setPromotionList] = useState([]);
    const dispatch = useDispatch();

    const isPromotionActive = (promotion) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(promotion.startDate);
        const endDate = new Date(promotion.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);


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


    const settings = {
        dots: true,
        infinite: promotionList.length > 1,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    return (
        <section className="section-promotion w-full mb-0 relative">
            <h2 className="relative md:top-[7%] md:text-right text-center md:text-5xl text-4xl top-[12%] font-extrabold text-white px-3 py-1 animate-bounce">SỐC: NGẬP TRÀN KHUYẾN MÃI</h2>
            <div className="relative md:top-[15%] top-[15%] md:left-[45%] rounded bg-white bg-opacity-70 transform md:w-[45%] w-[80%] m-10">
                {promotionList.length > 0 ? (
                    <Slider {...settings}>
                        {promotionList.map((promotion, index) => (
                            <div
                                key={index}
                                className="text-center p-5 rounded-lg md:h-[14.375rem] h-[18.75rem]"
                            >
                                <p className="pt-2 text-2xl font-semibold">
                                    Giảm
                                    <span className="text-red text-3xl">
                                        {" "}
                                        {promotion.promotionValue * 100}%{" "}
                                    </span>
                                    cho các dịch vụ:
                                </p>

                                <div className="flex flex-wrap justify-center">
                                    {promotion.serviceIds.map((service, i) => (
                                        <p className="pl-1 text-lg" key={i}>
                                            {service.name}
                                            {i < promotion.serviceIds.length - 1 ? "," : ""}
                                        </p>
                                    ))}
                                </div>

                                <p className="bg-primary bg-opacity-80 rounded-lg p-1 text-white font-semibold text-lg mt-2">
                                    Áp dụng từ: {' '}
                                    {formatDate(promotion.startDate)} -{" "}
                                    {formatDate(promotion.endDate)}
                                </p>

                                <p className="text-lg">Số lượng có hạn: {promotion.promotionQuantity}</p>
                                <p className="pt-1 font-semibold text-2xl">
                                    MÃ KHUYẾN MÃI:
                                    <span className="text-red text-3xl"> {promotion.promotionCode}</span>
                                </p>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    <div className="text-center p-5 bg-white bg-opacity-80 rounded-lg h-[230px] flex items-center justify-center">
                        <p className="text-xl text-gray-500">Hiện không có chương trình khuyến mãi nào.</p>
                    </div>
                )}
            </div>
        </section>

    );
};

export default PromotionPage;