import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import "./UpdateVoucher.css";
import { updateVoucher } from "../../../../features/vouchers/voucherSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../../firebase";
import { useEffect, useRef, useState } from "react";
import { formatDateInput, formatDatePicker } from "../../../../utils/format";
import { rules } from "../../../../utils/rules";
import { getAllServices } from "../../../../features/services/serviceSlice";
import { FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateVoucher = ({
  setIsOpenUpdateVoucher,
}) => {
  const { voucherId } = useParams();
  const navigate = useNavigate();
  const { vouchers, isLoading: voucherLoading } = useSelector(
    (state) => state.vouchers
  );
  const [chosenVoucher, setChosenVoucher] = useState(
    vouchers[vouchers.findIndex((voucher) => voucher._id == voucherId)]
  );

  const [services, setServiceList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [voucherUrl, setVoucherUrl] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  async function initiateServiceInformation() {
    let output = await dispatch(getAllServices());

    setServiceList(output.payload);
  }
  useEffect(() => {
    initiateServiceInformation();
  }, []);

  useEffect(() => {
    formatDatePicker();
  });
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `vouchers/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setVoucherUrl(downloadURL)
        );
      }
    );
  };

  const onSubmit = async (data) => {
    console.log(data);
    const trimmedData = {
      ...data,
      name: data.name.trim(),
      serviceId: selectedServices,
    };
    const voucherData =
      voucherUrl !== ""
        ? { ...trimmedData, image: voucherUrl }
        : { ...trimmedData };

    const result = await dispatch(
      updateVoucher({ voucherData, id: voucherId })
    );
    if (result.type.endsWith("fulfilled")) {
      toast.success("Cập nhật voucher thành công", successStyle);
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    setIsOpenUpdateVoucher(false);
    handleGetAllVouchers();
  };

  const handleServiceDeselect = (serviceId) => {
    const updatedSelectedServices = selectedServices.filter(
      (service) => service !== serviceId
    );
    setSelectedServices(updatedSelectedServices);
  };

  function formatInput(date) {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    if (chosenVoucher?.serviceId) {
      setSelectedServices(chosenVoucher.serviceId);
    }
  }, [chosenVoucher]);

  if (voucherLoading) {
    return <Spinner />;
  }

  return (
    <div className="popup active">
      <div className="overlay"
        onClick={() => setIsOpenUpdateVoucher(false)}></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content rounded-md p-5 overflow-y-auto"
        style={{ width: "35vw", maxHeight: "80vh" }}
      >
        <AiOutlineClose
          className="absolute text-sm hover:cursor-pointer"
          onClick={() => {
            setIsOpenUpdateVoucher(false)
            navigate("/admin-voucher");
          }
          }
        />
        <p className="grid text-green font-bold text-xl justify-center">
          CẬP NHẬT VOUCHER
        </p>
        <table className="mt-3 text-sm">
          <tbody>
            <tr>
              <td>
                <span className="font-bold">Tên voucher</span>
              </td>
              <td>
                <input
                  {...register("name", rules.name)}
                  className={`ml-6 py-1 update-voucher-input text-center w-80 ${errors.name ? "error-border" : ""
                    }`}
                  defaultValue={chosenVoucher?.name}
                ></input>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ảnh ưu đãi</span>
              </td>
              <td className="pl-[30px] py-2 grid justify-center">
                <img
                  src={
                    voucherUrl ||
                    chosenVoucher?.image ||
                    "https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg"
                  }
                  className="block mx-auto mb-1 w-[210px] h-[210px]"
                />
                <span
                  className="rounded-md rounded-customized-gray p-1 mx-auto w-[130px] text-center hover:cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    fileRef.current.click();
                  }}
                >
                  <span>Chọn ảnh ưu đãi</span>
                </span>
                <input
                  type="file"
                  ref={fileRef}
                  hidden
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setFileUploadError(""); // Reset error state on file change
                  }}
                />
                <p className="text-sm self-center pl-2">
                  {fileUploadError ? (
                    <span className="text-red">{fileUploadError}</span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-gray">{`Đang tải lên ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className="text-green">Tải ảnh lên thành công!</span>
                  ) : (
                    ""
                  )}
                </p>
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <span className="font-bold">Mô tả</span>
              </td>
              <td className="pl-6 py-1">
                <input
                  {...register("description", rules.description)}
                  defaultValue={chosenVoucher?.description}
                  className={`text-sm update-voucher-input text-center ${errors.description ? "error-border" : ""
                    }`}
                />
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold">Loại voucher</span>
              </td>
              <td className="pt-3 pl-12">
                <select
                  {...register("couponType", rules.couponType)}
                  defaultValue={chosenVoucher?.couponType}
                  className={`text-center create-voucher-input w-72 ${errors.couponType ? "error-border" : ""
                    }`}
                >
                  <option value="">Chọn loại voucher</option>
                  <option value="Voucher">Voucher</option>
                  <option value="Promotion">Promotion</option>
                </select>
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold">Thể loại</span>
              </td>
              <td className="pt-3 pl-12">
                <select
                  {...register("category", rules.category)}
                  defaultValue={chosenVoucher?.category}
                  className={`text-center create-voucher-input w-72 ${errors.category ? "error-border" : ""
                    }`}
                >
                  <option value="">Chọn thể loại</option>
                  <option value="Mua sắm">Mua sắm</option>
                  <option value="Dịch vụ">Dịch vụ</option>
                  <option value="Giải trí">Giải trí</option>
                  <option value="Du lịch">Du lịch</option>
                  <option value="Ẩm thực">Ẩm thực</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ngày bắt đầu</span>
              </td>
              <td className="pl-6 py-1">
                <input
                  {...register("startDate", rules.startDate)}
                  type="date"
                  defaultValue={formatInput(chosenVoucher?.startDate)}
                  className={`update-voucher-input text-center ${errors.startDate ? "error-input" : ""
                    }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ngày kết thúc</span>
              </td>
              <td className="pl-6 py-1">
                <input
                  {...register("endDate", rules.endDate)}
                  type="date"
                  defaultValue={formatInput(chosenVoucher?.endDate)}
                  className={`update-voucher-input text-center ${errors.endDate ? "error-input" : ""
                    }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Giá trị chiết khấu</span>
              </td>
              <td className="pl-6 py-1">
                <input
                  type="text"
                  {...register("discountValue", rules.discountValue)}
                  defaultValue={chosenVoucher?.discountValue}
                  className={`update-voucher-input text-center pr-3.5 ${errors.discountValue ? "error-input" : ""
                    }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                {" "}
                <span className="font-bold">Số lượng</span>
              </td>
              <td className="pl-6 py-1">
                <input
                  type="number"
                  {...register("quantity", rules.quantity)}
                  defaultValue={chosenVoucher?.quantity}
                  className={`update-voucher-input text-center ${errors.quantity ? "error-input" : ""
                    }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Điểm trao đổi</span>
              </td>
              <td className="pl-6 py-1">
                <input
                  type="number"
                  {...register("price", rules.price)}
                  defaultValue={chosenVoucher?.price}
                  className={`update-voucher-input text-center ${errors.price ? "error-input" : ""
                    }`}
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Mã giảm giá</span>
              </td>
              <td className="pl-6 py-1">
                <input
                  type="text"
                  {...register("code", rules.code)}
                  defaultValue={chosenVoucher?.code}
                  className={`update-voucher-input text-center ${errors.code ? "error-input" : ""
                    }`}
                />
                {errors.code && (
                  <p className="text-red small-text text-sm">
                    {errors.code.message}
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Lựa chọn dịch vụ</span>
              </td>
              <td className="">
                <div className="input-box">
                  <select
                    size={6}
                    {...register("serviceId", rules.serviceId)}
                    multiple
                    onChange={(e) => {
                      setSelectedServices([
                        ...selectedServices,
                        e.target.value,
                      ]);
                    }}
                    className="create-question-input text-center ml-[60px] text-sm w-[300px]"
                  >
                    {services?.map((service) => {
                      // Chỉ hiển thị những dịch vụ chưa được chọn
                      if (!selectedServices.includes(service?._id)) {
                        return (
                          <option key={service?._id} value={service?._id}>
                            {service?.name}
                          </option>
                        );
                      }
                    })}
                  </select>
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <span className="font-bold">Đã chọn:</span>
              </td>
              <td className="pl-[130px] py-1">
                <ul>
                  {selectedServices.map((selectedId) => {
                    const selectedService = services.find(
                      (service) => service._id === selectedId
                    );
                    return (
                      <li key={selectedId} className="flex">
                        {selectedService?.name}
                        <button
                          className="ml-2 hover:cursor-pointer"
                          onClick={() => handleServiceDeselect(selectedId)}
                        >
                          <FaTimes className="w-3 text-red ml-1" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </td>
            </tr>

            <tr>
              <td className="pt-3">
                <span className="font-bold">Status</span>
              </td>
              <td className="pt-3 pl-12">
                <select
                  {...register("status", rules.status)}
                  defaultValue={chosenVoucher?.status}
                  className={`text-center create-voucher-input w-72 ${errors.status ? "error-border" : ""
                    }`}
                >
                  <option value="Enable">Enable</option>
                  <option value="Disable">Disable</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="block bg-primary
                     text-white text-center 
                     rounded-md p-2 font-medium mb-1 mt-3 hover:bg-primary_dark"
        >
          Cập nhật voucher
        </button>
      </form>
    </div>
  );
};
