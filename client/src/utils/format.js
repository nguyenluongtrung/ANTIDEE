export const formatDate = (dateString) => {
	const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
	const formattedDate = new Date(dateString).toLocaleDateString(
		undefined,
		options
	);
	const [day, month, year] = formattedDate.split('/');

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

export const getCurrentTime = () => {
	const currentTime = new Date();
	const hours = currentTime.getHours();
	const minutes = currentTime.getMinutes();
	let period = 'AM';

	let formattedHours = hours;
	if (formattedHours >= 12) {
		formattedHours = formattedHours % 12;
		period = 'PM';
	}
	if (formattedHours === 0) {
		formattedHours = 12;
	}

	const formattedMinutes = minutes.toString().padStart(2, '0');
	return `${formattedHours}:${formattedMinutes} ${period}`;
};

export const formatTimerCountDown = (time) => {
	let minutes = Math.floor(time / 60);
	let seconds = Math.floor(time - minutes * 60);

	if (minutes < 10) minutes = '0' + minutes;
	if (seconds < 10) seconds = '0' + seconds;
	return minutes + ':' + seconds;
};

export const validCurrentDate = () => {
	const currentDate = new Date();
	return currentDate.toISOString().slice(0, 10);
};

export const formatDatePicker = () => {
	const startDateInput = document.querySelector('input[name="startDate"]');
	const endDateInput = document.querySelector('input[name="endDate"]');

	startDateInput.addEventListener('change', function () {
		endDateInput.min = this.value;
		if (new Date(endDateInput.value) < new Date(this.value)) {
			endDateInput.value = this.value;
		}
	});

	endDateInput.addEventListener('change', function () {
		if (new Date(this.value) < new Date(startDateInput.value)) {
			endDateInput.value = startDateInput.value;
		}
	});
};

export const formatTime = (timestamp) => {
	const date = new Date(timestamp);

	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? 'PM' : 'AM';

	const formattedHours = (((hours + 11) % 12) + 1).toString().padStart(2, '0');
	const formattedMinutes = minutes.toString().padStart(2, '0');

	return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
