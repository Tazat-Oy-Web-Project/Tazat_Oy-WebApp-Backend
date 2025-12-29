// Importing Modules
const express = require('express');
const { initFirebase } = require('../config/firebaseAdmin');

const admin = initFirebase(); // Initialize Firebase Admin SDK
const db = admin.firestore(); // Firestore Database Reference

const jobRouter = express.Router();

// CREATE a new job post
jobRouter.post('/', async (req, res) => {

    try {

        console.log('Request Body:', req.body);

        const { 
            jobTitle, 
            jobDescription, 
            jobPostImageId, 
            jobPostImageURL, 
            jobLocation, 
            jobType, 
            jobStatus 
        } = req.body;

        console.log('Parsed Fields:', { 
            jobTitle, 
            jobDescription,
            jobPostImageId,  
            jobPostImageURL,
            jobLocation,
            jobType,
            jobStatus 
        });

        // 1) Basic validation
        if (!jobTitle || !jobDescription || !jobLocation || !jobType || !jobStatus) {
            return res.status(400).json({ 
                error: 'jobTitle, jobDescription, jobLocation, jobType, and jobStatus are required' 
            });
        }

        // Convert "img1" -> "blogPost/featured/blog-img1.png"
        const featuredImagePath = jobPostImageId
            ? `jobPost/featured/job-${jobPostImageId}.png`
            : null;

        // 2) Create the Document in Firestore
        const docRef = await db.collection('jobPosts').add({
            jobTitle: jobTitle,
            jobDescription: jobDescription,
            jobPostImageId: jobPostImageId || null,
            featuredImagePath: featuredImagePath,       // New field for image path
            jobPostImageId: jobPostImageId || null,
            jobPostImageURL: jobPostImageURL || null,
            jobLocation: jobLocation,
            jobType: jobType,
            jobStatus: jobStatus,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3) Send Response
        return res.status(201).json({ 
            id: docRef.id,
            message: 'Job post created successfully' 
        });
    }

    catch (error) {
        console.log("CREATE JOB POST ERROR:", error);
        res.status(500).json({ error: 'Failed to create job post' });
    }

});


// GET all job posts
jobRouter.get('/', async (req, res) => {

    try {
        
        const querySnapshot = await db.collection('jobPosts').orderBy('createdAt', 'desc').get();
        
        const jobPosts = [];
        querySnapshot.forEach((element) => {
            jobPosts.push({ id: element.id, ...element.data() });
        });
        res.status(200).json(jobPosts);

    } 
    
    catch (error) {
        console.log("GET JOB POSTS ERROR:", error);
        res.status(500).json({ error: 'Failed to fetch job posts' });
    }

});


// DELETE a job post by ID
jobRouter.delete('/:id', async (req, res) => {
    
    const jobPostId = req.params.id;
    console.log('Deleting job post with ID:', jobPostId);

    try {

        await db.collection('jobPosts').doc(jobPostId).delete();
        res.status(200).json({ message: 'Job post deleted successfully' });
    }

    catch (error) {
        console.log("DELETE JOB POST ERROR:", error);
        res.status(500).json({ error: 'Failed to delete job post' });
    }

});


module.exports = jobRouter;
