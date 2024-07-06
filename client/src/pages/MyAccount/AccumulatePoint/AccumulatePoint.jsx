// HistoryComponent.js
import React, { useEffect, useState } from 'react';
import { formatDate,formatDateTime} from '../../../utils/format';
import { getAccountInformation } from '../../../features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { Sidebar } from '../components/Sidebar/Sidebar';
export const AccumulatePoint = () => {
  const [account, setAccount] = useState();
  const dispatch = useDispatch();

  async function initiateAccountInformation() {
    let output = await dispatch(getAccountInformation());

    setAccount(output.payload);
  }


  useEffect(() => {
    initiateAccountInformation();
  }, []);


  return (
    <div className="flex px-16 pt-20">
      <div className="left-container pr-24 pt-3 w-1/3">
        <Sidebar account={account} />
      </div>
      <div className="w-full">
      <h5 className="font-bold text-2xl text-green text-center">
					LỊCH SỬ ĐIỂM TÍCH LŨY
				</h5>
        <table className="w-full border-b border-gray mt-3">
          <thead>
            <tr className="text-sm font-medium text-gray border-b border-gray">
              <th className="py-2 px-4 text-center font-bold">STT</th>
              <th className="py-2 px-4 text-center font-bold">Điểm</th>
              <th className="py-2 px-4 text-center font-bold">Dịch vụ</th>
              <th className="py-2 px-4 text-center font-bold">Ngày cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {account?.aPointHistory.map((historyItem, index) => (
              <tr className="hover:bg-purple transition-colors group odd:bg-light_pink cursor-pointer">
                <td className="font-medium text-center text-gray p-3">
                  <span>{index + 1}</span>
                </td>
                <td className="font-medium text-center text-gray p-3">
                  <span>{historyItem?.apoint}</span>
                </td>
                <td className="font-medium text-center text-gray p-3">
                  <span>{historyItem?.serviceId?.name}</span>
                </td>
                <td className="font-medium text-center text-gray p-3">
                  <span>{formatDateTime(historyItem?.update)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


