const cron = require('node-cron');
const JobPost = require('./../../models/jobPostModel');

cron.schedule('*/1 * * * *', async () => {
	const jobList = await JobPost.find({});

	const promises = jobList.map(async (jobPost) => {
		if (
			jobPost?.cancelDetails?.isCanceled === false &&
			jobPost?.hasCompleted?.customerConfirm === false &&
			jobPost?.hasCompleted?.domesticHelperConfirm === false &&
			(jobPost?.domesticHelperId == null ||
				jobPost?.domesticHelperId == undefined)
		) {
			const dueDate = new Date(jobPost.dueDate);
			const now = new Date();

			dueDate.setHours(0, 0, 0, 0);
			now.setHours(0, 0, 0, 0);
			if (dueDate < now) {
				jobPost.cancelDetails.isCanceled = true;
				jobPost.cancelDetails.reason = 'Không có người nhận việc';
				await jobPost.save();
			}
		}
	});

	await Promise.all(promises);
});
