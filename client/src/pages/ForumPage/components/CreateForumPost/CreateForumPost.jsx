import { useForm } from 'react-hook-form';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	createForumPost,
	getAllForumPosts,
} from '../../../../features/forumPost/forumPostSlice';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './CreateForumPost.css';
import { getAllTopics } from '../../../../features/topics/topicSlice';
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
import { FiUploadCloud } from 'react-icons/fi';

export const CreatePostForum = ({ setIsOpenCreatePostForum }) => {
	const { isLoading: forumPostLoading, forumPosts } = useSelector(
		(state) => state.forumPosts
	);
	const { topics } = useSelector((state) => state.topics);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const dispatch = useDispatch();

	useEffect(() => {
		if (!forumPosts || forumPosts.length === 0) {
			dispatch(getAllForumPosts());
		}
		dispatch(getAllTopics());
	}, [dispatch, forumPosts]);
	const fileRef = useRef(null);
	const [file, setFile] = useState(undefined);
	const [filePerc, setFilePerc] = useState(0);
	const [fileUploadError, setFileUploadError] = useState('');
	const [imagesUrl, setImagesUrl] = useState('');
	const [isCheckingImage, setIsCheckingImage] = useState(false);
	const [selectedTopics, setSelectedTopics] = useState([]);
	const checkThreshold = (item, threshold) => {
		if (item && typeof item === 'object' && !Array.isArray(item)) {
			if (item.hasOwnProperty('indoor_other')) {
				delete item.indoor_other;
			}
			if (item.hasOwnProperty('outdoor_other')) {
				delete item.outdoor_other;
			}

			return Object.values(item).some((value) => value > threshold);
		} else if (Array.isArray(item)) {
			return item.some((value) => value > threshold);
		}
		return false;
	};
	const handleRemoveImage = () => {
		setImagesUrl('');
		setFile(undefined);
		setFilePerc(0);
		setFileUploadError('');
	};
	const onSubmit = async (formData) => {
		if (imagesUrl || !formData.images) {
			try {
				setIsCheckingImage(true);
				if (imagesUrl) {
					const response = await axios.get(
						'https://api.sightengine.com/1.0/check.json',
						{
							params: {
								url: imagesUrl,
								models:
									'nudity-2.1,weapon,text-content,face-attributes,gore-2.0,tobacco,violence,self-harm,gambling',
								api_user: '36950956',
								api_secret: 'FkPHdBHxik6823yZw5Nms9uDV9wjVQjY',
							},
						}
					);

					const data = response.data;

					const thresholds = {
						nudity: 0.2,
						weapon: 0.4,
						text_content: 0.4,
						face_attributes: 0.4,
						gore: 0.4,
						tobacco: 0.4,
						violence: 0.4,
						self_harm: 0.4,
						gambling: 0.4,
					};

					let warnings = [];
					let isImageValid = true;

					if (
						data.weapon &&
						checkThreshold(data.weapon.classes, thresholds.weapon)
					) {
						isImageValid = false;
						warnings.push('Ảnh chứa vũ khí.');
					}
					if (
						data.text_content &&
						checkThreshold(data.text_content, thresholds.text_content)
					) {
						isImageValid = false;
						warnings.push('Ảnh chứa nội dung văn bản không phù hợp.');
					}
					if (
						data.face_attributes &&
						checkThreshold(data.face_attributes, thresholds.face_attributes)
					) {
						isImageValid = false;
						warnings.push(
							'Ảnh chứa thông tin về đặc điểm khuôn mặt không phù hợp.'
						);
					}
					if (data.gore && checkThreshold(data.gore, thresholds.gore)) {
						isImageValid = false;
						warnings.push('Ảnh chứa nội dung máu me hoặc bạo lực.');
					}
					if (
						data.tobacco &&
						checkThreshold(data.tobacco, thresholds.tobacco)
					) {
						isImageValid = false;
						warnings.push('Ảnh chứa nội dung thuốc lá hoặc thuốc lá điện tử.');
					}
					if (
						data.nudity &&
						checkThreshold(data.nudity.context, thresholds.nudity)
					) {
						isImageValid = false;
						warnings.push('Ảnh chứa nội dung khiêu dâm.');
					}
					if (
						data.violence &&
						checkThreshold(data.violence, thresholds.violence)
					) {
						isImageValid = false;
						warnings.push('Ảnh chứa bạo lực.');
					}
					if (
						data.self_harm &&
						checkThreshold(data.self_harm, thresholds.self_harm)
					) {
						isImageValid = false;
						warnings.push('Ảnh chứa hành vi tự hại.');
					}
					if (
						data.gambling &&
						checkThreshold(data.gambling, thresholds.gambling)
					) {
						isImageValid = false;
						warnings.push('Ảnh chứa nội dung cờ bạc.');
					}

					if (!isImageValid) {
						throw new Error(warnings.join(' '));
					}
				}
				setIsCheckingImage(false);
				const forumPostData = {
					...formData,
					images: imagesUrl || formData.images,
				};
				const result = await dispatch(createForumPost(forumPostData));
				if (result.type.endsWith('fulfilled')) {
					toast.success('Đăng bài thành công', successStyle);
					setIsOpenCreatePostForum(false);
				} else if (result?.error?.message === 'Rejected') {
					toast.error(result?.payload, errorStyle);
				}
			} catch (error) {
				setIsCheckingImage(false);
				toast.error(`Lỗi: ${error.message}`, errorStyle);
			}
		} else {
			toast.error('Vui lòng tải ảnh lên trước khi đăng bài', errorStyle);
		}
	};

	useEffect(() => {
		if (file) {
			setFileUploadError(false);
			handleFileUpload(file);
		}
	}, [file]);

	const handleFileUpload = (file) => {
		if (file.size > 2 * 1024 * 1024) {
			setFileUploadError('Dung lượng ảnh phải nhỏ hơn 2MB');
			setFilePerc(0);
			return;
		}

		const storage = getStorage(app);
		const fileName = new Date().getTime() + file.name;
		const storageRef = ref(storage, `images/${fileName}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setFilePerc(Math.round(progress));
				setFileUploadError('');
			},
			(error) => {
				setFileUploadError('Tải ảnh lên thất bại');
				setFilePerc(0);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					console.log('Download URL:', downloadURL);
					setImagesUrl(downloadURL);
					setFilePerc(100);
					setFileUploadError('');
				});
			}
		);
	};
	if (forumPostLoading) {
		return <Spinner />;
	}

	return (
		<div className="popup active">
			<div className="overlay"></div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="content rounded-md p-5 w-[40vw] max-h-screen overflow-y-auto"
			>
				<AiOutlineClose
					className="absolute text-sm hover:cursor-pointer"
					onClick={() => setIsOpenCreatePostForum(false)}
				/>
				<p className="grid text-primary font-bold text-xl justify-center">
					TẠO BÀI VIẾT
				</p>
				<div className="mt-3">
					<div>Tiêu đề</div>
					<div>
						<input
							{...register('title', {
								required: 'Tiêu đề bài viết là bắt buộc',
							})}
							className="create-forumPost-input text-sm w-full h-10 focus:outline-info"
							required
						/>
						{errors.title && (
							<p className="text-red text-center">{errors.title.message}</p>
						)}
					</div>
				</div>
				<div className="mt-3">
					<div>Nội dung</div>
					<div>
						<textarea
							{...register('content', {
								required: 'Nội dung bài viết là bắt buộc',
							})}
							className="create-forumPost-input text-sm w-full h-40 focus:outline-info"
							required
						/>
						{errors.content && (
							<p className="text-red text-center">{errors.content.message}</p>
						)}
					</div>
				</div>
				<div className="mt-3">
					<div>Chủ đề</div>
					<div className="flex flex-wrap gap-2">
						{topics.map((topic) => (
							<div
								key={topic._id}
								value={topic._id}
								className={`text-white ${
									selectedTopics.find((topicId) => topicId === topic._id)
										? 'bg-green'
										: 'bg-yellow'
								} hover:cursor-pointer rounded-md py-1 px-2`}
								onClick={() => {
									setSelectedTopics((prevSelectedTopics) => {
										if (!prevSelectedTopics.includes(topic._id)) {
											return [...prevSelectedTopics, topic._id];
										} else {
											return prevSelectedTopics.filter(
												(topicId) => topicId !== topic._id
											);
										}
									});
								}}
							>
								{topic.topicName}
							</div>
						))}
					</div>
				</div>

				<div className="mt-3 flex items-center gap-2">
					<div>Chọn ảnh</div>
					<button
						className="bg-blue text-white py-2 rounded-md mb-3 flex gap-2 justify-center items-center"
						style={{ width: '170px' }}
						onClick={(e) => {e.preventDefault(); fileRef.current.click()}}
					>
						<FiUploadCloud size={20} /> Tải ảnh lên
					</button>

					<input
						ref={fileRef}
						className="create-forumPost-input w-full h-16 hidden"
						placeholder="Ảnh"
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files[0])}
					/>
					{filePerc > 0 && <span> Đang tải ảnh lên: {filePerc}%</span>}
					{fileUploadError && <p className="text-red">{fileUploadError}</p>}
				</div>
				{imagesUrl && (
					<div className="mt-3 image-preview">
						<img
							src={imagesUrl}
							alt="Preview"
							className="w-[40%] max-h-96 object-contain"
						/>
						<button
							type="button"
							onClick={() => handleRemoveImage()}
							className="absolute mt-[-80px] font-bold right-6 p-1 text-primary rounded-full  "
						>
							X
						</button>
					</div>
				)}
				<div className="flex mt-3 justify-center">
					<button
						className="btn-submit bg-primary w-full h-10 text-white p-2 rounded-md hover:bg-primary-dark"
						type="submit"
						disabled={isCheckingImage || forumPostLoading}
					>
						{isCheckingImage ? (
							<>
								<Spinner /> Đang kiểm tra hình ảnh
							</>
						) : (
							'Đăng bài'
						)}
					</button>
				</div>
			</form>
		</div>
	);
};
