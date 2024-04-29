import img26 from '../../assets/img/image 26.png';
import img27 from '../../assets/img/image 27.png';
import img28 from '../../assets/img/image 28.png';
import img29 from '../../assets/img/image 29.png';
export const WannaBecomeHelperPage = () => {
    return (
        <div>
            <h1 className=' grid text-green font-bold text-2xl justify-center '>BẠN MUỐN TRỞ THÀNH NGƯỜI GIÚP VIỆC?</h1>
            <img className='m-auto mt-10' src={img29} />
            <span className='grid justify-center mt-10 mb-10 text-base text-gray font-medium'>Để trở thành một người giúp việc chuyên nghiệp, bạn cần hoàn thành 3 mục tiêu sau</span>
            <div className='grid grid-cols-3 ml-40 mr-32'>
                <div className='shadow-md rounded-2xl p-5 max-w-80'>
                    <img className='m-auto size-52' src={img27} />
                    <h2 className=' grid justify-center font-semibold p-5 text-lg'>KIỂM TRA ĐẦU VÀO</h2>
                    <p className='font-normal text-base'>Bài kiểm tra chất lượng đầu vào giúp kiểm soát được năng lực đầu vào của ứng viên. Cùng làm bài kiểm tra đầu vào nhé!</p>
                    <div className='grid grid-cols-8 mt-5 mb-7'>
                        <p className='text-gray text-base col-span-7'>Hoàn thành</p>
                        <p className='text-primary text-sm'>0%</p>
                    </div>
                    <div className='grid justify-center'>
                        <button className='bg-green text-white w-28 p-1 rounded-full'>Vào thi</button>
                    </div>

                </div>
                <div className='shadow-md rounded-2xl p-5 max-w-80'>
                    <img className='m-auto size-52' src={img28} />
                    <h2 className=' grid justify-center font-semibold p-5 text-lg'>ĐÀO TẠO KỸ NĂNG</h2>
                    <p className='font-normal text-base'>Khóa đào tạo kỹ năng bao gồm các video và bài kiểm tra cho từng video tương ứng, giúp bạn chuẩn bị một hành trang tốt cho công việc sắp tới.</p>
                    <div className='grid grid-cols-8 mt-5 mb-7'>
                        <p className='text-gray text-base col-span-7'>Hoàn thành</p>
                        <p className='text-primary text-sm'>0%</p>
                    </div>
                    <div className='grid justify-center'>
                        <button className='bg-gray text-white w-28 p-1 rounded-full'>Vào học</button>
                    </div>
                </div>
                <div className='shadow-md rounded-2xl p-5 max-w-80'>
                    <img className='m-auto size-52' src={img26} />
                    <h2 className=' grid justify-center font-semibold p-5 text-lg'>CẬP NHẬT HỒ SƠ</h2>
                    <p className='font-normal text-base'>Chúc mừng bạn là một ứng viên tiềm năng của Antidee và chắc rằng trong hành trình tới chúng ta sẽ cùng nhau gặt hái được nhiều thành công.</p>
                    <div className='grid grid-cols-8 mt-5 mb-7'>
                        <p className='text-gray text-base col-span-7'>Hoàn thành</p>
                        <p className='text-primary text-sm'>0%</p>
                    </div>

                    <div className='grid justify-center'>
                        <button className='bg-gray  text-white w-28 p-1 rounded-full'>Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>
    )

}