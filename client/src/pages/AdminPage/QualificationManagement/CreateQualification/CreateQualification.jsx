import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast, { Toaster } from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import "./CreateQualification.css";
import { createQualification } from "../../../../features/qualifications/qualificationSlice";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { CiBoxList } from "react-icons/ci";
import { IoCreateOutline } from "react-icons/io5";


export const CreateQualification = () => {
  const { qualifications, isLoading } = useSelector(
    (state) => state.qualifications
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const qualificateData = {
      name: data.name.trim(),
      description: data.description.trim(),
    };

    const { name, description } = qualificateData;

    if (!name.trim()) {
      toast.error('Vui lòng nhập "Tên chứng chỉ"', errorStyle);
      return;
    }

    // Check if the name contains any spaces
    if (/ {2,}/.test(name)) {
      toast.error("Tên không được chứa khoảng trắng !!!", errorStyle);
      return;
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập "Mô tả" chứng chỉ', errorStyle);
      return;
    }

    if (/ {2,}/.test(description)) {
      toast.error("Mô tả không được chứa khoảng trắng !!!", errorStyle);
      return;
    }

    if (checkExistNames(name)) {
      toast.error("Tên chứng chỉ đã tồn tại", errorStyle);
      return;
    }

    const result = await dispatch(createQualification(qualificateData));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Thêm chứng chỉ thành công");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
  };

  const checkExistNames = (newName) => {
    const listNames = qualifications.map((item) => item.name);
    if (listNames.includes(newName)) {
      return true;
    } else {
      return false;
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full min-h-screen bg-white flex flex-row">
      <AdminSidebar />
      <Toaster />
      <div className="w-full p-10">
        <div className="flex justify-between">
          <div className="flex mb-10 text-2xl font-bold">
            Đang <p className="text-primary text-2xl px-2">Tạo mới</p> chứng chỉ{' '}
          </div>
          <div>
            <button type="submit" onClick={() => navigate('/admin-qualification')} className='bg-primary p-2 rounded text-white font-semibold flex items-center fea-item hover:bg-primary_dark'>Quay lại danh sách <CiBoxList size={25} className="mx-2" /></button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 '>
            <div className="flex flex-col w-full col-span-1 lg:col-span-4">
              <div className="text-gray mb-2">Nhập tên chứng chỉ</div>
              <input
                type="text"
                {...register('name')}
                className="shadow appearance-none border py-3 px-3 rounded"
              />
            </div>
            <div className="flex flex-col w-full col-span-1 lg:col-span-4">
              <div className="text-gray mb-2">Nhập mô tả chứng chỉ</div>
              <textarea
                type="text"
                {...register('description')}
                className="shadow appearance-none border py-3 px-3 rounded"
              />
            </div>
          </div>
          <button type="submit" className='bg-primary p-2 rounded text-white font-bold w-[200px] mb-4 fea-item hover:bg-primary_dark flex items-center justify-center'>Tạo chứng chỉ <IoCreateOutline size={25} className="ml-2" /></button>
        </form>
        <div className="mb-1 rounded-sm border-b border-light_gray"></div>
      </div>
    </div>
  );
};
