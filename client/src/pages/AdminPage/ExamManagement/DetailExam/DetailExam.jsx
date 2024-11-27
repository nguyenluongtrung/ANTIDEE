import { useDispatch } from 'react-redux';
import { getExam } from '../../../../features/exams/examSlice';
import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import { useParams } from 'react-router-dom';

export const DetailExam = () => {
	const [chosenExam, setChosenExam] = useState();
	const params = useParams();
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchExam = async () => {
			const response = await dispatch(getExam(params.examId));
			setChosenExam(response.payload);
		};
		fetchExam();
	}, []);

	if (chosenExam) {
		return (
			<div className="w-full min-h-screen bg-white flex flex-row">
				<AdminSidebar />
				<div className="flex-1 px-10 pt-5">
					<div className="flex mb-10 text-2xl font-bold">
						Đang <p className="text-primary text-2xl px-2">Chi tiết</p> bài thi{' '}
					</div>
						<div className="flex gap-2 mb-5">
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Tên bài thi</div>
								<p className="shadow appearance-none border py-3 px-3 rounded">{chosenExam?.name}</p>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Chứng chỉ</div>
								<p className="shadow appearance-none border py-3 px-3 rounded">{chosenExam?.qualificationId?.name}</p>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Điểm cần đạt</div>
								<p className="shadow appearance-none border py-3 px-3 rounded">{chosenExam?.passGrade}</p>
							</div>
						</div>
						<div className="flex gap-2 mb-5">
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Số lượng câu dễ</div>
								<p className="shadow appearance-none border py-3 px-3 rounded">{chosenExam?.questions.easyQuestion.numOfEasyQuestion}</p>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Số lượng câu bình thường</div>
								<p className="shadow appearance-none border py-3 px-3 rounded">{chosenExam?.questions.mediumQuestion.numOfMediumQuestion}</p>
							</div>
							<div className="flex flex-col w-full col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Số lượng câu khó</div>
								<p className="shadow appearance-none border py-3 px-3 rounded">{chosenExam?.questions.hardQuestion.numOfHardQuestion}</p>
							</div>
						</div>
						<div className="flex gap-2 mb-2">
							<div className="flex flex-col w-[33%] col-span-1 lg:col-span-8">
								<div className="text-gray mb-2">Danh mục</div>
								<p className="shadow appearance-none border py-3 px-3 rounded">{chosenExam.category}</p>
							</div>
						</div>
				</div>
			</div>
		);
	}
};
