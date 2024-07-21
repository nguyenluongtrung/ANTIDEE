import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AccountBalanceColumnChart from './component/ColumnChart/ColumnChart';
import AccountBalanceAreaChart from './component/AreaChart/AreaChart';

export const IncomeDomesticHelper = () => {

	return (
		<>
			<div className="w-full min-h-screen bg-white flex flex-row">
				<div className="flex-1 pl-10 pr-20 pb-10 pt-5">
					
				
					<div className="flex justify-between mb-10">
						<div
							className="rounded-lg p-10 gap-5 w-[35vw]"
							style={{ backgroundColor: '#faf6fb' }}
						>
							<AccountBalanceColumnChart />
						</div>
						<div
							className="rounded-lg p-10 gap-5 w-[35vw]"
							style={{ backgroundColor: '#faf6fb' }}
						>
							<AccountBalanceAreaChart />
						</div>
					</div>
					
				</div>
			</div>
		</>
	);
};
