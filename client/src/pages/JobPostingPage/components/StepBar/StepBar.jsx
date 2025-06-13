import { useLocation } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";

export const StepBar = ({ serviceId }) => {
  const location = useLocation();

  const viewInfo = [
    { name: 'Chi tiết công việc', to: `/job-posting/view-service-detail/${serviceId}` },
    { name: 'Chọn vị trí làm việc', to: `/job-posting/working-location/${serviceId}` },
    { name: 'Lựa chọn chi tiết', to: `/job-posting/details/${serviceId}` },
    { name: 'Thông tin liên hệ', to: `/job-posting/time-contact/${serviceId}` },
    { name: 'Xác nhận', to: `/job-posting/confirm/${serviceId}` },
  ];

  const currentStepIndex = viewInfo.findIndex((v) => v.to === location.pathname);

  return (
    <div className="mb-10 pt-20 bg-white w-full">
      <div className="flex md2:hidden justify-center font-medium text-gray text-lg">
        Bước {currentStepIndex + 1} / {viewInfo.length}
      </div>

      <div className="hidden md2:block max-w-screen-lg mx-auto px-4">
        <ul className="flex items-center justify-between w-full gap-x-2">
          {viewInfo.map((info, index) => {
            const isCurrent = location.pathname === info.to;
            const isPassed = index < currentStepIndex;
            const isLast = index === viewInfo.length - 1;

            return (
              <li
                key={index}
                className={`flex items-start ${isLast ? 'w-auto flex-shrink-0' : 'flex-1'}`}
              >
                <div className="flex flex-col items-center min-w-[80px]">
                  <div
                    className={`size-10 flex justify-center items-center rounded-full font-medium text-white
              ${isCurrent ? 'bg-yellow' : isPassed ? 'bg-primary' : 'bg-gray'}`}
                  >
                    {isPassed ? <FaCheck size={14} /> : index + 1}
                  </div>
                  <span className="mt-2 text-sm text-gray text-center">{info.name}</span>
                </div>

                {!isLast && <div className="flex-1 h-px mt-5 bg-gray"></div>}
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
};
