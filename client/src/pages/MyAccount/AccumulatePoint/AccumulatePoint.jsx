// HistoryComponent.js
import React from 'react';
import { useSelector } from 'react-redux';

export const AccumulatePoint = () => {


	const updateHistory = useSelector((state) => state.auth.updateHistory);
	console.log(updateHistory)

  return (
    <div className='m-20'>
      <h2>Lịch sử cập nhật điểm</h2>
      {updateHistory.length === 0 ? (
        <p>Không có lịch sử cập nhật.</p>
      ) : (
        <ul>
          {updateHistory.map((update, index) => (
            <li key={index}>
              <p>Account ID: {update.accountId}</p>
              <p>Points: {update.points}</p>
              <p>Timestamp: {update.timestamp}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


