import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Lesson from "../Lesson/Lesson";

export const PopupChangeLesson = ({ lessons }) => {
    return (
        <div className="rounded-sm p-4 flex flex-col gap-4">
            <SortableContext items={lessons.map((_, index) => index)} strategy={verticalListSortingStrategy}>
                {lessons.map((lesson, index) => (
                    <Lesson index={index} title={lesson.title} key={index} />
                ))}
            </SortableContext>
        </div>
    );
};
