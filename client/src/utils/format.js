export const formatDate = (dateString) => {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const formattedDate = new Date(dateString).toLocaleDateString(
		undefined,
		options
	);
	const [month, day, year] = formattedDate.split('/');

	return `${day}/${month}/${year}`;
};

export const formatDateInput = (dateString) => {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const formattedDate = new Date(dateString).toLocaleDateString(
		undefined,
		options
	);
	const [month, day, year] = formattedDate.split('/');

	return `${year}-${month}-${day}`;
};

export const formatTimerCountDown = (time) => {
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time - minutes * 60);

	if (minutes < 10) minutes = '0' + minutes;
	if (seconds < 10) seconds = '0' + seconds;
	return minutes + ':' + seconds;
};
