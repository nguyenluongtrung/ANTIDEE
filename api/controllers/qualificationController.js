const asyncHandler = require("express-async-handler");
const Qualification = require("../models/qualificationModel");

const createQualification = asyncHandler(async (req, res) => {

  const qualification = await Qualification.create(req.body);
  
  res.status(201).json({
    status: "success",
    data: {
      qualification,
    },
  });
});

const getAllQualifications = asyncHandler(async (req, res) => {
  const qualifications = await Qualification.find({});

  res.status(200).json({
    status: "success",
    data: {
      qualifications,
    },
  });
});
const getQualification = asyncHandler(async (req, res) => {
  const qualification = await Qualification.findById(req.params.qualificationId);

  if (!qualification) {
    res.status(404);
    throw new Error("Không tìm thấy bằng cấp");
  }

  res.status(200).json({
    status: "success",
    data: {
      qualification,
    },
  });
});

const deleteQualification = asyncHandler(async (req, res) => {
  const qualification = await Qualification.findById(req.params.qualificationId);

  if (!qualification) {
    res.status(404);
    throw new Error("Không tìm thấy bằng cấp");
  }

  await Qualification.findByIdAndDelete(req.params.qualificationId);

  res.status(200).json({
    status: "success",
    data: {id: req.params.qualificationId}
  });
});

const updateQualification = asyncHandler(async (req, res) => {
  const qualification = await Qualification.findById(req.params.qualificationId);

  if (!qualification) {
    res.status(404);
    throw new Error("Không tìm thấy câu hỏi");
  }

  const updatedQualification = await Qualification.findByIdAndUpdate(
    req.params.qualificationId,
    req.body,
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      updatedQualification,
    },
  });
});

module.exports = {
  updateQualification,
  deleteQualification,
  getQualification,
  getAllQualifications,
  createQualification,
};
