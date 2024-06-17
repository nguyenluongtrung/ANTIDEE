const cron = require('node-cron');
const JobPost = require('./../../models/jobPostModel');

const getCurrentTimeString = () => {
	const now = new Date();
	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();
	return `${currentHour.toString().padStart(2, '0')}:${currentMinute
		.toString()
		.padStart(2, '0')}`;
};

cron.schedule('*/1 * * * *', async () => {
	const jobList = await JobPost.find({});

	const promises = jobList.map(async (jobPost) => {
		if (
			jobPost?.cancelDetails?.isCanceled === false &&
			jobPost?.hasCompleted?.customerConfirm === false &&
			jobPost?.hasCompleted?.domesticHelperConfirm === false
		) {
			const startingDate = new Date(jobPost.workingTime.startingDate);
			startingDate.setMinutes(
				startingDate.getMinutes() - startingDate.getTimezoneOffset()
			);
			const startingHour = parseInt(
				jobPost.workingTime.startingHour.split(':')[0]
			);
			const startingMinute = parseInt(
				jobPost.workingTime.startingHour.split(':')[1]
			);

			const startingTime = `${startingHour
				.toString()
				.padStart(2, '0')}:${startingMinute.toString().padStart(2, '0')}`;

			if (
				startingDate.toDateString() < new Date().toDateString() ||
				(startingDate.toDateString() == new Date().toDateString() &&
					startingTime <= getCurrentTimeString())
			) {
				jobPost.cancelDetails.isCanceled = true;
				jobPost.cancelDetails.reason = 'Không có người nhận việc';
				await jobPost.save();
			}
		}
	});

	await Promise.all(promises);
	console.log('Job cancellation process completed.');
});

console.log('Cancellation task is called');
