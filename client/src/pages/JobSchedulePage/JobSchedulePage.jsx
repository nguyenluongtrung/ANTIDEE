import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { BiDetail } from 'react-icons/bi';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { IoTodayOutline } from 'react-icons/io5';
import { TbClockHour4 } from 'react-icons/tb';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineNoteAlt } from 'react-icons/md';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';
import { PiMoneyWavy } from 'react-icons/pi';
import { RiCalendarScheduleLine } from 'react-icons/ri';

import { appendHourToDate } from '../../utils/format';

import { getAccountInformation } from '../../features/auth/authSlice';
import { getAllJobPosts, getJobPost } from '../../features/jobPosts/jobPostsSlice';
import { getAllServices } from '../../features/services/serviceSlice';

import './JobSchedulePage.css';

export const JobSchedulePage = () => {
	const [myJobs, setMyJobs] = useState([]);
	const dispatch = useDispatch();
	const [myAccountId, setMyAccountId] = useState();
	const { services } = useSelector((state) => state.services);
	const [selectedServices, setSelectedServices] = useState([]);

	async function initiateAccountInformation() {
		let output = await dispatch(getAccountInformation());

		setMyAccountId(output.payload._id);
	}

	const getAllJobList = async () => {
		let output = await dispatch(getAllJobPosts());
		let newJobHistory = output.payload.filter(
			(job) =>
				job.domesticHelperId == String(myAccountId) &&
				job?.hasCompleted?.customerConfirm == false &&
				job?.hasCompleted?.domesticHelperConfirm == false &&
				job?.cancelDetails?.isCanceled == false
		);

		const myJobs = [];
		newJobHistory.forEach((job) =>
			myJobs.push({
				id: job._id,
				title: job.serviceId.name,
				start:
					job.workingTime.startingDate &&
					job.workingTime.startingHour &&
					appendHourToDate(
						job.workingTime.startingDate,
						job.workingTime.startingHour
					),
			})
		);

		setMyJobs(myJobs);
	};

	useEffect(() => {
		initiateAccountInformation();
		dispatch(getAllServices());
	}, []);

	useEffect(() => {
		if (myAccountId) {
			getAllJobList();
		}
	}, [myAccountId]);

	const [openPopupDetailJobPost, setOpenPopupDetailJobPost] = useState(false);
	const [detailJobPost, setDetailJobPost] = useState(null);

	const getDetailInformationFormDB = async (event) => {
		const result = await dispatch(getJobPost(event.id));
		setDetailJobPost({
			...result.payload,
			serviceName: event.title,
		});
		setOpenPopupDetailJobPost(true);
	};

	const handleEventClick = (clickInfo) => {
		getDetailInformationFormDB(clickInfo.event);
	};

	const handleCheckboxChange = (serviceName) => {
		setSelectedServices((prev) =>
			prev.includes(serviceName)
				? prev.filter((name) => name !== serviceName)
				: [...prev, serviceName]
		);
	};

	const filteredJobs = selectedServices.length
		? myJobs.filter((job) => selectedServices.includes(job.title))
		: myJobs;

	return (
		<>
			<div className="flex py-24 mx-20">
				<div className="w-[25%] pt-16">
					<div className="font-bold text-2xl flex items-center">
						<RiCalendarScheduleLine className="mr-2" />
						Lịch của tôi
					</div>

					<div class="flex items-center my-4 mt-8">
						<input
							type="checkbox"
							value=""
							checked={selectedServices.length === 0 ? true : false}
							onClick={() => setSelectedServices([])}
						/>
						<label
							for="default-checkbox"
							class="ms-2 text-base font-medium text-primary"
						>
							Xem tất cả lịch làm việc
						</label>
					</div>
					{services?.map((service) => {
						return (
							<div class="flex items-center mb-4">
								<input
									type="checkbox"
									value=""
									checked={
										selectedServices.length === 0
											? selectedServices.includes(service.name)
											: selectedServices.includes(service.name)
									}
									onChange={() => handleCheckboxChange(service.name)}
								/>
								<label
									for="default-checkbox"
									class="ms-2 text-base font-medium text-gray dark:text-gray"
								>
									{service.name}
								</label>
							</div>
						);
					})}
				</div>
				<div className="w-[100%]">
					<FullCalendar
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
						initialView={'dayGridMonth'}
						headerToolbar={{
							right: 'prev,next',
							center: 'title',
							left: 'dayGridMonth,timeGridWeek',
						}}
						events={filteredJobs}
						locale={viLocale}
						dayMaxEvents={6}
						eventClick={handleEventClick}
					/>
				</div>
			</div>
			<Dialog
				open={openPopupDetailJobPost}
				onClose={setOpenPopupDetailJobPost}
				className="relative z-10"
			>
				<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
					<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
						<DialogPanel
							transition
							className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
						>
							<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
								<div className="sm:flex sm:items-start">
									<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
										<DialogTitle
											as="h3"
											className="text-lg font-bold leading-6 text-primary flex justify-center items-center"
										>
											<BiDetail size={30} className="mx-2" />
											Chi tiết công việc
										</DialogTitle>
										<div className="mt-2">
											{detailJobPost && (
												<div>
													<div className="text-base mt-4 text-black font-bold flex items-center gap-x-4">
														<MdDriveFileRenameOutline size={20} />
														Tên dịch vụ:{' '}
														<p className="text-gray font-medium">
															{detailJobPost.serviceName}
														</p>
													</div>
													<div className="text-base mt-3 text-black font-bold flex items-center gap-x-4">
														<IoTodayOutline size={20} />
														Ngày làm việc:{' '}
														<p className="text-gray font-medium">
															{new Date(
																detailJobPost.workingTime.startingDate
															).toLocaleDateString()}
														</p>
													</div>
													<div className="text-base mt-3 text-black font-bold flex items-center gap-x-4">
														<TbClockHour4 size={20} />
														Giờ làm việc:{' '}
														<p className="text-gray font-medium">
															{detailJobPost.workingTime.startingHour}
														</p>
													</div>
													<div className="text-base mt-3 text-black font-bold flex gap-x-4">
														<IoLocationOutline size={20} />
														Địa chỉ:
														<p className="text-gray font-medium w-[70%]">
															{detailJobPost.contactInfo.address}
														</p>
													</div>
													<div className="text-base mt-3 text-black font-bold flex items-center gap-x-4">
														<MdOutlineNoteAlt size={20} />
														Ghi chú:{' '}
														<p className="text-gray font-medium">
															{detailJobPost.note}
														</p>
													</div>
													<div className="text-base mt-3 text-black font-bold flex items-center gap-x-4">
														<LiaMoneyCheckAltSolid size={20} />
														Phương thức thanh toán:{' '}
														<p className="text-gray font-medium">
															{detailJobPost.paymentMethod}
														</p>
													</div>
													<div className="text-base mt-3 text-black font-bold flex items-center gap-x-4">
														<PiMoneyWavy size={20} />
														Giá tiền:{' '}
														<p className="text-gray font-medium">
															{detailJobPost.totalPrice} vnđ
														</p>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="button"
									data-autofocus
									onClick={() => setOpenPopupDetailJobPost(false)}
									className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray shadow-sm ring-1 ring-inset ring-gray hover:bg-primary hover:text-white sm:mt-0 sm:w-auto"
								>
									Đóng
								</button>
							</div>
						</DialogPanel>
					</div>
				</div>
			</Dialog>
		</>
	);
};
