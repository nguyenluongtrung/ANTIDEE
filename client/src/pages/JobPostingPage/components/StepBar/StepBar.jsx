import { useLocation } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";

export const StepBar = ({serviceId}) => {
  const location = useLocation();

  const viewInfo = [
    { name: 'Chi tiết công việc', marginLeftPx: '-40px', to: `/job-posting/view-service-detail/${serviceId}` },
    { name: 'Chọn vị trí làm việc', marginLeftPx: '-45px', to: `/job-posting/working-location/${serviceId}` },
    { name: 'Lựa chọn chi tiết', marginLeftPx: '-35px', to: `/job-posting/details/${serviceId}` },
    { name: 'Thông tin liên hệ', marginLeftPx: '-35px', to: `/job-posting/time-contact/${serviceId}` },
    { name: 'Xác nhận', marginLeftPx: '-10px', to: `/job-posting/confirm/${serviceId}` },
  ];

  return (
    <div className="mb-10 pt-20 mx-auto bg-white">
      <ul className="relative flex flex-row gap-x-2 px-10">
        {viewInfo.map((info, index) => {
          const isCurrentPath = location.pathname === info.to;
          const isPreviousPath = index < viewInfo.findIndex((v) => v.to === location.pathname);
          const isLastStep = index === viewInfo.length - 1;

          return (
            <li
              key={index}
              className={`flex-1 ${isLastStep ? 'flex-grow-0 flex-shrink w-auto' : ''}`}
            >
              <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
                <span
                  className={`size-10 flex justify-center items-center flex-shrink-0 font-medium ${
                    isCurrentPath ? 'bg-yellow' : isPreviousPath ? 'bg-primary' : 'bg-yellow'
                  } text-white rounded-full`}
                >
                  {isCurrentPath ? index + 1 : isPreviousPath ? <FaCheck /> : index + 1}
                </span>
                {!isLastStep && (
                  <div className="ms-2 w-full h-px flex-1 bg-gray"></div>
                )}
              </div>
              <div className="mt-3">
                <span
                  className="block text-sm font-medium text-gray overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ marginLeft: viewInfo[index].marginLeftPx}}
                >
                  {info.name}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};