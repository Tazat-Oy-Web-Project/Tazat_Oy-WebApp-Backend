// Importing Modules
const express = require('express');
const { initFirebase } = require('../config/firebaseAdmin');

const admin = initFirebase(); // Initialize Firebase Admin SDK
const db = admin.firestore(); // Firestore Database Reference


const blogRouter = express.Router();

// CREATE a new blog post
blogRouter.post('/', async (req, res) => {

    try{

        console.log('Request Body:', req.body);


        const { categoryId, title, content, featuredImageId, postImageURL } = req.body;

        // 1) Basic validation
        if (!categoryId || !title || !content) {
            return res.status(400).json({ error: 'categoryId, title, and content are required' });
        }

        // Convert "img1" -> "blogPost/featured/blog-img1.png"
        const featuredImagePath = featuredImageId
            ? `blogPost/featured/blog-${featuredImageId}.png`
            : null;

        // 2) Craete the Document in Firestore
        const docRef = await db.collection('blogPosts').add({
            categoryId: categoryId,
            title: title,
            content: content,
            featuredImageId: featuredImageId || null,
            featuredImagePath: featuredImagePath,       // New field for image path
            postImageURL: postImageURL || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3) Send Response
        return res.status(201).json({ 
            id: docRef.id,
            message: 'Blog post created successfully' 
        });
    }

    catch (error) {
        console.log("CREATE BLOG ERROR:", error);
        res.status(500).json({ error: 'Failed to create blog post' });
    }

})


// GET all blog posts
blogRouter.get('/', async (req, res) => {

    try {
        
        const querySnapshot = await db.collection('blogPosts').orderBy('createdAt', 'desc').get();
        
        // Consoling the fetched blog posts

        const blogPosts = [];
        querySnapshot.forEach((element) => {
            blogPosts.push({ id: element.id, ...element.data() });
        });
        res.status(200).json(blogPosts);

    } 
    
    
    catch (error) {
        console.log("GET BLOG POSTS ERROR:", error);
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }

})


// DELETE a blog post by ID
blogRouter.delete('/:id', async (req, res) => {
    const blogPostId = req.params.id;
    console.log('Deleting blog post with ID:', blogPostId);

    try {

        await db.collection('blogPosts').doc(blogPostId).delete();
        res.status(200).json({ message: 'Blog post deleted successfully' });
    }

    catch (error) {
        console.log("DELETE BLOG POST ERROR:", error);
        res.status(500).json({ error: 'Failed to delete blog post' });
    }

});


// GET a blog post by ID
blogRouter.get('/:id', async (req, res) => {
    const blogPostId = req.params.id;
    console.log('Fetching blog post with ID:', blogPostId);
    try {
        const docRef = db.collection('blogPosts').doc(blogPostId);
        const doc = await docRef.get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    }
    catch (error) {
        console.log("GET BLOG POST ERROR:", error);
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
});


module.exports = blogRouter;