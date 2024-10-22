import { Spinner } from './../../components';
import front from '../../assets/img/frontsideCCCD.png';
import back from '../../assets/img/backsideCCCD.png';
import cer from '../../assets/img/residencycer.png';
import resume from '../../assets/img/resume.png';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../firebase';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	getAccountInformation,
	updateAccountInformation,
} from '../../features/auth/authSlice';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../utils/toast-customize';

export const UpdateProfileForDW = () => {
	const { account: accountData, isLoading } = useSelector(
		(state) => state.auth
	);
	const [frontIdCard, setFrontIdCard] = useState('');
	const [backIdCard, setBackIdCard] = useState('');
	const [curriculumVitae, setCurriculumVitae] = useState('');
	const [certificateOfResidence, setCertificateOfResidence] = useState('');

	const [frontIdCardUrl, setFrontIdCardUrl] = useState('');
	const [backIdCardUrl, setBackIdCardUrl] = useState('');
	const [curriculumVitaeUrl, setCurriculumVitaeUrl] = useState('');
	const [certificateOfResidenceUrl, setCertificateOfResidenceUrl] =
		useState('');

	const [fileUploadError, setFileUploadError] = useState(false);
	const frontIdCardRef = useRef(null);
	const backIdCardRef = useRef(null);
	const curriculumVitaeRef = useRef(null);
	const certificateOfResidenceRef = useRef(null);

	const dispatch = useDispatch();

	async function initiateAccountInformation() {
		const output = await dispatch(getAccountInformation());
		setCertificateOfResidenceUrl(
			output?.payload?.resume?.certificateOfResidence
		);
		setFrontIdCardUrl(output?.payload?.resume?.frontIdCard);
		setCurriculumVitaeUrl(output?.payload?.resume?.curriculumVitae);
		setBackIdCardUrl(output?.payload?.resume?.backIdCard);
	}

	useEffect(() => {
		initiateAccountInformation();
	}, []);

	useEffect(() => {
		if (frontIdCard) {
			handleFileUpload(frontIdCard, 1);
		}
		if (backIdCard) {
			handleFileUpload(backIdCard, 2);
		}
		if (curriculumVitae) {
			handleFileUpload(curriculumVitae, 3);
		}
		if (certificateOfResidence) {
			handleFileUpload(certificateOfResidence, 4);
		}
	}, [frontIdCard, backIdCard, curriculumVitae, certificateOfResidence]);

	const handleFileUpload = (file, type) => {
		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, `resumes/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			},
			(error) => {
				setFileUploadError(true);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					switch (type) {
						case 1:
							setFrontIdCardUrl(downloadURL);
							break;
						case 2:
							setBackIdCardUrl(downloadURL);
							break;
						case 3:
							setCurriculumVitaeUrl(downloadURL);
							break;
						case 4:
							setCertificateOfResidenceUrl(downloadURL);
							break;
					}
				});
			}
		);
	};

	const onSubmit = async () => {
		const updatedResume = 
			{
				frontIdCard: frontIdCardUrl,
				backIdCard: backIdCardUrl,
				curriculumVitae: curriculumVitaeUrl,
				certificateOfResidence: certificateOfResidenceUrl,
			}
		;
		const account = { ...accountData, resume: updatedResume };
		const result = await dispatch(updateAccountInformation(account));

		if (result.type.endsWith('fulfilled')) {
			toast.success(
				'Bổ sung hồ sơ thành công, hồ sơ của bạn sẽ sớm được duyệt',
				successStyle
			);
		} else if (result?.error?.message === 'Rejected') {
			toast.error(result?.payload, errorStyle);
		}
		await dispatch(getAccountInformation());
	};

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<div className="grid mx-12 pt-20">
			<div className="">
				<h1 className=" grid text-green font-bold text-2xl justify-center ">
					BỔ SUNG HỒ SƠ
				</h1>
				<span className="grid justify-center text-sm text-gray font-medium">
					Vui lòng tải lên các ảnh chụp tài liệu bổ sung cho hồ sơ của bạn
				</span>
				<div className="p-5">
					<div className="flex">
						<h5 className="font-bold">Căn cước công dân</h5>
						<span className="text-red">(* bắt buộc)</span>
					</div>
					<div className="shadow-md rounded-2xl p-5">
						<p className="font-semibold  ">Chụp 2 mặt của giấy tờ</p>
						<div className="justify-center m-auto grid grid-cols-2 p-4">
							<div className="justify-center">
								<img
									className="m-auto p-4"
									src={
										`${frontIdCardUrl}` !== 'undefined'
											? `${frontIdCardUrl}`
											: front
									}
									style={{ width: '230px', height: '230px' }}
								/>
								<div className="grid justify-center h-5 ">
									<button
										className="bg-red text-center text-white w-72 p-1 rounded-full"
										onClick={() => frontIdCardRef.current.click()}
									>
										Tải ảnh mặt trước
									</button>
									<input
										type="file"
										ref={frontIdCardRef}
										hidden
										onChange={(e) => setFrontIdCard(e.target.files[0])}
									/>
								</div>
							</div>
							<div className="justify-center">
								<img
									className="m-auto p-4"
									src={
										`${backIdCardUrl}` !== 'undefined'
											? `${backIdCardUrl}`
											: back
									}
									style={{ width: '230px', height: '230px' }}
								/>
								<div className="grid justify-center h-5 ">
									<button
										className="bg-red text-center text-white w-72 p-1 rounded-full"
										onClick={() => backIdCardRef.current.click()}
									>
										Tải ảnh mặt sau
									</button>
									<input
										type="file"
										ref={backIdCardRef}
										hidden
										onChange={(e) => setBackIdCard(e.target.files[0])}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="p-5">
				<div className="grid grid-cols-2 flex">
					<div className="flex">
						<p className="font-bold">Giấy xác nhận cư trú</p>
						<span className="text-red">(* bắt buộc)</span>
					</div>
					<div className="flex">
						<p className="font-bold">Sơ yếu lý lịch</p>
						<span className="text-red">(* bắt buộc)</span>
					</div>
				</div>

				<div className="justify-center m-auto grid grid-cols-2 p-4">
					<div className="justify-center">
						<p className="text-gray underline italic">Mẫu</p>
						<img
							className="m-auto p-4"
							src={
								`${certificateOfResidenceUrl}` !== 'undefined'
									? `${certificateOfResidenceUrl}`
									: cer
							}
							style={{ height: '586px' }}
						/>
						<div className="grid justify-center h-5 ">
							<button
								className="bg-red text-center text-white w-72 p-1 rounded-full"
								onClick={() => certificateOfResidenceRef.current.click()}
							>
								Tải ảnh giấy xác nhận cư trú
							</button>
							<input
								type="file"
								ref={certificateOfResidenceRef}
								hidden
								onChange={(e) => setCertificateOfResidence(e.target.files[0])}
							/>
						</div>
					</div>
					<div className="justify-center">
						<p className="text-gray underline italic">Mẫu</p>
						<img
							className="m-auto p-4"
							src={
								`${curriculumVitaeUrl}` !== 'undefined'
									? `${curriculumVitaeUrl}`
									: resume
							}
							style={{ height: '586px' }}
						/>
						<div className="grid justify-center h-5 ">
							<button
								className="bg-red text-center text-white w-72 p-1 rounded-full"
								onClick={() => curriculumVitaeRef.current.click()}
							>
								Tải ảnh sơ yếu lý lịch
							</button>
							<input
								type="file"
								ref={curriculumVitaeRef}
								hidden
								onChange={(e) => setCurriculumVitae(e.target.files[0])}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="grid justify-center">
				<button
					onClick={onSubmit}
					className={`w-72 p-1 mb-5 rounded-full text-white ${
						curriculumVitaeUrl == '' ||
						frontIdCardUrl == ''  ||
						backIdCardUrl == ''  ||
						certificateOfResidenceUrl == '' 
							? 'bg-gray'
							: 'bg-green'
					}`}
					disabled={
						curriculumVitaeUrl == '' ||
						frontIdCardUrl == '' ||
						backIdCardUrl == '' ||
						certificateOfResidenceUrl == ''
					}
				>
					Cập nhật hồ sơ
				</button>
			</div>
		</div>
	);
};
