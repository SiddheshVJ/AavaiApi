import { Schema, model } from "mongoose";

const logoSchema = new Schema({
    logoUrl: {
        type: String,
        required: true
    }
});

const jobSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
    companyName: { type: String, required: true },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'], required: true },
    salaryRange: { type: String },
});

const contactSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    contacted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now } // Optional: To track when the contact was made
});

const serviceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true }
});

const projectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }] // Array of image URLs
});

// const gallerySchema = new Schema({
//     imageUrl: [{ type: String }],
//     description: { type: String } // Optional description for the image
// });


const Logo = model('Logo', logoSchema);
const Job = model('Job', jobSchema);
const Contact = model('Contact', contactSchema);
const Service = model('Service', serviceSchema);
const Project = model('Project', projectSchema);
// const Gallery = model('Gallery', gallerySchema);

module.exports = {
    Logo, Job, Contact, Service, Project
}