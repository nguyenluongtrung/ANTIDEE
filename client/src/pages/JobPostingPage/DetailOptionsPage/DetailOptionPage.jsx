import { useLocation, useNavigate } from "react-router-dom";
import { StepBar } from "../components/StepBar/StepBar"

export const DetailOptionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

	const handleNextStep = () => {
		navigate('/job-posting/time-contact', { state: { address: location.state.address } });
	};

    return <div className="w-full px-20">
    <StepBar />

    <div className="flex items-center justify-center">
        <button className="mt-10 w-[500px] py-3 bg-primary rounded-full text-white hover:opacity-70" onClick={handleNextStep}>
            Tiếp theo
        </button>
    </div>
</div>
}