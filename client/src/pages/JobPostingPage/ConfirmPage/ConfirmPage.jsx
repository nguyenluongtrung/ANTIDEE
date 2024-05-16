import { StepBar } from "../components/StepBar/StepBar"

export const ConfirmPage = () => {
    return <div className="w-full px-20">
    <StepBar />

    <div className="flex items-center justify-center">
        <button className="mt-10 w-[200px] py-3 bg-green rounded-full text-white hover:opacity-70">
            Hoàn tất
        </button>
    </div>
</div>
}