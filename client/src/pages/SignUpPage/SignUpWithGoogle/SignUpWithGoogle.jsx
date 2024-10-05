import React from 'react'
import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { loginWithGoogle, register } from "../../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const SignUpWithGoogle = ({ roleSignUp, googleAccount }) => {
    const { accounts, isLoading } = useSelector((state) => state.auth);

    //Phương thức đăng kí bằng OTP 
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);

    //Hỗ trợ cho nhập địa chỉ của người giúp việc
    const cityUrl = 'https://api.mysupership.vn/v1/partner/areas/province';
    const [cities, setCities] = useState([]);
    const [cityCode, setCityCode] = useState("Thành phố Đà Nẵng");

    //Nhập thông tin nói chung của 1 account bất kể phương thức đăng kí nào
    const [email, setEmail] = useState(googleAccount.email)
    const [fullName, setFullName] = useState(googleAccount.displayName)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(cityUrl, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
            })
            .then(({ data }) => {
                setCities(data.results);
                setLoading(false);
            })
    }, []);

    const checkExistPhoneAccount = (newPhone) => {
        console.log("Account Data", accounts);
        const listPhones = accounts.map((item) => item.phoneNumber);
        if (listPhones.includes(newPhone)) {
            return true;
        } else {
            return false;
        }
    };

    //Submit bằng google
    const onSubmitCreateAccountWithGoogle = async () => {
        if (checkExistPhoneAccount(phoneNumber)) {
            toast.error("Số điện thoại này đã đăng kí tài khoản !!! Hãy thử số điện thoại khác");
            return;
        }

        const accountData = {
            phoneNumber: phoneNumber,
            role: roleSignUp,
            email: email,
            address: cityCode,
            name: fullName,
        };

        const result = await dispatch(register(accountData));
        if (result.type.endsWith("fulfilled")) {
            toast.success("Đăng Ký Tài Khoản Thành Công !!!!!", successStyle);
            dispatch(loginWithGoogle({ email: accountData.email }));
            if (accountData.role == 'Người giúp việc') {
                navigate("/become-helper");
            } else {
                navigate("/home");
            }
        } else if (result?.error?.message === "Rejected") {
            toast.error(result?.payload, errorStyle);
        }
    };

    const handleCheckGoogle = (e) => {
        e.preventDefault();
        onSubmitCreateAccountWithGoogle()
    }


    return (
        <div>
            <div className="select-none">
                <form onSubmit={handleCheckGoogle}>
                    <h2 className="text-[25px] font-bold text-center mb-8">
                        Quý khách vui điền thông tin chi tiết !!!
                    </h2>
                    {/* <div className="flex flex-col items-center justify-center mb-8">
                        <div className="text-gray mb-2">Ảnh cá nhân</div>
                        <img src={googleAccount.photoURL} className="w-28 h-auto object-cover" />
                    </div> */}

                    <div className="flex flex-col mb-8">
                        <div className="text-gray mb-2">Họ và tên</div>
                        <input
                            className="shadow appearance-none border py-3 px-3 rounded cursor-not-allowed"
                            value={googleAccount.displayName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-gray mb-2">Địa chỉ email</div>
                    </div>
                    <input
                        className="shadow appearance-none border py-3 px-3 rounded mb-8 cursor-not-allowed"
                        value={googleAccount.email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled
                    />

                    <div className="flex items-center justify-between">
                        <div className="text-gray mb-2">Số điện thoại</div>
                    </div>
                    <input
                        type="number"
                        className="shadow appearance-none border py-3 px-3 rounded mb-8"
                        value={googleAccount.phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    {roleSignUp === "Người giúp việc" && <div>
                        <div className="text-gray mb-2">Tỉnh / Thành phố làm việc</div>
                        <select
                            className="shadow  border py-3 px-3 rounded mb-10"
                            style={{ width: '100%' }}
                            onChange={(e) => setCityCode(e.target.value)}
                        >
                            {cities?.map((city) => <option value={city.name}>{city.name}</option>)}
                        </select>
                    </div>}

                    <button
                        type="submit"
                        className="w-full bg-primary mb-10 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
                    >
                        <span>Xác nhận</span>
                        {loading && <CgSpinner size={20} className="animate-spin" />}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default SignUpWithGoogle