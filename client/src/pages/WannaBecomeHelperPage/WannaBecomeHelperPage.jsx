import { Link } from 'react-router-dom';
import img26 from '../../assets/img/image 26.png';
import img27 from '../../assets/img/image 27.png';
import img28 from '../../assets/img/image 28.png';
import img29 from '../../assets/img/image 29.png';
import arrow from '../../assets/img/arrow.gif'
import learningStep1 from '../../assets/img/learningStep1.png'
import learningStep2 from '../../assets/img/learningStep2.jpg'
import learningStep3 from '../../assets/img/learningStep3.png'




export const WannaBecomeHelperPage = () => {
    return (
        <div className='pb-10'>
            <h1 className=' grid text-green font-bold text-2xl justify-center pt-20'>BA BƯỚC ĐỂ CÓ THỂ TRỞ THÀNH NGƯỜI GIÚP VIỆC</h1>
            {/* <img className='m-auto mt-10' src={img29} /> */}
            <span className='grid justify-center mt-2 mb-10 text-base text-gray font-medium'>Để trở thành một người giúp việc chuyên nghiệp,
                bạn cần lần lượt hoàn thành 3 mục tiêu sau</span>


            <div className="flex justify-around items-center w-full px-52">
                <img className='w-24 px-4' src="https://cdn-icons-png.flaticon.com/512/10507/10507391.png" alt="" />
                <div className="flex-grow border-t border-2 border-gray"></div>
                <img className='w-24 px-4' src="https://cdn-icons-png.flaticon.com/512/4771/4771348.png" alt="" />
                <div className="flex-grow border-t border-2 border-gray"></div>
                <img className='w-24 px-4 ' src="image/kien_con.jpg" alt="" />
            </div>

            <div className='flex justify-between items-center px-20'>
                <div className='shadow-md rounded-2xl p-8 w-[30%] h-[500px]' >
                    <h1 className='text-center font-bold'>Mục tiêu số 1</h1>
                    <img className='m-auto size-52 p-6' src={learningStep1}/>
                    <h2 className=' grid justify-center font-semibold p-5 text-sm'>KIỂM TRA ĐẦU VÀO</h2>
                    <p className='font-normal text-xs'>Bài kiểm tra chất lượng đầu vào giúp kiểm soát được năng lực đầu vào của ứng viên.
                        Cùng làm bài kiểm tra đầu vào nhé!</p>
                    <div className='grid grid-cols-8 mb-7 grid-rows-2'>
                        <p className='text-gray text-sm col-span-7 row-start-2'>Hoàn thành</p>
                        <p className='text-primary text-sm row-start-2'>0%</p>
                    </div>
                    <div className='grid justify-center h-2 m-0'>
                        <Link className='bg-green text-center text-white w-28 p-1 rounded-full' to={'/qualifications'}>Vào thi</Link>
                    </div>
                </div>

                <img className='w-32 mt-10 rotate-45' src={arrow} />

                <div className='shadow-md rounded-2xl p-8 w-[30%] h-[500px]'>
                    <h1 className='text-center font-bold'>Mục tiêu số 2</h1>
                    <img className='m-auto size-52' src={learningStep2} />
                    <h2 className=' grid justify-center font-semibold p-5 text-sm'>ĐÀO TẠO KỸ NĂNG</h2>
                    <p className='font-normal text-xs'>Khóa đào tạo kỹ năng bao gồm các video và bài kiểm tra cho từng video tương ứng,
                        giúp bạn chuẩn bị một hành trang tốt cho công việc sắp tới.</p>
                    <div className='grid grid-cols-8 mb-7 grid-rows-2'>
                        <p className='text-gray text-sm col-span-7 row-start-2'>Hoàn thành</p>
                        <p className='text-primary text-sm row-start-2'>0%</p>
                    </div>
                    <div className='grid justify-center'>
                        <button className='bg-gray text-white w-28 p-1 rounded-full'>Vào học</button>
                    </div>
                </div>

                <img className='w-32 mt-10 transform scale-y-[-1] rotate-[315deg]' src={arrow} />

                <div className='shadow-md rounded-2xl p-8 w-[30%] h-[500px]'>
                    <h1 className='text-center font-bold'>Mục tiêu số 3</h1>
                    <img className='m-auto size-52 p-6' src={learningStep3} />
                    <h2 className=' grid justify-center font-semibold p-5 text-sm'>CẬP NHẬT HỒ SƠ</h2>
                    <p className='font-normal text-xs'>Chúc mừng bạn là một ứng viên tiềm năng của Antidee và chắc rằng trong hành trình tới
                        chúng ta sẽ cùng nhau gặt hái được nhiều thành công.</p>
                    <div className='grid grid-cols-8 mb-7 grid-rows-2'>
                        <p className='text-gray text-sm col-span-7 row-start-2'>Hoàn thành</p>
                        <p className='text-primary text-sm row-start-2'>0%</p>
                    </div>

                    <div className='grid justify-center'>
                        <Link className='bg-gray flex text-center text-white w-28 p-1 rounded-full' to={'/update-dw'}><p className='pl-5 !text-center'>Cập nhật</p></Link>
                    </div>
                </div>
            </div>
        </div>
    )

}