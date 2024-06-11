import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '../../../../components';
import toast from 'react-hot-toast';
import { errorStyle, successStyle } from '../../../../utils/toast-customize';
import { AiOutlineClose } from 'react-icons/ai';
import './UpdatePromotion.css';
import { updatePromotion } from '../../../../features/promotions/promotionSlice';
import { useEffect, useState } from 'react';
import { getAllServices } from '../../../../features/services/serviceSlice';
import { formatDateInput } from '../../../../utils/format';
import { FaTimes } from 'react-icons/fa';

export const UpdatePromotion = ({ setIsOpenUpdatePromotion, chosenPromotionId, handleGetAllPromotions }) => {
  const { promotions, isLoading: promotionLoading } = useSelector((state) => state.promotions || { promotions: [], isLoading: false });
  const { services, isLoading: serviceLoading } = useSelector((state) => state.services || { services: [], isLoading: false });
  const [selectedServices, setSelectedServices] = useState([]);
  const [chosenPromotion, setChosenPromotion] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  useEffect(() => {
    if (!promotionLoading && promotions.length > 0) {
      const foundPromotion = promotions.find(promotion => promotion._id === chosenPromotionId);
      if (foundPromotion) {
        setChosenPromotion(foundPromotion);
        setSelectedServices(foundPromotion.serviceIds || []);
        reset({
          promotionName: foundPromotion.promotionName,
          startDate: formatDateInput(foundPromotion.startDate),
          endDate: formatDateInput(foundPromotion.endDate),
          promotionCode: foundPromotion.promotionCode,
          promotionValue: foundPromotion.promotionValue,
          promotionQuantity: foundPromotion.promotionQuantity,
        });
      }
    }
  }, [promotions, promotionLoading, chosenPromotionId, reset]);

  const checkForDuplicateIds = (selectedServices) => {
    const idCount = selectedServices.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    return Object.values(idCount).some(count => count > 1);
  };

  const onSubmit = async (data) => {
    const isNameValid = validatePromotionName(data.promotionName);
    if (!isNameValid) return;

    if (checkForDuplicateIds(selectedServices)) {
      toast.error('Có dịch vụ bị trùng lặp trong danh sách đã chọn', errorStyle);
      return;
    }

    const uniqueServiceIds = Array.from(new Set(selectedServices));

    const promotionData = {
      ...data,
      serviceIds: uniqueServiceIds,
    };

    const result = await dispatch(updatePromotion({ promotionData, id: chosenPromotionId }));
    if (result.type.endsWith('fulfilled')) {
      toast.success('Cập nhật mã khuyến mãi thành công', successStyle);
    } else if (result?.error?.message === 'Rejected') {
      toast.error(result?.payload, errorStyle);
    }
    setIsOpenUpdatePromotion(false);
    handleGetAllPromotions();
  };

  const validatePromotionName = (name) => {
    const trimmedName = name.trim().toLowerCase();
    const existingPromotion = promotions.find(
      (promo) =>
        promo.promotionName.trim().toLowerCase() === trimmedName &&
        new Date(promo.endDate) >= new Date() &&
        promo._id !== chosenPromotionId
    );
    if (existingPromotion) {
      setError('promotionName', {
        type: 'manual',
        message: 'Tên mã giảm giá đã tồn tại và còn hạn sử dụng',
      });
      return false;
    }
    clearErrors('promotionName');
    return true;
  };

  const handleServiceDeselect = (serviceId) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.filter((service) => service !== serviceId)
    );
  };

  const handleServiceSelect = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    const uniqueNewSelectedServices = [...new Set([...selectedServices, ...selectedOptions])];
    setSelectedServices(uniqueNewSelectedServices);
  };

  if (promotionLoading || serviceLoading) {
    return <Spinner />;
  }

  if (!services || !chosenPromotion) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className="popup active">
      <div className="overlay"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="content rounded-md p-5"
        style={{ width: '35vw' }}
      >
        <AiOutlineClose
          className="absolute text-sm hover:cursor-pointer"
          onClick={() => setIsOpenUpdatePromotion(false)}
        />
        <p className="grid text-green font-bold text-xl justify-center">
          CẬP NHẬT KHUYẾN MÃI
        </p>
        <table className="mt-3">
          <tbody>
            <tr>
              <td><span className='font-bold'>Tên ưu đãi</span><span className="text-red"> * </span></td>
              <td>
                <input
                  type="text"
                  {...register('promotionName')}
                  className="create-question-input text-center ml-[60px] text-sm w-[300px]"
                  placeholder="Nhập tên của khuyến mãi"
                  required
                />
                {errors.promotionName && <p className="text-red text-center">{errors.promotionName.message}</p>}
              </td>
            </tr>
            <tr>
              <td>
                {' '}
                <span className='font-bold'>Ngày bắt đầu</span><span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="date"
                  {...register('startDate')}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className='create-question-input text-center ml-[60px] text-sm w-[300px]'
                />{' '}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Ngày kết thúc</span><span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="date"
                  {...register('endDate')}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className='create-question-input text-center ml-[60px] text-sm w-[300px]'
                />{' '}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Mã giảm giá</span><span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="text"
                  {...register('promotionCode')}
                  placeholder="Nhập mã giảm giá"
                  required
                  className='create-question-input text-center ml-[60px] text-sm w-[300px]'
                />
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Giá trị của mã</span><span className="text-red"> * </span>
              </td>
              <td>
                <input
                  type="text"
                  {...register('promotionValue', { required: 'Giá trị mã là bắt buộc', min: { value: 0, message: 'Giá trị mã phải lớn hơn 0' }, max: { value: 1, message: 'Giá trị mã phải nhỏ hơn hoặc bằng 1' } })}
                  placeholder="Nhập giá trị giảm giá"
                  className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${errors.promotionValue ? 'border-red' : ''}`}
                />
                {errors.promotionValue && <p className="text-red text-center">{errors.promotionValue.message}</p>}
              </td>
            </tr>
            <tr>
              <td>
                <span className="font-bold">Số lượng mã</span><span className="text-red"> * </span>
              </td>
              <td className="">
                <input
                  type="number"
                  {...register('promotionQuantity', { required: 'Số lượng mã là bắt buộc', min: { value: 1, message: 'Số lượng mã phải lớn hơn 0' }, pattern: { value: /^[1-9]\d*$/, message: 'Số lượng mã phải là số nguyên dương' } })}
                  placeholder="Nhập số lượng mã"
                  className={`create-question-input text-center ml-[60px] text-sm w-[300px] ${errors.promotionQuantity ? 'border-red' : ''}`}
                />
                {errors.promotionQuantity && <p className="text-red text-center">{errors.promotionQuantity.message}</p>}
              </td>
            </tr>
            <tr>
              <td>
                <span className='font-bold'>Lựa chọn dịch vụ</span>
              </td>
              <td className="">
                <div className="input-box">
                  <select
                    className='create-question-input text-center ml-[60px] text-sm w-[300px]'
                    size={6}
                    {...register('serviceIds')}
                    multiple
                    onChange={handleServiceSelect}
                  >
                    {services
                      ?.filter(service => !selectedServices.includes(service._id))
                      .map(service => (
                        <option key={service._id} value={service._id}>
                          {service.name}
                        </option>
                      ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <span className='font-bold'>Đã chọn:</span>
              </td>
              <td className="">
                <ul>
                  {selectedServices.map(selectedId => {
                    const service = services.find(service => String(service._id) === String(selectedId)); 
                    return (
                      <li className='flex items-center' key={selectedId}>
                        {service && service.name ? service.name : (selectedId ? selectedId.name : 'Loading...')}
                        <button
                          type="button"
                          className="ml-2 text-red"
                          onClick={() => handleServiceDeselect(selectedId)}
                        >
                          <FaTimes />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="block bg-primary text-white text-center rounded-md p-2 font-medium mb-1 mt-3"
        >
          Cập nhật khuyến mãi
        </button>
      </form>
    </div>
  );
};
