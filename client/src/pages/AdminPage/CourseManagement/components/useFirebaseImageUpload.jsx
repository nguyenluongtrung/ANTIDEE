import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../../../firebase';

export const useFirebaseImageUpload = () => {
    const [file, setFile] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, `course-images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageUrl(downloadURL);
                    setFilePerc(100); // Đặt phần trăm tải lên hoàn tất
                });
            }
        );
    };

    useEffect(() => {
        if (file) {
            setFileUploadError(false);
            handleFileUpload(file);
        }
    }, [file]);

    return {
        setFile,    // Để set file từ component khác
        filePerc,   // Phần trăm tải lên
        fileUploadError, // Kiểm tra lỗi tải lên
        imageUrl    // URL ảnh sau khi tải lên thành công
    };
};
