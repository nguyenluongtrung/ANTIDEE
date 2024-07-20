import { useLocation } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

export const StepBar = ({ nowJourney }) => {
  // const location = useLocation();

  const viewInfo = [
    // { name: 'Kiến con', marginLeftPx: '-10px', to: `/job-posting/view-service-detail/${serviceId}` },
    // { name: 'Kiến trưởng thành', marginLeftPx: '-45px', to: `/job-posting/working-location/${serviceId}` },
    // { name: 'Kiến thợ', marginLeftPx: '-10px', to: `/job-posting/details/${serviceId}` },
    // { name: 'Kiến chiến binh', marginLeftPx: '-30px', to: `/job-posting/time-contact/${serviceId}` },
    // { name: 'Kiến chúa', marginLeftPx: '-15px', to: `/job-posting/confirm/${serviceId}` },
    { name: "Kiến con", marginLeftPx: "-10px", to: 0 },
    { name: "Kiến trưởng thành", marginLeftPx: "-45px", to: 1 },
    { name: "Kiến thợ", marginLeftPx: "-10px", to: 2 },
    { name: "Kiến chiến binh", marginLeftPx: "-30px", to: 3 },
    { name: "Kiến chúa", marginLeftPx: "-15px", to: 4 },
  ];

  return (
    <div className="mx-auto pt-20">
      <ul className="relative flex flex-row gap-x-2 px-10 z-10">
        {viewInfo.map((info, index) => {
          const isCurrentPath = nowJourney === info.to;
          const isPreviousPath =
            index < viewInfo.findIndex((v) => v.to === nowJourney);
          const isLastStep = index === viewInfo.length - 1;

          return (
            <li
              key={index}
              className={`flex-1 ${
                isLastStep ? "flex-grow-0 flex-shrink w-auto" : ""
              }`}
            >
              <div className="min-w-10 min-h-10 w-full inline-flex items-center text-xs align-middle">
                <span
                  className={`size-10 flex justify-center items-center flex-shrink-0 font-medium ${
                    isCurrentPath
                      ? "bg-yellow"
                      : isPreviousPath
                      ? "bg-primary"
                      : "bg-yellow"
                  } text-white rounded-full`}
                >
                  {isCurrentPath ? (
                    index + 1
                  ) : isPreviousPath ? (
                    <FaCheck />
                  ) : (
                    index + 1
                  )}
                </span>
                {!isLastStep && (
                  <div className="ms-2 w-full h-px flex-1 bg-gray"></div>
                )}
              </div>
              <div className="mt-3">
                <span
                  className="block text-sm font-bold overflow-hidden whitespace-nowrap text-ellipsis"
                  style={{ marginLeft: viewInfo[index].marginLeftPx }}
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
