import React from 'react';
import '../DeletePopup/DeletePopup.css'
import { IoWarningOutline } from 'react-icons/io5';

const DeletePopup = ({ open, onClose, deleteAction, itemName }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="popup-animation bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">Xác nhận xoá<IoWarningOutline  className='ml-2 text-red'/></h2>
                <p className="mb-6 text-base">
                    Bạn có chắc muốn xoá <strong>{itemName}</strong> này không? 
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-semibold bg-gray opacity-60 text-white rounded hover:opacity-100"
                    >
                        Không
                    </button>
                    <button
                        onClick={() => {
                            deleteAction();
                            onClose();
                        }}
                        className="px-4 py-2 font-semibold bg-anotherRed text-white rounded hover:bg-red"
                    >
                        Có
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePopup;
