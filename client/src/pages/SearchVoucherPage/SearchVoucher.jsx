import React from 'react'; 
import { FiSearch } from 'react-icons/fi';
export const SearchVoucher = () => {
  const offers = [
    {
      id: 1,
      image: '/image/bananaboat.png',
      brand: 'Bananaboat',
      description: 'Giảm 20% cho đơn từ 199,000 VND tại Banana Boat',
      price: 300
    },
    {
      id: 2,
      image: '/image/darlie.png',
      brand:'Bananaboat',
      description: 'Giảm 20% cho đơn từ 199,000 VND tại Banana Boat',
      price: 300
    },
    {
      id: 3,
      image: '/image/stay.png',
      brand: 'Bananaboat',
      description: 'Giảm 20% cho đơn từ 199,000 VND tại Banana Boat',
      price: 300
    },
    {
      id: 4,
      image: '/image/highland.png',
      brand: 'Bananaboat',
      description: 'Giảm 20% cho đơn từ 199,000 VND tại Banana Boat',
      price: 300
    },
    {
      id: 5,
      image: '/image/highland2.png',
      brand: 'Bananaboat',
      description: 'Giảm 20% cho đơn từ 199,000 VND tại Banana Boat',
      price: 300
    },
    {
      id: 6,
      image: '/image/phuclong.png',
      brand: 'Bananaboat',
      description: 'Giảm 20% cho đơn từ 199,000 VND tại Banana Boat',
      price: 300
    }
  ];
 
  return (
    <div className=" font-sans p-20">
      <header className="bg-gray-100 p-5">
        <div className="">
          <div className='flex ml-20 grid grid-cols-2 gap-5 h-[450px]'>
           
						<img src="/image/voucher.png" className="w-[600px] h-[430px] ml-9 mb-[100px]" />
				
          <p className="mt-40">
						<span className="text-[#fac562] font-bold text-5xl">
							Vô vàn{' '}
						</span>
						<span className="text-[#FB7F0C] text-5xl font-bold">Ưu đãi</span> <br></br>
						<span className="text-[#FB7F0C] font-bold text-5xl"> Ngập tràn</span>
            <span className="text-[#fac562] font-bold text-5xl">
							Niềm vui{' '}
						</span>
					</p>
          </div>
       
        </div>
      
        <div className="flex items-center bg-[#EFEFEF]  p-3  rounded-xl w-full max-w-md">
      <FiSearch className="text-gray-500 ml-3" />
      <input
        type="text"
        placeholder="Tìm kiếm ưu đãi"
        className="focus:outline-none bg-[#EFEFEF]  ml-2 w-full "
      />
    </div>

        <div className="mt-[30px] flex space-x-4">
          <button className="px-4 py-2 w-[100px] h-10 bg-[#FF9BB9] border-[#FF467D] border-[1px] text-white  rounded-full active:bg-[#FF9BB9]">Tất cả</button>
          <button className="px-4 py-2 w-[100px] h-10 bg-[#FF9BB9] border-[#FF467D] border-[1px] text-white  rounded-full active:bg-[#FF9BB9]">Mua sắm</button>
          <button className="px-4 py-2 w-[100px] h-10 bg-[#FF9BB9] border-[#FF467D] border-[1px] text-white  rounded-full active:bg-[#FF9BB9]">Dịch vụ</button>
          <button className="px-4 py-2 w-[100px] h-10 bg-[#FF9BB9] border-[#FF467D] border-[1px] text-white  rounded-full active:bg-[#FF9BB9]">Giải trí</button>
          <button className="px-4 py-2 w-[100px] h-10 bg-[#FF9BB9] border-[#FF467D] border-[1px] text-white  rounded-full active:bg-[#FF9BB9]">Ẩm thực</button>
          <button className="px-4 py-2 w-[100px] h-10 bg-[#FF9BB9] border-[#FF467D] border-[1px] text-white  rounded-full active:bg-[#FF9BB9]">Du lịch</button>
        </div>
      </header>
      <section className="p-5">
        <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Ưu đãi độc quyền</h2>
        <a className="text-lg text-[#FF467D] italic" href="#">Xem thêm</a>
        </div>
        
        <div className="flex grid grid-cols-3   justify-around">
          {offers.slice(0, 3).map(offer => (
            <div key={offer.id} className="transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer m-4 w-90">
              <img src={offer.image} alt="Offer" className="w-full rounded-t-lg" />
              <p className="mt-2 p-2 text-2xl font-semibold">{offer.description}</p>
              <p className="p-2 text-lg text-[#C0BFBF] ">{offer.brand}</p>
              <div className="flex p-2">
              <img className="w-5 h-5 mt-1" src="/image/icon.png" alt="" /> 
              <span className="ml-1 block text-[#FB800E] text-lg"> {offer.price}</span>
              </div>  
              <button className="mt-2 w-[650px] italic self-end py-2 bg-orange-500 text-[#fccb70] rounded-b-lg">Xem chi tiết</button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
        <h2 className="text-lg font-bold">Ưu đãi độc quyền</h2>
        <a className="text-lg text-[#FF467D] italic" href="#">Xem thêm</a>
        </div>
        <div className="flex grid grid-cols-3 gap-[15px] justify-between items-center">
          {offers.slice(3, 6).map(offer => (
            <div key={offer.id} className="transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer m-4 w-90">
              <img src={offer.image} alt="Offer" className="w-full rounded-t-lg" />
              <p className="mt-2 p-2 text-2xl font-semibold">{offer.description}</p>
              <p className="p-2 text-lg text-[#C0BFBF] ">{offer.brand}</p>
              <div className="flex p-2">
              <img className="w-5 h-5 mt-1" src="/image/icon.png" alt="" /> 
              <span className="ml-1 block text-[#FB800E] text-lg"> {offer.price}</span>
              </div>  
              <button className="mt-2 w-[650px] italic self-end py-2 bg-orange-500 text-[#fccb70] rounded-b-lg">Xem chi tiết</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
