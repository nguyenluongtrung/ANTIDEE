import imgInviteFriend from '../../assets/img/image 19.png';
import iconCoppy from '../../assets/img/intersect-square.png';
import logoFacebook from '../../assets/img/logo-Facebook.png';
import img20 from '../../assets/img/image 20.png';
import '../../pages/InviteFriendPage/InviteFriendPage.css';
export const InviteFriendPage = () => {
    return (
        <div>
            <div className='grid mt-10 pt-16'>
                <div className='col-start-3 col-end-3'>
                    <h2 className='mt-28 ml-20 text-5xl font-semibold text-yellow'>
                        <span class="text-primary text-6xl"> Chia sẻ</span> liền tay <br />
                        Rinh ngay <span class="text-primary text-6xl">quà xịn</span>
                    </h2>
                </div>
                <div className='col-end-7 col-span-2 size-8/12 mb-8'>
                    <img src={imgInviteFriend} alt="" />
                </div>
            </div>
            <div className='ml-40'>
                <h3 className='font-bold text-sm'>Gửi mã giới thiệu cho bạn bè</h3>
                <p className='font-medium text-xs'>Cùng bạn bè thảnh thơi và nhận nhiều ưu đãi hấp dẫn không giới hạn từ Antidee</p>
            </div>
            <div className='ml-40 mr-40 mt-5 max-w-screen-xl inviteCode'>
                <div className=' grid place-items-center pt-5'>
                    <span className='text-brown text-sm font-medium'>Mã giới thiệu của Lương Trung </span>
                    <div className='mt-2 flex pb-8'>
                        <span className='text-primary text-5xl font-medium mr-3'>HKSLCJ8M </span><img src={iconCoppy} />
                    </div>

                </div>
            </div>
            <div className='grid grid-cols-4 gap-4 ml-40 mr-40 max-w-screen-xl mt-10'>
                <div className='col-span-2 flex'>
                    <input className='border-2 border-gray rounded-2xl mr-5 max-w-lg p-3' placeholder='Nhập email bạn muốn giới thiệu'></input>
                    <button className='bg-green text-white rounded-2xl max-w-24'>Gửi</button>
                </div>
                <span className='grid text-lg justify-center m-auto'>hoặc</span>
                <div className=' bg-primary rounded-2xl flex p-4'>
                    <img src={logoFacebook} className='size-6 mr-3 ml-4' />
                    <p className='text-base text-white '>Chia sẻ qua Facebook</p>
                </div>
            </div>
            <div className='ml-40 mr-40 mt-10 max-w-screen-xl'>
                <h3 className='font-semibold text-sm'>Quà tặng dành cho bạn và bạn bè của bạn</h3>
                <h3 className='font-normal text-xs'>Nhận ngay ưu đãi khi bạn bè mua dịch vụ đầu tiên</h3>

                <div className='mt-10 grid grid-cols-5 gap-4'>
                    <div className='test mr-5'>
                        <img src={img20} />
                    </div>

                    <div className='col-span-4 p-10 giftContent'>
                        <h3 className='font-bold text-sm' >Antidee</h3>
                        <p className='font-medium text-sm' >Tặng ngay 10.000 đồng vào tài khoản chính của bạn và bạn bè của bạn</p>
                    </div>
                </div>
            </div>
        </div>
    );
}