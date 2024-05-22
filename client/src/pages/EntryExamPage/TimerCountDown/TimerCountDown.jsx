import { useEffect, useRef, useState } from "react"
import { formatTimerCountDown } from "../../../utils/format";

export const TimerCountDown = ({seconds, handleSubmitExam, setFinishTime, isSubmit}) => {
    const [countdown, setCountdown] = useState(seconds);
    const timerId = useRef();

    useEffect(() => {
        timerId.current = setInterval(() => {
            setCountdown(prev => prev - 1)
        }, 1000)
        return () => clearInterval(timerId.current)
    }, [])

    useEffect(() => {
        if(countdown <= 0){
            clearInterval(timerId.current);
            handleSubmitExam();
        }
        if(countdown > 0 && isSubmit){
            clearInterval(timerId.current);
        }
    }, [countdown])

    return <span>
        {formatTimerCountDown(countdown)}
    </span>
}