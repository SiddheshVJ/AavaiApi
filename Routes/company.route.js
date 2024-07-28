import express from "express";
import { uploadCompanyLogo, newJobPost, updateJob, allJobs, getJobById, deleteJob, addService, updateService, getAllServices, deleteService } from "../controllers/company.controller"
import { isAuthenticated } from "../middlewares/auth"
import { upload, productImgResize } from "../middlewares/uploadImages";

const companyRouter = express.Router()

companyRouter.post('/uploadlogo', isAuthenticated, upload.single('logo'), productImgResize, uploadCompanyLogo)

//? Jobs Page
companyRouter.get('/alljobs', allJobs)
companyRouter.get('/job/:id', getJobById)
companyRouter.post('/newjob', isAuthenticated, newJobPost)
companyRouter.put('/updatejob/:id', isAuthenticated, updateJob)
companyRouter.delete('/deletejob/:id', isAuthenticated, deleteJob)

//? Services Page
companyRouter.get('/services', getAllServices)
companyRouter.post('/addservice', isAuthenticated, addService)
companyRouter.put('/updateservice/:id', isAuthenticated, updateService)
companyRouter.delete('/deleteservice/:id', isAuthenticated, deleteService)

export default companyRouter