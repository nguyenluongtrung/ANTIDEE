import { StepBar } from '../components/StepBar/StepBar';
import { Link, useNavigate } from 'react-router-dom';
export const ViewServiceDetail = () => {
  const navigate = useNavigate();

  const handleNextStep = () => {
    navigate('/job-posting/working-location');
  };

	return (
		<div className="w-full px-20">
			<StepBar />

			<div className="flex relative gap-x-10 mt-10 mx-40">
				<div className="flex-1">
					<img
						className="rounded-lg"
						src="https://cdn.tgdd.vn/Files/2014/04/16/542288/cach-ve-sinh-may-giat-cua-truoc-3.jpg"
					/>
				</div>
				<div className="flex-1">
					<div className="mb-6 font-bold text-primary text-lg">
						Dịch vụ vệ sinh máy giặt
					</div>
					<div>
						Đối với máy giặt có chế độ vệ sinh lồng giặt thì bạn mở nguồn, chọn
						nút chức năng vệ sinh lồng giặt và nhấn nút khởi động để kích hoạt.
						Bạn có thể cho thêm các chất tẩy rửa như: baking soda, giấm, cốt
						chanh,... để tăng cường khả năng làm sạch vi khuẩn, nấm mốc trong
						lồng giặt. Nếu máy giặt không có chế độ này, bạn thực hiện vệ sinh
						lồng giặt bằng cách đổ giấm 1 cốc giấm trắng hoặc dung dịch pha từ
						nước và muối vào bên trong lồng giặt. Sau đó cho một ít bột baking
						soda vào ngăn chứa bột giặt, kích hoạt cho máy chạy ở chế độ ngâm
						từ 15 - 20 phút.{' '}
					</div>
				</div>
			</div>

			<div className="flex items-center justify-center">
				<button
					className="mt-10 w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70"
					onClick={handleNextStep}
				>
					Tiếp theo
				</button>
			</div>
		</div>
	);
};
