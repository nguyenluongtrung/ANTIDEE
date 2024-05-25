import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import "./UpdateQualification.css";
import { useState } from "react";
import { updateQualification } from "../../../../features/qualifications/qualificationSlice";

export const UpdateQualification = ({
  setIsOpenUpdateQualification,
  handleGetAllQualifications,
  chosenQualificationId,
}) => {
  const { qualifications, isLoading } = useSelector(
    (state) => state.qualifications
  );
  const [chosenQualification, setChosenQualification] = useState(
    qualifications[
      qualifications.findIndex(
        (qualification) => qualification._id == chosenQualificationId
      )
    ]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

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

    if (name !== chosenQualification.name) {
      if (checkExistNames(name)) {
        toast.error("Tên chứng chỉ đã tồn tại", errorStyle);
        return;
      }
    }

    const result = await dispatch(
      updateQualification({
        qualificationData: qualificateData,
        id: chosenQualificationId,
      })
    );
    if (result.type.endsWith("fulfilled")) {
      toast.success("Cập nhật chứng chỉ thành công");
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    setIsOpenUpdateQualification(false);
    handleGetAllQualifications();
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
    <div className="popup active">
      <div className="overlay"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content rounded-md p-5"
        style={{ width: "35vw" }}
      >
        <AiOutlineClose
          className="absolute text-sm hover:cursor-pointer"
          onClick={() => setIsOpenUpdateQualification(false)}
        />
        <p className="grid text-green font-bold text-xl justify-center">
          CẬP NHẬT CHỨNG CHỈ
        </p>
        <table className="mt-3">
          <tbody>
            <tr>
              <td>
                <span>Tên chứng chỉ</span>
              </td>
              <td className="pl-6 py-1 w-80">
                <input
                  type="text"
                  {...register("name")}
                  defaultValue={chosenQualification?.name}
                  className="create-exam-input text-center"
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="">Mô tả</span>
              </td>
              <td className="pl-6 py-1">
                <textarea
                  type="text"
                  {...register("description")}
                  defaultValue={chosenQualification?.description}
                  className="create-exam-textarea text-center"
                  rows="3"
                  cols="40"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
        >
          Cập nhật chứng chỉ
        </button>
      </form>
    </div>
  );
};
