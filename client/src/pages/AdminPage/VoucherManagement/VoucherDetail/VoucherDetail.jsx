import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";

import { AiOutlineClose } from "react-icons/ai";
import "./VoucherDetail.css";
import { useEffect, useState } from "react";
import { getAllServices } from "../../../../features/services/serviceSlice";
import { formatDateDetail } from "../../../../utils/format";
import { useNavigate, useParams } from "react-router-dom";


export const VoucherDetail = ({	setIsOpenDetailVoucher}) => {
	const { voucherId } = useParams();
	const navigate = useNavigate();
	const [services, setServiceList] = useState([]);
	const { vouchers, isLoading: voucherLoading } = useSelector(
		(state) => state.vouchers
	);
	const [chosenVoucher, setChosenVoucher] = useState(
		vouchers[
		vouchers.findIndex(
			(voucher) => String(voucher._id) == String(voucherId)
		)
		]
	);
	

	const dispatch = useDispatch();

	async function initiateServiceInformation() {
		let output = await dispatch(getAllServices());

		setServiceList(output.payload);
	}
	useEffect(() => {
		initiateServiceInformation();
	}, []);

	console.log(services);

	function getStatusColor(status) {
		let backgroundColor = "";
		if (status === "Đang hoạt động") {
			backgroundColor = "text-green font-semibold";
		} else if (status === "Đã hết hạn") {
			backgroundColor = "text-red font-semibold";
		}
		return backgroundColor;
	}

	function TableRow({ status }) {
		const backgroundColor = getStatusColor(status);

		return (
			<div
				className={`p-1 rounded-full ${backgroundColor} flex items-center justify-center`}
			>
				<div>{status}</div>
			</div>
		);
	}

	const isVoucherActive = new Date(chosenVoucher?.endDate)?.getTime() < new Date().getTime()
	const voucherStatus = isVoucherActive ? "Đã hết hạn" : "Đang hoạt động";

	if (voucherLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form className="content rounded-md p-5" style={{ width: "35vw" }}>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => {
						setIsOpenDetailVoucher(false);
						navigate("/admin-voucher");
					}}
				/>
				<p className="grid text-green font-bold text-xl justify-center">
					XEM CHI TIẾT VOUCHER
				</p>
				<table className="mt-3">
					<tbody>
						<tr>
							<td>
								<span className="font-bold">Tên voucher</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.name}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{" "}
								<span className="font-bold">Hình ảnh</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									<img
										className="mx-auto"
										src={chosenVoucher?.image}
										style={{ width: "210px", height: "210px" }}
									/>
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{" "}
								<span className="font-bold">Mô tả</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.description}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{" "}
								<span className="font-bold">Thể loại</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.category}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								{" "}
								<span className="font-bold">Loại voucher</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.couponType}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Ngày bắt đầu</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{formatDateDetail(chosenVoucher?.startDate)}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Ngày kết thúc</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{formatDateDetail(chosenVoucher?.endDate)}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Giá trị chiết khấu</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.discountValue}%
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Số lượng</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.quantity}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Điểm trao đổi</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.price}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Trạng thái</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									<TableRow status={voucherStatus} />
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Mã giảm giá</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.code}
								</p>
							</td>
						</tr>
						<tr>
							<td>
								<span className="font-bold">Các dịch vụ</span>
							</td>
							<td className="pl-6 py-1 w-80">
								<p className="text-center" style={{ width: "100%" }}>
									{chosenVoucher?.serviceId.map((serviceId, index) => {
										const service = services.find(s => s._id === serviceId);
										return (
											<span key={index}>
												{service ? service.name : "Không có dịch vụ nào"}
												<br />
											</span>
										);
									})}
								</p>
							</td>
						</tr>

					</tbody>
				</table>
			</form>
		</div>
	);
};
