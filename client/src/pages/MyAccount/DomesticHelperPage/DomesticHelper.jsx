import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from "react-icons/fa"
import './DomesticHelper.css';
import toast from 'react-hot-toast';
import { createFeedback, getAllFeedbacks, replyFeedback } from '../../../features/domesticHelperFeedback/domesticHelperFeedbackSlice'
import { useForm } from "react-hook-form";
import { getAccountInformation } from "../../../features/auth/authSlice";
import { Spinner } from "../../../components";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
export const DomesticHelper = () => {
    const { account, isLoading: isAuthLoading } = useSelector((state) => state.auth);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');


    const [showOtherFeedback, setShowOtherFeedback] = useState(false);
    const dispatch = useDispatch();




    useEffect(() => {
        dispatch(getAccountInformation());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllFeedbacks());
    }, []);


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        // console.log(data);
        const feedbackData = {
            ...data,
            customerId: account?._id,
        };
        const result = await dispatch(createFeedback(feedbackData));
        console.log(result)
        if (result.type.endsWith('fulfilled')) {
            toast.success('Feedback thành công', successStyle);
        } else if (result?.error?.message === 'Rejected') {
            toast.error(result?.payload, errorStyle);
        }
        await dispatch(getAccountInformation());
        await dispatch(getAllFeedbacks());
    }

    if (isAuthLoading ) {
        return <Spinner />;
    }

    /////////////////////



    return (
        <div>
            <div className="mx-auto bg-white shadow-2xl rounded-lg max-w-2xl p-10">
                <h2 className="text-center p-3 font-bold text-xl">ĐÁNH GIÁ NGƯỜI GIÚP VIỆC</h2>
                <div>
                    <p className="text-green">Dọn dẹp nhà cửa</p>
                    <p>Hoàn thành lúc: 17:24 25/04/202</p>
                    <p>Tại: Số 3, Đa Mặn 6, phường Khuê Mỹ, quận Ngũ Hành Sơn, Đà Nẵng</p>
                </div>
                <div className="flex justify-center">
                    <img
                        src={
                            account?.gender
                                ? 'https://bootdey.com/img/Content/avatar/avatar7.png'
                                : 'https://bootdey.com/img/Content/avatar/avatar7.png'
                        }
                        alt="avatar"
                        className="ml-3 rounded-full w-14 h-14 bg-green"

                    />
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-5">
                    <input {...register('domesticHelperId')} hidden='true' value='662f4c88f79695826c12043e'></input>
                    {/* <input {...register('customerId')} value={account?._id}></input>   */}
                    <div className="flex justify-center">
                        {[...Array(5)].map((star, i) => {
                            const ratingValue = i + 1;
                            return (

                                <label key={i} >
                                    <input {...register('rating')}
                                        type="radio" name="rating" className="hidden"
                                        value={ratingValue}
                                        onClick={(e) => setRating(e.target.value)}

                                    />

                                    <FaStar className="star "
                                        color={ratingValue <= (hover || rating) ? "#EBEA0B" : "rgba(136, 114, 114, 0.8)"}
                                        size={25}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(null)} />
                                </label>
                            );
                        })}
                    </div>
                    <div className="flex justify-center font-semibold mt-3 text-light_gray">
                        <span>{rating == 1 ? " RẤT TỆ" : rating == 2 ? "TỆ"
                            : rating == 3 ? "ỔN" : rating == 4 ? "TỐT"
                                : rating == 5 ? "TUYỆT VỜI" : ""}</span>
                    </div>
                    <div>
                        <h3>Điều gì bạn mong muốn tốt hơn?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="radio" id="select1" className="hidden" name="select"
                                {...register('content')}
                                value='Mặc đồng phục khi đi làm'
                                onClick={() => setShowOtherFeedback(false)} />
                            <label for="select1" className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl hover:bg-light_yellow">
                                Mặc đồng phục khi đi làm</label>

                            <input type="radio" id="select2" className="hidden" name="select"
                                {...register('content')}
                                value='Làm cẩn thận hơn'
                                onClick={() => setShowOtherFeedback(false)} />
                            <label for="select2" className="flex justify-center rounded-md 
                            cursor-pointer items-center h-24 shadow-2xl  hover:bg-light_yellow">
                                Làm cẩn thận hơn</label>

                            <input type="radio" id="select3" className="hidden" name="select"
                                {...register('content')}
                                value='Thân thiện hơn'
                                onClick={() => setShowOtherFeedback(false)} />
                            <label htmlFor="select3" className="flex  justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl  hover:bg-light_yellow">
                                Thân thiện hơn</label>

                            <input type="radio" id="select4" className="hidden" name="select"
                                {...register('content')}
                                value='Khác'
                                onClick={() => setShowOtherFeedback(true)} />
                            <label htmlFor="select4" className="flex  justify-center rounded-md
                             cursor-pointer items-center h-24 shadow-2xl  hover:bg-light_yellow">
                                Khác</label>

                        </div>

                    </div>
                    <div class="grid grid-rows-2 gap-2 mt-10 text-sm">

                        <label className="flex gap-4" >
                            <input type="radio" name="options" value="option1" class="h-5 w-5" />
                            Thêm người giúp việc vào danh sách yêu thích</label>

                        <label className="flex gap-4" >
                            <input type="radio" name="options" value="option2" class="h-5 w-5" />
                            Đưa người giúp việc vào danh sách đen</label>

                    </div>



                    {showOtherFeedback && (
                        <>
                            <div className=" flex justify-center mt-10 pb-10">
                                <textarea rows={10} cols={60}
                                    {...register('content')}
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Enter your feedback" className=" rounded-md shadow-2xl shadow-gray p-3"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div className="flex items-center justify-center mt-10">
                        <button type="submit" 
                        className="text-white hover:bg-yellow bg-green rounded-full p-2 w-44"> 
                        Đánh giá</button>
                    </div>
                </form>



            </div>
        </div>
    )

}