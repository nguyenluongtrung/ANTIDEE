import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { formatDate, getDetailMinute } from '../../../utils/format';
import { getMyExamResults } from '../../../features/exams/examSlice';
import { VscPass } from 'react-icons/vsc';
import { VscError } from 'react-icons/vsc';
import { getAccountInformation } from '../../../features/auth/authSlice';

export const ExamResultHistory = () => {
	const [account, setAccount] = useState();
	const [results, setResults] = useState();
	const dispatch = useDispatch();

	async function initiateAccountInformation() {
		const output = await dispatch(getAccountInformation());
		setAccount(output.payload);
	}

	async function initiateAllExamResults() {
		const output = await dispatch(getMyExamResults());
		setResults(output.payload);
	}

	useEffect(() => {
		initiateAccountInformation();
		initiateAllExamResults();
	}, []);

	return (
		<div className="flex px-16 pt-20 mb-10">
			<div className="left-container pr-24 pt-3 w-1/3">
				<Sidebar account={account} />
			</div>
			<div className="p-5 w-2/3" style={{ width: '100%' }}>
				<h5 className="font-bold text-2xl text-green text-center">
					ĐIỂM THI CÁC BÀI KIỂM TRA ĐẦU VÀO
				</h5>
				<table className="w-full border-b border-gray mt-3">
					<thead>
						<tr className="text-sm font-medium text-gray-700 border-b border-gray border-opacity-50">
							<td className="py-2 px-4 text-center font-bold">STT</td>
							<td className="py-2 px-4 text-center font-bold">
								Tên bài kiểm tra
							</td>
							<td className="py-2 px-4 text-center font-bold">Điểm</td>
							<td className="py-2 px-4 text-center font-bold">
								Thời gian làm bài
							</td>
							<td className="py-2 px-4 text-center font-bold">Ngày làm bài</td>
							<td className="py-2 px-4 text-center font-bold">Kết quả</td>
						</tr>
					</thead>
					<tbody>
						{results?.map((result, index) => {
							return (
								<tr className="hover:bg-primary hover:bg-opacity-25 transition-colors odd:bg-light_pink  hover:cursor-pointer">
									<td className="font-medium text-center text-gray p-3">
										<span>{index + 1}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{result.examId.name}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>
											{result?.totalScore} /{' '}
											{Number(
												result.examId?.questions?.easyQuestion
													?.numOfEasyQuestion
											) +
												Number(
													result.examId?.questions?.mediumQuestion
														?.numOfMediumQuestion
												) +
												Number(
													result.examId?.questions?.hardQuestion
														?.numOfHardQuestion
												)}{' '}
										</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{getDetailMinute(result?.duration)}</span>
									</td>
									<td className="font-medium text-center text-gray">
										<span>{formatDate(result?.createdAt)}</span>
									</td>
									<td class="font-medium text-center text-gray">
										<span class="flex justify-center items-center">
											{result?.isPassed ? (
												<VscPass size={24} className="text-green" />
											) : (
												<VscError size={24} className="text-red" />
											)}
										</span>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
