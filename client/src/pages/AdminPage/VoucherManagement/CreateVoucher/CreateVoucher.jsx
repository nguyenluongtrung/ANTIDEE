import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createVoucher } from "../../../../features/vouchers/voucherSlice";
import { Spinner } from "../../../../components";
import toast from "react-hot-toast";
import { errorStyle, successStyle } from "../../../../utils/toast-customize";
import { AiOutlineClose } from "react-icons/ai";
import "./CreateVoucher.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../../../firebase";
import { rules } from "../../../../utils/rules";
import { formatDatePicker, validCurrentDate } from "../../../../utils/format";
import { getAllServices } from "../../../../features/services/serviceSlice";
import { FaTimes } from "react-icons/fa";

export const CreateVoucher = ({
  setIsOpenCreateVoucher,
  handleGetAllVouchers,
}) => {
  const currentDate = validCurrentDate();
  const { isLoading: voucherLoading } = useSelector((state) => state.vouchers);
  const [services, setServiceList] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: "Enable",
    },
  });
  const dispatch = useDispatch();

  useEffect(() => {
    formatDatePicker();
  });

  async function initiateServiceInformation() {
    let output = await dispatch(getAllServices());

    setServiceList(output.payload);
  }
  useEffect(() => {
    initiateServiceInformation();
  }, []);

  const onSubmit = async (data) => {
    const trimmedData = {
      ...data,
      serviceId: selectedServices
    };
    const voucherData =
      voucherUrl !== ""
        ? { ...trimmedData, image: voucherUrl }
        : {
            ...trimmedData,
            image:
              "https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg",
          };
console.log(voucherData)
    const result = await dispatch(createVoucher(voucherData));
    console.log(result);
    if (result.type.endsWith("fulfilled")) {
      toast.success("Thêm voucher thành công", successStyle);
    } else if (result?.error?.message === "Rejected") {
      toast.error(result?.payload, errorStyle);
    }
    setIsOpenCreateVoucher(false);
    handleGetAllVouchers();
  };

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [voucherUrl, setServiceUrl] = useState("");

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    if (file.size > 2 * 1024 * 1024) {
      setFileUploadError("Dung lượng ảnh phải nhỏ hơn 2MB");
      setFilePerc(0);
      return;
    }

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
        setFileUploadError(""); // Reset error state on new upload
      },
      (error) => {
        setFileUploadError("Tải ảnh lên thất bại");
        setFilePerc(0); // Reset progress on error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setServiceUrl(downloadURL);
          setFilePerc(100); // Set progress to 100 on successful upload
          setFileUploadError(""); // Reset error state on successful upload
        });
      }
    );
  };

  const handleServiceDeselect = (serviceId) => {
    const updatedSelectedServices = selectedServices.filter(
      (service) => service !== serviceId
    );
    setSelectedServices(updatedSelectedServices);
  };
  
  if (voucherLoading) {
    return <Spinner />;
  }

  return (
    <div className="popup active">
      <div className="overlay"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content rounded-md p-5 w-[35vw] max-h-[80vh] overflow-y-auto  "
      >
        <AiOutlineClose
          className="absolute text-sm hover:cursor-pointer"
          onClick={() => setIsOpenCreateVoucher(false)}
        />
        <p className="grid text-green font-bold text-xl justify-center">
          TẠO VOUCHER
        </p>
        <table className="mt-3 text-sm">
          <tbody>
            <tr>
              <td>
                <span className="font-bold">Tên voucher</span>
              </td>
              <td className="pl-12">
                <input
                  {...register("name", rules.name)}
                  className={`text-center w-72 create-voucher-input ${
                    errors.name ? "error-border" : ""
                  }`}
                  placeholder="Nhập tên voucher"
                  maxLength={30}
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
                    "https://static8.depositphotos.com/1010338/959/i/450/depositphotos_9597931-stock-photo-team-gear-3d-isolated-characters.jpg"
                  }
                  className="block mx-auto mb-1 w-[120px] h-[120px]"
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
              <td className="pt-3">
                <span className="font-bold">Mô tả</span>
              </td>
              <td className="pt-3 pl-12">
                <input
                  {...register("description", rules.description)}
                  className={`text-center w-72 create-voucher-input ${
                    errors.description ? "error-border" : ""
                  }`}
                  placeholder="Mô tả"
                  maxLength={255}
                ></input>
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold">Loại voucher</span>
              </td>
              <td className="pt-3 pl-12">
                <select
                  {...register("couponType", rules.couponType)}
                  className={`text-center create-voucher-input w-72 ${
                    errors.couponType ? "error-border" : ""
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
                  className={`text-center create-voucher-input w-72 ${
                    errors.category ? "error-border" : ""
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
              <td className="pt-3">
                <span className="font-bold">Ngày bắt đầu</span>
              </td>
              <td className="pt-3 pl-12">
                <input
                  {...register("startDate", rules.startDate)}
                  className={`text-center create-voucher-input w-72 ${
                    errors.startDate ? "error-input" : ""
                  }`}
                  type="date"
                  min={currentDate}
                  placeholder="Ngày bắt đầu"
                ></input>
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold">Ngày kết thúc</span>
              </td>
              <td className="pt-3 pl-12">
                <input
                  {...register("endDate", rules.endDate)}
                  className={`text-center create-voucher-input w-72 ${
                    errors.endDate ? "error-input" : ""
                  }`}
                  type="date"
                  min={currentDate}
                  placeholder="Ngày kết thúc"
                ></input>
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold ">Giá trị chiết khấu</span>
              </td>
              <td className="pt-3 pl-12">
                <input
                  {...register("discountValue", rules.discountValue)}
                  className={`text-center create-voucher-input w-72 pr-3.5 ${
                    errors.discountValue ? "error-input" : ""
                  }`}
                  type="text"
                  placeholder="Giá trị chiết khấu (%)"
                ></input>
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold">Số lượng</span>
              </td>
              <td className="pt-3 pl-12">
                <input
                  {...register("quantity", rules.quantity)}
                  className={`text-center create-voucher-input w-72 ${
                    errors.quantity ? "error-input" : ""
                  }`}
                  type="number"
                  placeholder="Số lượng"
                ></input>
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold">Điểm trao đổi</span>
              </td>
              <td className="pt-3 pl-12">
                <input
                  {...register("price", rules.price)}
                  className={`text-center create-voucher-input w-72 ${
                    errors.price ? "error-input" : ""
                  }`}
                  type="number"
                  placeholder="Điểm trao đổi"
                ></input>
              </td>
            </tr>
            <tr>
              <td className="pt-3">
                <span className="font-bold">Mã giảm giá</span>
              </td>
              <td className="pt-3 pl-12">
                <input
                  {...register("code", rules.code)}
                  className={`text-center create-voucher-input w-72 ${
                    errors.code ? "error-border" : ""
                  }`}
                  placeholder="Mã giảm giá"
                ></input>
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
                    {...register("serviceId",rules.serviceId)}
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
                      if (
                        selectedServices?.findIndex(
                          (selectedId) => selectedId === service?._id
                        ) === -1
                      )
                        return (
                          <option key={service?._id} value={service?._id}>
                            {service?.name}
                          </option>
                        );
                    })}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Đã chọn:</span>
              </td>
              <td className="pl-[130px]   py-1 ">
                {selectedServices.map((selectedId) => {
                  return (
                    <li className="flex" key={selectedId}>
                      {
                        services[
                          services.findIndex(
                            (service) => service._id === selectedId
                          )
                        ].name
                      }
                      <button
                        className="w-1 ml-1"
                        onClick={() => handleServiceDeselect(selectedId)}
                      >
                        <FaTimes className="w-3 text-red ml-1" />
                      </button>
                    </li>
                  );
                })}
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3 hover:bg-primary_dark"
        >
          Tạo voucher
        </button>
      </form>
    </div>
  );
};
