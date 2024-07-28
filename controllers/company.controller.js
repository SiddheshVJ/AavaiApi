import { Logo, Job, Contact, Service, Project, Gallery } from "../models/company.model"
import { cloudinaryUploadImg, cloudinaryDeleteImg } from '../utils/cloudinary'
import asyncHandler from "express-async-handler"
import fs from "fs"
import createHttpError from "http-errors"

// ! Upload and update logo
export const uploadCompanyLogo = asyncHandler(async (req, res) => {
    try {
        // Retrieve existing logo data from the database
        const existingLogo = await Logo.findOne();

        if (existingLogo) {
            // Extract the public ID from the existing logo URL for deletion
            const publicId = existingLogo.logoUrl.split('/').pop().split('.')[0];

            // Delete the old logo from Cloudinary
            await cloudinaryDeleteImg(`CompanyLogo/${publicId}`);
        }

        // Get the uploaded file from the request
        let logo = req.file;
        const path = logo.path;

        // Upload the new logo to the "CompanyLogo" folder in Cloudinary
        const savedLogo = await cloudinaryUploadImg(path);
        console.log(savedLogo)
        // Remove the local file after upload
        fs.unlinkSync(path);

        // Save the new logo URL in the database
        if (existingLogo) {
            existingLogo.logoUrl = savedLogo.url;
            await existingLogo.save();
        } else {
            const newLogo = new Logo({ logoUrl: savedLogo.url });
            await newLogo.save();
        }

        // Respond with the new logo URL
        res.status(200).json({ message: 'Logo uploaded successfully', url: savedLogo.url });
    } catch (err) {
        res.status(500).json({ message: 'Error uploading logo', error: err.message });
    }
});

//! Job Page Get all jobs, get job by ID, Add new job ,Update job, delete job 
export const newJobPost = asyncHandler(async (req, res) => {
    try {
        let { title, description, location } = req.body
        let jobExists = await Job.findOne({ title, description, location })
        if (jobExists) throw createHttpError.Conflict('Similar type of job is already present')
        const newJob = new Job(req.body);
        await newJob.save();

        const allJobs = await Job.find()

        res.status(200).json({ message: 'New job posted successfully', jobs: allJobs });

    } catch (err) {
        res.status(500).json({ message: 'Error Posting new job', error: err.message });
    }
})

export const updateJob = asyncHandler(async (req, res) => {
    let jobId = req.params.id
    let jobData = req.body
    try {
        let jobExists = await Job.findById({ _id: jobId })

        if (!jobExists) throw createHttpError.NotFound('Job not found')

        // Update the job with new data
        const updatedJob = await Job.findByIdAndUpdate(jobId, jobData, {
            new: true, // Return the updated document
            runValidators: true // Ensure that validators are run on the update
        });

        if (!updatedJob) throw createHttpError(404, 'Job not found');

        res.status(200).json({ message: 'Job edited successfully', job: updatedJob });

    } catch (err) {
        res.status(500).json({ message: 'Error Editing job', error: err.message });
    }
})

export const allJobs = asyncHandler(async (req, res) => {
    try {
        let allJob = await Job.find()
        if (!allJob) throw createHttpError.NotFound()
        res.status(200).json({ message: "Success", allJob })
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching job.' })
    }
})

export const deleteJob = asyncHandler(async (req, res) => {
    try {
        let jobId = req.params.id
        if (!jobId) throw createHttpError.NotFound('PleaseF select job.')

        let deleteJob = await Job.findByIdAndDelete({ _id: jobId })
        if (!deleteJob) throw createHttpError.NotFound('Job not found.')

        res.status(500).json({ message: 'Success', Job: deleteJob })
    } catch (error) {
        res.status(500).json({ message: 'Job not found', error: error.message })
    }
})
export const getJobById = asyncHandler(async (req, res) => {
    try {
        let jobId = req.params.id
        if (!jobId) throw createHttpError.NotFound('Please select job.')

        let foundJob = await Job.findById({ _id: jobId })
        if (!foundJob) throw createHttpError.NotFound('Job not found.')

        res.status(500).json({ message: 'Success', Job: foundJob })
    } catch (error) {
        res.status(500).json({ message: 'Job not found', error: error.message })
    }
})


// ! Services Add,update,get,delete
export const addService = asyncHandler(async (req, res) => {
    try {
        let service = req.body
        let savedService = new Service(service)


        await savedService.save()
        res.status(500).json({ message: 'Service added Successfully', savedService });
    } catch (err) {
        res.status(500).json({ message: 'Error adding new service', error: err.message });
    }
})

export const updateService = asyncHandler(async (req, res) => {
    let serviceId = req.params.id
    let updateService = req.body
    console.log(updateService.title)
    try {
        let service = await Service.findById({ _id: serviceId })
        if (!service) throw createHttpError.NotFound("Service Not found");

        const updatedService = await Service.findByIdAndUpdate(serviceId, updateService, {
            new: true, // Return the updated document
            runValidators: true // Ensure that validators are run on the update
        });
        console.log(updateService)
        if (!updateService) createHttpError.Conflict()

        res.status(500).json({ message: 'Service added Successfully', updatedService });
    } catch (err) {
        res.status(500).json({ message: 'Error adding new service', error: err.message });
    }
})

export const getAllServices = asyncHandler(async (req, res) => {
    try {
        let allServices = await Service.find()
        if (!allServices) throw createHttpError.NotFound()
        res.status(200).json({ message: "Success", allServices })
    } catch (error) {
        res.status(500).json({ message: 'Error while getting services', error: err.message });
    }
})

export const deleteService = asyncHandler(async (req, res) => {
    try {
        let serviceId = req.params.id
        let deletedService = await Service.findByIdAndDelete({ _id: serviceId })
        if (!deletedService) throw createHttpError.NotFound()
        res.status(200).json({ message: "Success", deletedService })
    } catch (err) {
        res.status(500).json({ message: 'Error while deleting services', error: err.message });
    }
})