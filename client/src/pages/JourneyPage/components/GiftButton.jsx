import { useDispatch, useSelector } from "react-redux";
import { getAccountInformation, receiveGiftHistory } from "../../../features/auth/authSlice";
import { GoGift } from "react-icons/go";

const GiftButton = ({ levelName, levelApoint, isReceived, setIsPopupOpen }) => {
    const dispatch = useDispatch();
    const { account } = useSelector((state) => state.auth);

    const handleClick = async () => {
        const result = await dispatch(
            receiveGiftHistory({
                domesticHelperId: account._id,
                levelName,
                levelApoint,
            })
        );
        if (result.type.endsWith("fulfilled")) {
            setIsPopupOpen(true);
            await dispatch(getAccountInformation());
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isReceived}
            className={` ${isReceived ? "received" : ""
                } animate-bounce  hover:text-green`}
        >
            {isReceived ? (
                <div className="flex flex-col items-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/4017/4017791.png"
                        className="h-14"
                    />
                    "Đã nhận quà"
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <GoGift size={40} />
                    {`Nhận quà ${levelName}`}
                </div>
            )}
        </button>
    );
};

export default GiftButton