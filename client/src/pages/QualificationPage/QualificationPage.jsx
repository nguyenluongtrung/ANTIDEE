import React from "react";
import "./QualificationPage.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../../components";
import { getAllQualifications } from "../../features/qualifications/qualificationSlice";

export const QualificationPage = () => {
  const qualificationImg =
    "https://cdn-icons-png.freepik.com/512/7238/7238706.png";

  const { qualifications, isLoading } = useSelector(
    (state) => state.qualifications
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQualifications());
  }, []);

  //Get All Qualification
  const handleGetAllQualifications = () => {
    Promise.all([dispatch(getAllQualifications())]).catch((error) => {
      console.error("Error during dispatch:", error);
    });
  };

  console.log("List Qualificate", qualifications);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="w-full">
        <div className="flex justify-center items-center pb-4">
          <p className="font-semibold text-[35px]">Các chứng chỉ</p>
        </div>
        <div className="flex flex-wrap justify-center items-center">
          {qualifications?.map((qualificate, index) => (
            <div
              key={index}
              className="w-80 m-4 transition duration-300 ease-in-out transform hover:scale-110 border-gray-300 shadow-2xl rounded-[15px] hover:cursor-pointer"
            >
              <div className="p-4 w-full flex flex-col justify-center items-center">
                <p className="text-primary text-lg font-bold opacity-80 mt-1 ">
                  {qualificate.name}
                </p>
                <img
                  src={qualificationImg}
                  alt={qualificate.description}
                  className="w-[175px] h-auto object-cover rounded-lg "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
