import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { FaMoneyBillWave } from "react-icons/fa";
import { getAccountSalary } from "./../../../features/auth/authSlice";
import MonthlySalaryChart from "./component/MonthlySalaryChart/MonthlySalaryChart";
import QuarterlySalaryChart from "./component/QuaterlySalaryChart/QuarterlySalaryChart";

export const AccountSalary = () => {
  const dispatch = useDispatch();
  const [account, setAccount] = useState();
  const [monthlySalary, setMonthlySalary] = useState([]);
  const [quarterlySalary, setQuarterlySalary] = useState([]);
  const [totalYearSalary, setTotalYearSalary] = useState(0);
  const [totalMonthSalary, setTotalMonthSalary] = useState(0);

  const initiateAccountSalary = async () => {
    const response = await dispatch(getAccountSalary());
    const salaryData = response.payload;

    if (salaryData) {
      setMonthlySalary(salaryData);
      const quarterly = [
        salaryData.slice(0, 3).reduce((a, b) => a + b, 0),
        salaryData.slice(3, 6).reduce((a, b) => a + b, 0),
        salaryData.slice(6, 9).reduce((a, b) => a + b, 0),
        salaryData.slice(9, 12).reduce((a, b) => a + b, 0),
      ];
      setQuarterlySalary(quarterly);

      const totalYearSalary = salaryData.reduce((a, b) => a + b, 0);
      setTotalYearSalary(totalYearSalary);

      const currentMonth = new Date().getMonth();
      const totalMonthSalary = salaryData[currentMonth] || 0;
      setTotalMonthSalary(totalMonthSalary);
    }
  };

  useEffect(() => {
    initiateAccountSalary();
  }, []);

  return (
    <div className="flex flex-col md:flex-row px-4 md:px-16 pt-10 md:pt-20">
      <div className="md:pr-24 pt-3 md:w-1/4 w-full">
        <Sidebar account={account} />
      </div>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-green">
          NĂM NAY BẠN ĐÃ BỎ TÚI ĐƯỢC BAO NHIÊU TIỀN?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-center mx-auto">
       
          <div
            className="rounded-lg p-5 shadow-lg mx-auto"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,244,222,1) 0%, rgba(255,205,107,1) 100%)",
            }}
          >
            <div className="rounded-full p-4 mb-4 bg-yellow shadow-md inline-block">
              <FaMoneyBillWave color="white" size={24} />
            </div>
            <p className="font-bold text-3xl mb-2 text-black md:text-4xl">
              {totalMonthSalary.toLocaleString()} VND
            </p>
            <h2 className="text-black font-semibold">Tổng lương trong tháng</h2>
          </div>
          <div
            className="rounded-lg p-5 shadow-lg mx-auto"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,226,230,1) 0%, rgba(245,134,154,1) 100%)",
            }}
          >
            <div className="rounded-full p-4 mb-4 bg-red shadow-md inline-block">
              <FaMoneyBillWave color="white" size={24} />
            </div>
            <p className="font-bold text-3xl mb-2 text-black md:text-4xl">
              {totalYearSalary.toLocaleString()} VND
            </p>
            <h2 className="text-black font-semibold">Tổng lương năm</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-white shadow-lg rounded-lg" style={{ height: "450px" }}>
            <h2 className="text-xl font-semibold text-center mb-4 text-black">
              LƯƠNG THEO THÁNG
            </h2>
            <MonthlySalaryChart monthlySalary={monthlySalary} height={500} />
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg" style={{ height: "450px" }}>
            <h2 className="text-xl font-semibold text-center mb-4 text-black">
              LƯƠNG THEO QUÝ
            </h2>
            <QuarterlySalaryChart
              quarterlySalary={quarterlySalary}
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
};