export const StepBar = () => {
	const viewInfo = [
		{ name: 'Chi tiết công việc' },
		{ name: 'Chọn vị trí làm việc' },
		{ name: 'Lựa chọn chi tiết' },
		{ name: 'Lựa chọn thời gian và thông tin liên hệ' },
	];

	return (
		<div className="">
			{/* Nút */}
			<ul className="relative flex flex-row gap-x-2 px-10">
				{viewInfo.map((info, index) => {
					return (
						<li className="shrink basis-0 flex-1 group">
							<div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
								<span className="size-10 flex justify-center items-center flex-shrink-0 bg-yellow font-medium text-white rounded-full">
									{index + 1}
								</span>
								<div className="ms-2 w-full h-px flex-1 bg-gray group-last:hidden"></div>
							</div>
							<div className="mt-3">
								<span className="block text-sm font-medium text-gray">
									{info.name}
								</span>
							</div>
						</li>
					);
				})}
				<li className="shrink basis-0 group">
					<div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
						<span className="size-10 flex justify-center items-center flex-shrink-0 bg-yellow font-medium text-white rounded-full">
							5
						</span>
						<div className="ms-2 w-full h-px flex-1 bg-gray group-last:hidden"></div>
					</div>
					<div className="mt-3">
						<span className="block text-sm font-medium text-gray">
							Xác nhận
						</span>
					</div>
				</li>
			</ul>
		</div>
	);
};
