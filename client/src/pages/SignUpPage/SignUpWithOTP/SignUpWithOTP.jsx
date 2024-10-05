import React from 'react'
import { CgSpinner } from "react-icons/cg";
import { useEffect, useState } from "react";
import { firebase } from "../../../firebase";
import { toast } from "react-hot-toast";
import { getAllAccounts, login, register } from "../../../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { errorStyle, successStyle } from "../../../utils/toast-customize";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";

import axios from "axios";


const SignUpWithOTP = ({ roleSignUp }) => {
    const { accounts, isLoading } = useSelector((state) => state.auth);

    //Phương thức đăng kí bằng OTP 
    const [phoneNumber, setPhoneNumber] = useState("");
    const [hidePhoneNumber, setHidePhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [openPageInputPhoneNumber, setOpenPageInputPhoneNumber] = useState(true);
    const [openPageInputOTP, setOpenPageInputOTP] = useState(false);
    const [openPageInputAccountInformation, setOpenPageInputAccountInformation] = useState(false);
    const [inputOtp, setInputOtp] = useState(Array(6).fill(""));

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    //Hỗ trợ cho nhập địa chỉ của người giúp việc
    const cityUrl = 'https://api.mysupership.vn/v1/partner/areas/province';
    const [cities, setCities] = useState([]);
    const [cityCode, setCityCode] = useState("Thành phố Cần Thơ");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({})

    //Validation 
    const checkExistPhoneAccount = (newPhone) => {
        console.log("Account Data", accounts);
        const listPhones = accounts.map((item) => item.phoneNumber);
        if (listPhones.includes(newPhone)) {
            return true;
        } else {
            return false;
        }
    };

    const checkExistEmailAccount = (newEmail) => {
        const listEmails = accounts.map((item) => item.email);
        if (listEmails.includes(newEmail)) {
            return true;
        } else {
            return false;
        }
    };

    useEffect(() => {
        dispatch(getAllAccounts());
    }, []);

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

    useEffect(() => {
        setupRecaptcha();
    }, []);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = inputOtp.map((d, idx) =>
            idx === index ? element.value : d
        );
        setInputOtp(newOtp);
        setOtp(newOtp.join(""));

        if (element.nextSibling && element.value) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && inputOtp[index] === "" && index > 0) {
            const newOtp = inputOtp.map((d, idx) => (idx === index - 1 ? "" : d));
            setInputOtp(newOtp);
            e.target.previousSibling.focus();
            setOtp(inputOtp.join(""));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setOtp(inputOtp.join(""));
        handleVerifyOTP();
    };

    const handlePhoneNumberChange = (e) => {
        if (isNaN(e.target.value)) return false;
        let input = e.target.value;

        if (!input.startsWith("0") && input.length == 11) {
            toast.error(
                "Vui lòng nhập đúng số điện thoại gồm 9 hoặc 10 chữ số không bao gồm số 0"
            );
            return;
        }

        if (input.startsWith("0") && (input.length == 10 || input.length == 11)) {
            input = input.substring(1);
        }
        setPhoneNumber(input);
    };

    const setupRecaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "sign-in-button",
            {
                size: "invisible",
                defaultCountry: "VN",
            }
        );
    };

    const onSubmitCreateAccount = async () => {
        const accountData = {
            phoneNumber: 0 + phoneNumber,
            password: formData.password,
            role: roleSignUp,
            email: formData.email.trim(),
            address: cityCode,
            name: formData.lastName.trim() + ' ' + formData.firstName.trim(),
        };

        const result = await dispatch(register(accountData));
        if (result.type.endsWith("fulfilled")) {
            toast.success("Đăng Ký Tài Khoản Thành Công !!!!!", successStyle);
            dispatch(login({ phoneNumber: accountData.phoneNumber, password: accountData.password }));
            if (accountData.role == 'Người giúp việc') {
                navigate("/become-helper");
            } else {
                navigate("/home");
            }
        } else if (result?.error?.message === "Rejected") {
            toast.error(result?.payload, errorStyle);
        }
    };


    const handleSendOTP = async () => {
        if (phoneNumber.length < 9) {
            toast.error("Vui lòng nhập số điện thoại có 10 hoặc 11 chữ số !!!");
            return;
        }

        const formattedPhoneNumber = `+84${phoneNumber}`;

        const accountData = {
            phoneNumber: 0 + phoneNumber,
        };

        console.log("Get phone ", accountData.phoneNumber);
        if (checkExistPhoneAccount(accountData.phoneNumber)) {
            toast.error(
                "Số điện thoại này đã đăng kí tài khoản !!! Hãy thử số điện thoại khác",
                errorStyle
            );
            return;
        }

        const appVerify = window.recaptchaVerifier;
        setLoading(true);

        await firebase
            .auth()
            .signInWithPhoneNumber(formattedPhoneNumber, appVerify)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setLoading(false);
                setHidePhoneNumber(
                    `${phoneNumber.slice(0, 2)}*****${phoneNumber.slice(-2)}`
                );
                toast.success("Gửi OTP Thành công!");
                setOpenPageInputPhoneNumber(false)
                setOpenPageInputOTP(true);
                // window.confirmationResult.confirm(testVerificationCode);
            })
            .catch((error) => {
                console.log("ERROR SIGN UP", error);
                toast.error("Gửi OTP Thất bại!");
                setLoading(false);
            });
    };

    const handleVerifyOTP = () => {
        setLoading(true);
        window.confirmationResult
            .confirm(otp)
            .then(() => {
                setOpenPageInputOTP(false)
                setOpenPageInputAccountInformation(true);
                setLoading(false);
                toast.success("Xác thực thành công!!");
            })
            .catch((error) => {
                console.log("ERROR SIGN UP", error);
                toast.error("Xác thực Thất bại!! Kiêm tra lại mã OTP");
                setLoading(false);
            });
    };

    const validations = [
        { field: 'lastName', label: 'Họ', required: true, maxLength: 255, noConsecutiveSpaces: true },
        { field: 'firstName', label: 'Tên', required: true, maxLength: 255, noConsecutiveSpaces: true },
        { field: 'email', label: 'Email', required: true, maxLength: 255, noConsecutiveSpaces: true },
        { field: 'password', label: 'Mật khẩu', required: true },
        { field: 'confirmPassword', label: 'Nhập lại mật khẩu', required: true, maxLength: 255, noConsecutiveSpaces: false }
    ]

    const validateField = (field, value) => {
        const validation = validations.find(v => v.field === field)

        if (!validation) return ''

        const { label, required, maxLength, noConsecutiveSpaces } = validation

        const valueToCheck = value ?? ''

        if (required && !valueToCheck.trim()) {
            return `Vui lòng nhập "${label}"`
        }

        if (noConsecutiveSpaces && /\b {2,}\b/.test(valueToCheck)) {
            return `"${label}" không được chứa khoảng trắng liên tiếp`
        }

        if (maxLength && valueToCheck.length > maxLength) {
            return `"${label}" không được vượt quá ${maxLength} ký tự`
        }

        // Kiểm tra mật khẩu
        if (field === 'password') {
            if (/\s/.test(valueToCheck)) {
                return "Mật khẩu không được chứa khoảng trắng !!!";
            }

            if (!/(?=.*[A-Z])(?=.*\d)/.test(valueToCheck)) {
                return "Mật khẩu phải chứa ít nhất một ký tự in hoa và một số !!!";
            }

            if (valueToCheck.length < 8) {
                return "Mật khẩu phải dài ít nhất 8 ký tự !!!";
            }
        }

        if (field === 'confirmPassword') {
            const password = formData.password;

            if (password && password.trim() !== valueToCheck.trim()) {
                return "Mật khẩu không khớp!";
            }
        }

        if (field === 'email') {
            if (checkExistEmailAccount(valueToCheck)) {
                return "Email đã tồn tại!";
            }
        }

        return ''
    }

    const validateForm = (formData, validations) => {
        const newErrors = {}
        for (const validation of validations) {
            const error = validateField(validation.field, formData[validation.field]?.toString() || '')
            if (error) newErrors[validation.field] = error
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleFormChange = (field, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [field]: value
        }))
        const error = validateField(field, value)
        setErrors({ ...errors, [field]: error })
    }

    const submitCreateAcc = (e) => {
        e.preventDefault();
        console.log(!validateForm(formData, validations))
        console.log("Form Error", errors)

        if (!validateForm(formData, validations)) return;
        onSubmitCreateAccount()
    }


    return (
        <div>
            {/* Button liên quan đến authen bằng OTP */}
            <div id="sign-in-button"></div>
            {/* OTP Bước 1 nhập số điện thoại */}
            {openPageInputPhoneNumber && <div className="select-none">
                <h2 className="text-[25px] font-bold text-center mb-12">
                    Quý khách vui lòng nhập số điện thoại !!!
                </h2>
                <div className="flex items-center justify-center gap-x-3">
                    <span className="py-3 text-[18px]">+84</span>
                    <input
                        maxLength={11}
                        placeholder="Số điện thoại"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className="w-[60%] p-3 text-[18px]"
                    />
                </div>
                <div className="flex items-center justify-center mt-20">
                    <button
                        type="submit"
                        className="w-[500px] mb-10 bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
                        onClick={handleSendOTP}
                    >
                        <span>Xác nhận</span>
                        {loading && (
                            <CgSpinner size={20} className="animate-spin" />
                        )}
                    </button>
                </div>
            </div>}

            {/* OTP Bước 2 nhập mã OTP */}
            {openPageInputOTP &&
                <div className="flex flex-col select-none">
                    <>
                        <div className="flex items-center justify-center">
                            <div className="bg-white rounded-lg ">
                                <h2 className="text-xl font-bold text-center mb-12">
                                    Quý khách vui lòng nhập mã OTP được gửi đến số điện thoại
                                    <br />
                                    {0 + hidePhoneNumber}
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex justify-center mb-6">
                                        {inputOtp.map((data, index) => {
                                            return (
                                                <input
                                                    className="otp-input w-16 h-24 text-center text-[30px] mx-3 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                                    type="text"
                                                    name="otp"
                                                    maxLength="1"
                                                    key={index}
                                                    value={data}
                                                    onChange={(e) => handleChange(e.target, index)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center justify-center mt-20">
                                        <button
                                            type="submit"
                                            className="w-[500px] bg-primary mb-10 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
                                        >
                                            <span>Xác nhận</span>
                                            {loading && (
                                                <CgSpinner size={20} className="animate-spin" />
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                </div>
            }

            {/* OTP Bước 3 nhập mật khẩu */}
            {openPageInputAccountInformation &&
                <div className="select-none">
                    <form onSubmit={submitCreateAcc}>
                        <h2 className="text-[25px] font-bold text-center mb-8">
                            Quý khách vui điền thông tin chi tiết !!!
                        </h2>
                        <div className="flex gap-x-10">
                            <div className="flex flex-col">
                                <div className="text-gray mb-2">Họ</div>
                                <input
                                    className="shadow appearance-none border py-3 px-3 rounded"
                                    value={formData.lastName}
                                    // onChange={(e) => setLastName(e.target.value)}
                                    onChange={e => handleFormChange('lastName', e.target.value)}
                                />
                                <div className='h-4 mb-6'>
                                    {errors.lastName && <div className="text-red mt-2 text-sm px-2">{errors.lastName}</div>}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-gray mb-2">Tên</div>
                                <input
                                    className="shadow appearance-none border py-3 px-3 rounded"
                                    value={formData.firstName}
                                    // onChange={(e) => setFirstName(e.target.value)}
                                    onChange={e => handleFormChange('firstName', e.target.value)}
                                />
                                <div className='h-4'>
                                    {errors.firstName && <div className="text-red mt-2 text-sm px-2">{errors.firstName}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="text-gray mb-2">Nhập địa chỉ email</div>
                            <input
                                className="shadow appearance-none border py-3 px-3 rounded"
                                value={formData.email}
                                // onChange={(e) => setEmail(e.target.value)}
                                onChange={e => handleFormChange('email', e.target.value)}
                            />
                            <div className='h-4 mb-6'>
                                {errors.email && <div className="text-red mt-2 text-sm px-2">{errors.email}</div>}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-gray mb-2">Nhập mật khẩu</div>
                            <div
                                onClick={() => setShowPassword(!showPassword)}
                                className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
                            >
                                {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                                {showPassword ? "Ẩn" : "Hiện"}
                            </div>
                        </div>
                        <div className='flex flex-col'>
                            <input
                                type={`${showPassword ? "text" : "password"}`}
                                className="shadow appearance-none border py-3 px-3 rounded"
                                value={formData.password}
                                // onChange={(e) => setPassword(e.target.value)}
                                onChange={e => handleFormChange('password', e.target.value)}
                            />
                            <div className='h-10'>
                                {errors.password && <div className="text-red mt-2 text-sm px-2">{errors.password}</div>}
                            </div>
                        </div>


                        <div className="flex items-center justify-between">
                            <div className="text-gray mb-2">Nhập lại mật khẩu</div>
                            <div
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
                            >
                                {showConfirmPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                                {showConfirmPassword ? "Ẩn" : "Hiện"}
                            </div>
                        </div>
                        <div className='flex flex-col mb-8'>
                            <input
                                type={`${showConfirmPassword ? "text" : "password"}`}
                                className="shadow appearance-none border py-3 px-3 rounded"
                                value={formData.confirmPassword}
                                // onChange={(e) => setcomfirmPassword(e.target.value)}
                                onChange={e => handleFormChange('confirmPassword', e.target.value)}
                            />
                            <div>
                                {errors.confirmPassword && <div className="text-red mt-2 text-sm px-2">{errors.confirmPassword}</div>}
                            </div>
                        </div>
                        {roleSignUp === "Người giúp việc" && <div>
                            <div className="text-gray mb-2">Tỉnh / Thành phố làm việc</div>
                            <select
                                className="shadow  border py-3 px-3 rounded mb-10"
                                style={{ width: '100%' }}
                                onChange={(e) => setCityCode(e.target.value)}
                            >
                                {/* Truyển thẳng name luôn khỏi đổi qua code, nhớ check lại */}
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
            }
        </div>
    )
}

export default SignUpWithOTP


// import React from 'react'
// import { CgSpinner } from "react-icons/cg";
// import { useEffect, useState } from "react";
// import { firebase } from "../../../firebase";
// import { toast } from "react-hot-toast";
// import { getAllAccounts, login, register } from "../../../features/auth/authSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { errorStyle, successStyle } from "../../../utils/toast-customize";
// import { useNavigate } from "react-router-dom";
// import { IoEyeOutline } from "react-icons/io5";
// import { FaRegEyeSlash } from "react-icons/fa";

// import axios from "axios";


// const SignUpWithOTP = ({ roleSignUp }) => {
//     const { accounts, isLoading } = useSelector((state) => state.auth);

//     //Phương thức đăng kí bằng OTP 
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [hidePhoneNumber, setHidePhoneNumber] = useState("");
//     const [otp, setOtp] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [openPageInputPhoneNumber, setOpenPageInputPhoneNumber] = useState(true);
//     const [openPageInputOTP, setOpenPageInputOTP] = useState(false);
//     const [openPageInputAccountInformation, setOpenPageInputAccountInformation] = useState(false);
//     const [inputOtp, setInputOtp] = useState(Array(6).fill(""));

//     //Nhập password của trang login bằng OTP
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setcomfirmPassword] = useState("");

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//     //Hỗ trợ cho nhập địa chỉ của người giúp việc
//     const cityUrl = 'https://api.mysupership.vn/v1/partner/areas/province';
//     const [cities, setCities] = useState([]);
//     const [cityCode, setCityCode] = useState("Thành phố Đà Nẵng");

//     //Nhập thông tin nói chung của 1 account bất kể phương thức đăng kí nào
//     const [firstName, setFirstName] = useState("")
//     const [lastName, setLastName] = useState("")
//     const [email, setEmail] = useState("")


//     const dispatch = useDispatch();
//     const navigate = useNavigate();


//     //Validation 
//     const checkExistPhoneAccount = (newPhone) => {
//         console.log("Account Data", accounts);
//         const listPhones = accounts.map((item) => item.phoneNumber);
//         if (listPhones.includes(newPhone)) {
//             return true;
//         } else {
//             return false;
//         }
//     };

//     const checkExistEmailAccount = (newEmail) => {
//         const listEmails = accounts.map((item) => item.email);
//         if (listEmails.includes(newEmail)) {
//             return true;
//         } else {
//             return false;
//         }
//     };

//     useEffect(() => {
//         dispatch(getAllAccounts());
//     }, []);

//     useEffect(() => {
//         axios
//             .get(cityUrl, {
//                 headers: {
//                     Accept: 'application/json',
//                     'Content-Type': 'application/json;charset=UTF-8',
//                 },
//             })
//             .then(({ data }) => {
//                 setCities(data.results);
//                 setLoading(false);
//             })
//     }, []);

//     useEffect(() => {
//         setupRecaptcha();
//     }, []);

//     const handleChange = (element, index) => {
//         if (isNaN(element.value)) return false;

//         const newOtp = inputOtp.map((d, idx) =>
//             idx === index ? element.value : d
//         );
//         setInputOtp(newOtp);
//         setOtp(newOtp.join(""));

//         if (element.nextSibling && element.value) {
//             element.nextSibling.focus();
//         }
//     };

//     const handleKeyDown = (e, index) => {
//         if (e.key === "Backspace" && inputOtp[index] === "" && index > 0) {
//             const newOtp = inputOtp.map((d, idx) => (idx === index - 1 ? "" : d));
//             setInputOtp(newOtp);
//             e.target.previousSibling.focus();
//             setOtp(inputOtp.join(""));
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setOtp(inputOtp.join(""));
//         handleVerifyOTP();
//     };

//     const handlePhoneNumberChange = (e) => {
//         if (isNaN(e.target.value)) return false;
//         let input = e.target.value;

//         if (!input.startsWith("0") && input.length == 11) {
//             toast.error(
//                 "Vui lòng nhập đúng số điện thoại gồm 9 hoặc 10 chữ số không bao gồm số 0"
//             );
//             return;
//         }

//         if (input.startsWith("0") && (input.length == 10 || input.length == 11)) {
//             input = input.substring(1);
//         }
//         setPhoneNumber(input);
//     };

//     const handleCheckPassword = (e) => {
//         e.preventDefault();

//         if (/\s/.test(password)) {
//             toast.error("Mật khẩu không được chứa khoảng trắng !!!");
//             return;
//         }

//         if (!/(?=.*[A-Z])(?=.*\d)/.test(password)) {
//             toast.error("Mật khẩu phải chứa ít nhất một ký tự in hoa và một số !!!");
//             return;
//         }

//         if (password.length < 8) {
//             toast.error("Mật khẩu phải dài ít nhất 8 ký tự !!!");
//             return;
//         }

//         if (password.trim() !== confirmPassword.trim()) {
//             toast.error("Mật khẩu không khớp!");
//             return;
//         }

//         // toast.success("Mật khẩu hợp lệ");
//         onSubmitCreateAccount();
//     };

//     const setupRecaptcha = () => {
//         window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//             "sign-in-button",
//             {
//                 size: "invisible",
//                 defaultCountry: "VN",
//             }
//         );
//     };

//     const onSubmitCreateAccount = async () => {
//         if (!email) {
//             toast.error("Vui lòng điền email !")
//             return
//         }

//         if (checkExistEmailAccount(email)) {
//             toast.error("Mail đã tồn tại hãy thử mail khác !")
//             return
//         }

//         if (!lastName.trim()) {
//             toast.error("Họ không được để trống !")
//             return
//         }

//         // Kiểm tra nếu firstName rỗng
//         if (!firstName.trim()) {
//             toast.error("Tên không được để trống !")
//             return
//         }

//         const accountData = {
//             phoneNumber: 0 + phoneNumber,
//             password: password,
//             role: roleSignUp,
//             email: email,
//             address: cityCode,
//             name: lastName.trim() + ' ' + firstName.trim()
//         };

//         const result = await dispatch(register(accountData));
//         if (result.type.endsWith("fulfilled")) {
//             toast.success("Đăng Ký Tài Khoản Thành Công !!!!!", successStyle);
//             dispatch(login({ phoneNumber: accountData.phoneNumber, password: accountData.password }));
//             if (accountData.role == 'Người giúp việc') {
//                 navigate("/become-helper");
//             } else {
//                 navigate("/home");
//             }
//         } else if (result?.error?.message === "Rejected") {
//             toast.error(result?.payload, errorStyle);
//         }
//     };


//     const handleSendOTP = async () => {
//         if (phoneNumber.length < 9) {
//             toast.error("Vui lòng nhập số điện thoại có 10 hoặc 11 chữ số !!!");
//             return;
//         }

//         const formattedPhoneNumber = `+84${phoneNumber}`;

//         const accountData = {
//             phoneNumber: 0 + phoneNumber,
//         };

//         console.log("Get phone ", accountData.phoneNumber);
//         if (checkExistPhoneAccount(accountData.phoneNumber)) {
//             toast.error(
//                 "Số điện thoại này đã đăng kí tài khoản !!! Hãy thử số điện thoại khác",
//                 errorStyle
//             );
//             return;
//         }

//         const appVerify = window.recaptchaVerifier;
//         setLoading(true);

//         await firebase
//             .auth()
//             .signInWithPhoneNumber(formattedPhoneNumber, appVerify)
//             .then((confirmationResult) => {
//                 window.confirmationResult = confirmationResult;
//                 setLoading(false);
//                 setHidePhoneNumber(
//                     `${phoneNumber.slice(0, 2)}*****${phoneNumber.slice(-2)}`
//                 );
//                 toast.success("Gửi OTP Thành công!");
//                 setOpenPageInputPhoneNumber(false)
//                 setOpenPageInputOTP(true);
//                 // window.confirmationResult.confirm(testVerificationCode);
//             })
//             .catch((error) => {
//                 console.log("ERROR SIGN UP", error);
//                 toast.error("Gửi OTP Thất bại!");
//                 setLoading(false);
//             });
//     };

//     const handleVerifyOTP = () => {
//         setLoading(true);
//         window.confirmationResult
//             .confirm(otp)
//             .then(() => {
//                 setOpenPageInputOTP(false)
//                 setOpenPageInputAccountInformation(true);
//                 setLoading(false);
//                 toast.success("Xác thực thành công!!");
//             })
//             .catch((error) => {
//                 console.log("ERROR SIGN UP", error);
//                 toast.error("Xác thực Thất bại!! Kiêm tra lại mã OTP");
//                 setLoading(false);
//             });
//     };

//     return (
//         <div>
//             {/* Button liên quan đến authen bằng OTP */}
//             <div id="sign-in-button"></div>
//             {/* OTP Bước 1 nhập số điện thoại */}
//             {openPageInputPhoneNumber && <div className="select-none">
//                 <h2 className="text-[25px] font-bold text-center mb-12">
//                     Quý khách vui lòng nhập số điện thoại !!!
//                 </h2>
//                 <div className="flex items-center justify-center gap-x-3">
//                     <span className="py-3 text-[18px]">+84</span>
//                     <input
//                         maxLength={11}
//                         placeholder="Số điện thoại"
//                         value={phoneNumber}
//                         onChange={handlePhoneNumberChange}
//                         className="w-[60%] p-3 text-[18px]"
//                     />
//                 </div>
//                 <div className="flex items-center justify-center mt-20">
//                     <button
//                         type="submit"
//                         className="w-[500px] mb-10 bg-primary text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
//                         onClick={handleSendOTP}
//                     >
//                         <span>Xác nhận</span>
//                         {loading && (
//                             <CgSpinner size={20} className="animate-spin" />
//                         )}
//                     </button>
//                 </div>
//             </div>}

//             {/* OTP Bước 2 nhập mã OTP */}
//             {openPageInputOTP &&
//                 <div className="flex flex-col select-none">
//                     <>
//                         <div className="flex items-center justify-center">
//                             <div className="bg-white rounded-lg ">
//                                 <h2 className="text-xl font-bold text-center mb-12">
//                                     Quý khách vui lòng nhập mã OTP được gửi đến số điện thoại
//                                     <br />
//                                     {0 + hidePhoneNumber}
//                                 </h2>
//                                 <form onSubmit={handleSubmit}>
//                                     <div className="flex justify-center mb-6">
//                                         {inputOtp.map((data, index) => {
//                                             return (
//                                                 <input
//                                                     className="otp-input w-16 h-24 text-center text-[30px] mx-3 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-primary"
//                                                     type="text"
//                                                     name="otp"
//                                                     maxLength="1"
//                                                     key={index}
//                                                     value={data}
//                                                     onChange={(e) => handleChange(e.target, index)}
//                                                     onKeyDown={(e) => handleKeyDown(e, index)}
//                                                 />
//                                             );
//                                         })}
//                                     </div>
//                                     <div className="flex items-center justify-center mt-20">
//                                         <button
//                                             type="submit"
//                                             className="w-[500px] bg-primary mb-10 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
//                                         >
//                                             <span>Xác nhận</span>
//                                             {loading && (
//                                                 <CgSpinner size={20} className="animate-spin" />
//                                             )}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                     </>
//                 </div>
//             }

//             {/* OTP Bước 3 nhập mật khẩu */}
//             {openPageInputAccountInformation &&
//                 <div className="select-none">
//                     <form onSubmit={handleCheckPassword}>
//                         <h2 className="text-[25px] font-bold text-center mb-8">
//                             Quý khách vui điền thông tin chi tiết !!!
//                         </h2>
//                         <div className="flex gap-x-10 mb-8">
//                             <div className="flex flex-col">
//                                 <div className="text-gray mb-2">Họ</div>
//                                 <input
//                                     className="shadow appearance-none border py-3 px-3 rounded"
//                                     value={lastName}
//                                     onChange={(e) => setLastName(e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex flex-col">
//                                 <div className="text-gray mb-2">Tên</div>
//                                 <input
//                                     className="shadow appearance-none border py-3 px-3 rounded"
//                                     value={firstName}
//                                     onChange={(e) => setFirstName(e.target.value)}
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center justify-between">
//                             <div className="text-gray mb-2">Nhập địa chỉ email</div>
//                         </div>
//                         <input
//                             className="shadow appearance-none border py-3 px-3 rounded mb-8"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />

//                         <div className="flex items-center justify-between">
//                             <div className="text-gray mb-2">Nhập mật khẩu</div>
//                             <div
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
//                             >
//                                 {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
//                                 {showPassword ? "Ẩn" : "Hiện"}
//                             </div>
//                         </div>
//                         <input
//                             type={`${showPassword ? "text" : "password"}`}
//                             className="shadow appearance-none border py-3 px-3 rounded mb-8"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />

//                         <div className="flex items-center justify-between">
//                             <div className="text-gray mb-2">Nhập lại mật khẩu</div>
//                             <div
//                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                 className="flex items-center mb-2 gap-x-2 text-gray cursor-pointer"
//                             >
//                                 {showConfirmPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
//                                 {showConfirmPassword ? "Ẩn" : "Hiện"}
//                             </div>
//                         </div>
//                         <input
//                             type={`${showConfirmPassword ? "text" : "password"}`}
//                             className="shadow appearance-none border py-3 px-3 rounded mb-8"
//                             value={confirmPassword}
//                             onChange={(e) => setcomfirmPassword(e.target.value)}
//                         />

//                         {roleSignUp === "Người giúp việc" && <div>
//                             <div className="text-gray mb-2">Tỉnh / Thành phố làm việc</div>
//                             <select
//                                 className="shadow  border py-3 px-3 rounded mb-10"
//                                 style={{ width: '100%' }}
//                                 onChange={(e) => setCityCode(e.target.value)}
//                             >
//                                 {/* Truyển thẳng name luôn khỏi đổi qua code, nhớ check lại */}
//                                 {cities?.map((city) => <option value={city.name}>{city.name}</option>)}
//                             </select>
//                         </div>}

//                         <button
//                             type="submit"
//                             className="w-full bg-primary mb-10 text-white py-3 rounded-full hover:bg-blue-600 transition duration-300 font-bold flex justify-center items-center"
//                         >
//                             <span>Xác nhận</span>
//                             {loading && <CgSpinner size={20} className="animate-spin" />}
//                         </button>
//                     </form>
//                 </div>
//             }
//         </div>
//     )
// }

// export default SignUpWithOTP