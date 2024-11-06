import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Lesson = ({ index, title }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="bg-light_gray rounded-md p-2 font-semibold"
        >
            Bài {index + 1}: {title}
        </div>
    );
};

export default Lesson;
