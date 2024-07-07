import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const createApplication = asyncHandler(async (req, res) => {
  const { id: jobId } = req.params; 
  const applicant = req.user._id;

  console.log(jobId,applicant)

  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  const existingApplication = await Application.findOne({ job: jobId, applicant });
  if (existingApplication) {
    throw new ApiError(409, "You have already applied for this job");
  }

  const application = await Application.create({ job: jobId, applicant });

  return res.status(201).json(new ApiResponse(201, application, "Application created successfully"));
});

const getAllApplicationsForJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;
  
    const job = await Job.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
  
    const applications = await Application.find({ job: jobId }).populate("applicant").select("-__v");
  
    if (applications.length === 0) {
      return res.status(200).json(new ApiResponse(200, [], "No applications found for this job"));
    }
  
    return res.status(200).json(new ApiResponse(200, applications, "Applications for job fetched successfully"));
  });

const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ applicant: req.user._id }).populate("job").select("-__v");

  if (applications.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No applications found for this user"));
  }

  return res.status(200).json(new ApiResponse(200, applications, "User applications fetched successfully"));
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { id : applicationId } = req.params;
    const { status } = req.body;
  
    if (!["applied", "interviewing", "offered", "rejected"].includes(status)) {
      throw new ApiError(400, "Invalid status value");
    }
  
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );
  
    if (!application) {
      throw new ApiError(404, "Application not found");
    }
  
    return res.status(200).json(new ApiResponse(200, application, "Application status updated successfully"));
  });
  

const deleteApplication = asyncHandler(async (req, res) => {
  const { id : applicationId } = req.params;

  const application = await Application.findByIdAndDelete(applicationId);
  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return res.status(200).json(new ApiResponse(200, null, "Application deleted successfully"));
});

export {
  createApplication,
  getAllApplicationsForJob,
  getUserApplications,
  updateApplicationStatus,
  deleteApplication,
};