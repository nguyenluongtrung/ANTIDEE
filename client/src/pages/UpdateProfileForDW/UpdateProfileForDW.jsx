import { Link } from "react-router-dom";
import front from "../../assets/img/frontsideCCCD.png";
import back from "../../assets/img/backsideCCCD.png";
import cer from "../../assets/img/residencycer.png";
import resume from "../../assets/img/resume.png";
export const UpdateProfileForDW = () => {
	return (
		<div className="grid mx-12">
			<div className="">
			<h1 className=" grid text-green font-bold text-2xl justify-center ">
				BỔ SUNG HỒ SƠ
			</h1>
			<span className="grid justify-center text-sm text-gray font-medium">
				Vui lòng tải lên các ảnh chụp tài liệu bổ sung cho hồ sơ của bạn
			</span>
				<div className="flex">
					<h5 className="font-bold">Căn cước công dân</h5>
					<span className="text-red">(* bắt buộc)</span>
				</div>
				<div className="shadow-md rounded-2xl  p-5">
					<p className="font-semibold  ">Chụp 2 mặt của giấy tờ</p>
					<div className="justify-center m-auto grid grid-cols-2 p-4">
						<div className="justify-center">
							<img className="m-auto p-4" src={front} />
							<div className="grid justify-center h-5 ">
								<Link
									className="bg-red text-center text-white w-72 p-1 rounded-full"
									to={""}
								>
									Tải ảnh mặt trước
								</Link>
							</div>
						</div>
						<div className="justify-center">
							<img className="m-auto p-4" src={back} />
							<div className="grid justify-center h-5 ">
								<Link
									className="bg-red text-center text-white w-72 p-1 rounded-full"
									to={""}
								>
									Tải ảnh mặt trước
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="  p-5">
				<div className="grid grid-cols-2 flex">
				<div className="flex">
						<p className="font-bold  ">Giấy xác nhận cư trú</p>
						<span className="text-red">(* bắt buộc)</span>
						</div>
						<div className="flex">
						<p className="font-bold  ">Sơ yếu lý lịch</p>
						<span className="text-red">(* bắt buộc)</span>
						</div>
				</div>
					
					<div className="justify-center m-auto grid grid-cols-2 p-4">
						<div className="justify-center">
							
						<p className="text-gray underline italic">Mẫu</p>
							<img className="m-auto p-4" src={cer} />
							<div className="grid justify-center h-5 ">
								<Link
									className="bg-red text-center text-white w-72 p-1 rounded-full"
									to={""}
								>
									Tải ảnh giấy xác nhận cư trú
								</Link>
							</div>
						</div>
						<div className="justify-center">
						
						<p className="text-gray underline italic">Mẫu</p>
							<img className="m-auto p-4" src={resume} style={{height:"586px"}}/>
							<div className="grid justify-center h-5 ">
								<Link
									className="bg-red text-center text-white w-72 p-1 rounded-full"
									to={""}
								>
									Tải ảnh sơ yếu lý lịch
								</Link>
							</div>
						</div>
					</div>
				</div>
				<div className='grid justify-center'>
                        <button className='bg-green text-white w-72 p-1 rounded-full'>Cập nhật hồ sơ</button>
                    </div>
		</div>
	);
};
