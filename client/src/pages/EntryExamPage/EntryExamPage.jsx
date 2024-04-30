import './EntryExamPage.css'

export const EntryExamPage = () => {
    return <div className='mx-16'>
        <div className="exam-info p-3 rounded-xl bg-light mb-8">
            <p className="text-brown font-bold mb-1">Chuyên môn: <span>Giúp việc nhà theo giờ</span></p>
            <p className="mb-1">Thời gian còn lại: <span className="text-primary text-sm font-bold">20:00</span></p>
            <p className="mb-1">Câu hỏi:</p>
            <div className='number-list mb-2'>
                <div className='number-item rounded-md text-center'><span>1</span></div>
            </div>
            <button className="inline bg-white text-center pb-1 rounded-md submit-test-btn"><span className="text-primary">Nộp bài</span></button>
        </div>
        <div className="question-list">
            <div className='question-item rounded-xl p-3 shadow-[-10px_13px_10px_-10px_rgba(0,0,0,0.8)] mb-8'>
                <div><span className='font-bold underline'>Câu 1: </span><span>Trong những công việc dưới đây, công việc nào mang tính chất là dọn dẹp gia đình?</span></div>
                <div><input type='radio' className='w-3 mr-2 radio-answer-item'/><span>A. Dọn dẹp lau chùi, vệ sinh nhà cửa, giặt quần áo, ủi đồ, nấu ăn.</span></div>
                <div><input type='radio' className='w-3 mr-2'/><span>B. Vệ sinh gạch vôi, vữa nhà mới xây, cắt cỏ.</span></div>
                <div><input type='radio' className='w-3 mr-2'/><span>C. Trông người già và em bé.</span></div>
                <div><input type='radio' className='w-3 mr-2'/><span>D. Đáp án A và B.</span></div>
            </div>
        </div>
        <button className="block mx-auto bg-white text-center pb-1 rounded-md next-test-btn hover:bg-green text-green hover:text-white"><span className="">Tiếp theo</span></button>
    </div>
}