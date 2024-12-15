const cron = require('node-cron');
const JobPost = require('./../../models/jobPostModel');
const Account = require('./../../models/accountModel');
const {
	addNewTransaction,
} = require('./../../controllers/transactionController');

cron.schedule('*/1 * * * *', async () => {
	const jobList = await JobPost.find({});
	const cancelJobList = [];

	const promises = jobList.map(async (jobPost) => {
		if (
			jobPost?.cancelDetails?.isCanceled == false &&
			jobPost?.hasCompleted?.customerConfirm == false &&
			jobPost?.hasCompleted?.domesticHelperConfirm == false
		) {
			const dueDate = new Date(jobPost.dueDate);
			const now = new Date();
			dueDate.setHours(0, 0, 0, 0);
			now.setHours(0, 0, 0, 0);
			if (dueDate.getTime() < now.getTime()) {
				if (
					jobPost?.domesticHelperId == null ||
					jobPost?.domesticHelperId == undefined
				) {
					jobPost.cancelDetails.isCanceled = true;
					jobPost.cancelDetails.reason = 'Không có người nhận việc';
					cancelJobList.push(jobPost);
				}
				await jobPost.save();
			}
		}
	});

	await Promise.all(
		cancelJobList.map(async (jobPost) => {
			const customerAcc = await Account.findById(jobPost.customerId);
			if (jobPost.paymentMethod == 'Ví người dùng') {
				customerAcc.accountBalance =
					customerAcc.accountBalance + Math.round(1 * jobPost?.totalPrice);
				await addNewTransaction(
					Math.round(1 * jobPost?.totalPrice),
					customerAcc._id,
					'Tiền bồi thường vì không có người nhận công việc',
					'refund',
					jobPost._id,
					'',
					'Ví người dùng'
				);
			}
			await customerAcc.save();
		})
	);

	await Promise.all(promises);
});
