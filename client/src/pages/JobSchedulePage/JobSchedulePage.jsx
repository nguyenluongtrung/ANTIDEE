import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import viLocale from '@fullcalendar/core/locales/vi';
import './JobSchedulePage.css';
import { useDispatch } from 'react-redux';
import { getAccountInformation } from '../../features/auth/authSlice';
import { getAllJobPosts } from '../../features/jobPosts/jobPostsSlice';
import { appendHourToDate } from '../../utils/format';

export const JobSchedulePage = () => {
	const [myJobs, setMyJobs] = useState([]);
	const dispatch = useDispatch();
	const [myAccountId, setMyAccountId] = useState();

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
		newJobHistory.forEach((job) => myJobs.push({
			id: job._id,
			title: job.serviceId.name,
			start: job.workingTime.startingDate && job.workingTime.startingHour && appendHourToDate(job.workingTime.startingDate, job.workingTime.startingHour)
		}))

		setMyJobs(myJobs);
	};
	useEffect(() => {
		initiateAccountInformation();
	}, []);
	useEffect(() => {
		if (myAccountId) {
			getAllJobList();
		}
	}, [myAccountId]);

	return (
		<div className="pt-20">
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView={'dayGridMonth'}
				headerToolbar={{
					right: 'prev,next',
					center: 'title',
					left: 'dayGridMonth,timeGridWeek'
				  }}
				events={myJobs}
				locale={viLocale}
				dayMaxEvents={6}
			/>
		</div>
	);
};
