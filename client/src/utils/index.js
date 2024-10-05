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

export const extractOptions = (input) => {
	const options = input.split(/[A-Z]\.\s+/).filter((option) => option !== '');
	return options;
};
