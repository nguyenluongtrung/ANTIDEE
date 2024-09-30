import { appendHourToDate } from './format';

export const validateIntersectWorkingHours = (currentJobPost) => {
	const currentStartingTime = appendHourToDate(
		currentJobPost.startingDate,
		currentJobPost.startingHour
	);
	const currentFinishTime = appendHourToDate(
		currentJobPost.startingDate,
		currentJobPost.startingHour
	);
	return true;
};
