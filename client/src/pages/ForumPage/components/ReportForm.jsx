import { AiOutlineClose } from 'react-icons/ai';

export const ReportForm = ({ onClose, onReportForumPost }) => {
	const reportListItems = [
		'Vấn đề liên quan đến người dưới 18 tuổi',
		'Bắt nạt, quấy rối hoặc lăng mạ/ lạm dụng/ ngược đãi',
		'Tự tử hoặc tự gây thương tích',
		'Nội dung mang tính bạo lực, thù ghét hoặc gây phiền toái',
		'Bán hoặc quảng cáo mặt hàng bị hạn chế',
		'Nội dung người lớn',
		'Thông tin sai sự thật, lừa đảo hoặc gian lận',
		'Tôi không muốn xem nội dung này',
	];

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<div className="content rounded-md p-5 w-[32vw] max-h-[80%] overflow-y-auto">
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={onClose}
				/>
				<p className="grid text-primary font-bold text-xl justify-center">
					BÁO CÁO
				</p>
				<div>
					<p className="text-[20px] font-semibold pl-1.5">Tại sao bạn báo cáo bài viết này?</p>
				</div>
				<div>
					<ul className="space-y-2 mt-3 text-left">
						{reportListItems.map((item, index) => (
							<li
								key={index}
								className="cursor-pointer hover:bg-light_gray p-2 rounded"
								onClick={() => {
									onReportForumPost(item);
								}}
							>
								{item}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};
