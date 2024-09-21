const SystemBalance = require('./../models/systemBalanceModel');

const updateSystemBalanceForIncome = async (amount, accountId, message) => {
	try {
		const latestSystemBalance = await SystemBalance.findOne()
			.sort({ lastUpdated: -1 })
			.exec();

		if (!latestSystemBalance) {
			const initialBalance = new SystemBalance({
				currentBalance: amount,
				dailyTransactions: [
					{
						accountId,
						message,
						date: new Date(),
						totalIncome: amount,
						totalExpenses: 0,
					},
				],
				lastUpdated: new Date(),
			});

			await initialBalance.save();
			return initialBalance;
		}

		latestSystemBalance.currentBalance += amount;
		latestSystemBalance.lastUpdated = new Date();

		latestSystemBalance.dailyTransactions.push({
			accountId,
			message,
			date: new Date(),
			totalIncome: amount,
			totalExpenses: 0,
		});

		await latestSystemBalance.save();
		return latestSystemBalance;
	} catch (error) {
		throw error;
	}
};

const updateSystemBalanceForExpense = async (amount, accountId, message) => {
	try {
		const latestSystemBalance = await SystemBalance.findOne()
			.sort({ lastUpdated: -1 })
			.exec();

		if (!latestSystemBalance) {
			const initialBalance = new SystemBalance({
				currentBalance: 0 - amount,
				dailyTransactions: [
					{
						accountId,
						message,
						date: new Date(),
						totalIncome: 0,
						totalExpenses: amount,
					},
				],
				lastUpdated: new Date(),
			});

			await initialBalance.save();
			return initialBalance;
		}
		latestSystemBalance.currentBalance -= amount;
		latestSystemBalance.lastUpdated = new Date();

		latestSystemBalance.dailyTransactions.push({
			accountId,
			message,
			date: new Date(),
			totalIncome: 0,
			totalExpenses: amount,
		});

		await latestSystemBalance.save();
		return latestSystemBalance;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	updateSystemBalanceForIncome,
	updateSystemBalanceForExpense,
};
