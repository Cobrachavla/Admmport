import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string
const uri = 'mongodb://0.0.0.0'; // Replace with your MongoDB connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Declare collection variables
let usersCollection;
let filtersCollection;
let coursesCollection;
let boughtCoursesCollection;
let cart = [];

// Connect to MongoDB
async function connectToDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB!');
    const db = client.db('mydb');

    // Initialize collections
    usersCollection = db.collection('users');
    filtersCollection = db.collection('filters');
    coursesCollection = db.collection('courses');
    boughtCoursesCollection = db.collection('boughtCourses');

    // Start the server after successful DB connection
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit if unable to connect to MongoDB
  }
}
connectToDB();

// Middleware to ensure DB is connected
app.use((req, res, next) => {
  if (!usersCollection || !filtersCollection || !coursesCollection || !boughtCoursesCollection) {
    return res.status(500).json({ message: 'Database connection not established' });
  }
  next();
});

// User registration
app.post('/api/register', async (req, res) => {
  const newUser = req.body;
  try {
    await usersCollection.insertOne(newUser);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersCollection.findOne({ email, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// Get logged-in user
app.get('/api/user', async (req, res) => {
  try {
    const user = await usersCollection.findOne({});
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'No user found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Get filters
app.get('/api/filters', async (req, res) => {
  try {
    const filters = await filtersCollection.findOne({});
    res.status(200).json(filters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching filters' });
  }
});

// Get courses with filters
app.get('/api/courses', async (req, res) => {
  const { degree, branch, district } = req.query;
  let query = { status: 'verified' };

  if (degree) query.title = degree;
  if (branch) query.branch = { $in: branch.split(',') };
  if (district) query.district = { $in: district.split(',') };

  try {
    const courses = await coursesCollection.find(query).toArray();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get cart items
app.get('/api/cart', (req, res) => {
  res.status(200).json(cart);
});

// Get user purchases
app.get('/api/purchases', async (req, res) => {
  try {
    const user = await usersCollection.findOne({});
    const purchases = await boughtCoursesCollection.find({ 'user.id': user.id }).toArray();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases' });
  }
});

// Get college posts
app.get('/api/college-posts', async (req, res) => {
  try {
    const user = await usersCollection.findOne({});
    const posts = await coursesCollection.find({ college: user.college }).toArray();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching college posts' });
  }
});

// Update college posts
app.post('/api/college-posts', async (req, res) => {
  const { updatedCourses } = req.body;
  try {
    const user = await usersCollection.findOne({});
    const existingCourses = await coursesCollection.find({ college: user.college }).toArray();

    const finalCourses = existingCourses.filter(course =>
      updatedCourses.find(item => item.id === course.id)
    );

    await coursesCollection.deleteMany({ college: user.college });
    await coursesCollection.insertMany(finalCourses);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error updating college posts' });
  }
});

// Add course to cart
app.post('/api/cart', (req, res) => {
  const { course } = req.body;
  if (!cart.find(item => item.id === course.id)) {
    cart.push(course);
  }
  res.status(200).json(cart);
});

// Remove course from cart
app.delete('/api/cart', (req, res) => {
  const { courseId } = req.body;
  cart = cart.filter(item => item.id !== courseId);
  res.status(200).json(cart);
});

// Record purchase
app.post('/api/purchasesp', async (req, res) => {
  const { user, course, invoice } = req.body;
  if (!user || !course || !invoice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await boughtCoursesCollection.insertOne({ user, course, invoice });
    res.status(200).json({ message: 'Purchase recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error recording purchase' });
  }
});

// Add new course
app.post('/api/add-course', async (req, res) => {
  const newCourse = req.body;
  if (typeof newCourse.cost === 'string') {
    newCourse.cost = parseFloat(newCourse.cost);
  }
  try {
    // Ensure `cost` is a valid number
    if (isNaN(newCourse.cost)) {
      return res.status(400).json({ message: 'Invalid cost value' });
    }
    const user = await usersCollection.findOne({});
    newCourse.college = user.college;
    newCourse.status = 'unverified';
    const lastCourse = await coursesCollection.findOne({}, { sort: { id: -1 } });
    newCourse.id = lastCourse ? lastCourse.id + 1 : 1;
    await coursesCollection.insertOne(newCourse);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Error adding course' });
  }
});

// Admin routes

// Get all courses (admin)
app.get('/api/courses-admin', async (req, res) => {
  try {
    const courses = await coursesCollection.find({}).toArray();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Update courses (admin)
app.post('/api/courses-admin', async (req, res) => {
  const updatedCourses = req.body;
  const branches = [...new Set(updatedCourses.map(course => course.branch))];
  const districts = [...new Set(updatedCourses.map(course => course.district))];

  try {
    await coursesCollection.deleteMany({});
    await coursesCollection.insertMany(updatedCourses);

    const filters = {
      branches: branches.sort(),
      districts: districts.sort(),
    };
    await filtersCollection.replaceOne({}, filters, { upsert: true });
    res.status(200).json({ message: 'Courses updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating courses' });
  }
});

// Get all purchases (admin)
app.get('/api/purchases-admin', async (req, res) => {
  try {
    const purchases = await boughtCoursesCollection.find({}).toArray();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases' });
  }
});


// Start the server

/*const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});
app.use(cors());
fs.writeFileSync(path.join(__dirname, './data/user.json'), JSON.stringify('[]', null, 2), 'utf-8');
const users = require('./users.json');
//const boughtCourses = require('./data/boughtCourses.json');
let cart = [];

////login logic

app.post('/api/register', (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  //fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2), 'utf-8');
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    try {
      fs.writeFileSync(path.join(__dirname, './data/user.json'), JSON.stringify(user, null, 2), 'utf-8');
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error writing to user.json:', error);
      res.status(500).json({ success: false, message: 'Error saving user data' });
    }
  } else {
    res.json({ success: false });
  }
});

////login end

app.get('/api/user', (req, res) => {
  try {
    const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
    //console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error reading user.json:', error);
    res.status(500).json({ success: false, message: 'Error reading user data' });
  }
});

app.get('/api/filters', (req, res) => {
  try {
    let filters = JSON.parse(fs.readFileSync('./data/filters.json'));
    res.status(200).json(filters);
  } catch (error) {
    res.status(500).json({ message: 'Error reading filters file' });
  }
});

app.get('/api/courses', (req, res) => {
  const courses = JSON.parse(fs.readFileSync('./data/courses.json'));
  const { degree, branch, district } = req.query;
  //console.log(degree);
  let filteredCourses = courses.filter(course => course.status === 'verified');;
  if(degree){
   filteredCourses = filteredCourses.filter(course => course.title === degree);
  }
  if (branch) {
    const branchArray = branch.split(',');
    //console.log(branchArray);
    filteredCourses = filteredCourses.filter(course => branchArray.includes(course.branch));
  }

  if (district) {
  	const districtArray = district.split(',');
    filteredCourses = filteredCourses.filter(course => districtArray.includes(course.district));
  }

  res.status(200).json(filteredCourses);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/api/cart', (req, res) => {
  
  res.status(200).json(cart);
});

app.get('/api/purchases', (req, res) => {
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const boughtCourses = JSON.parse(fs.readFileSync('./data/boughtCourses.json', 'utf-8'));
  res.status(200).json(boughtCourses.filter(item => item.user.id === user.id));
});


app.get('/api/college-posts', (req, res) => {
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const postedCourses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  res.status(200).json(postedCourses.filter(item => item.college === user.college));
});


app.post('/api/college-posts', (req, res) => {
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  const postedCourses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  const { updatedCourses } = req.body;
  //console.log("durr durr*******");
  //console.log(updatedCourses);
  //console.log("durr durr*******");
  if (updatedCourses) {
  let final = [];
    try {
      for (var course of postedCourses)
      //console.log(course); 
		{
		  if(course.college !== user.college){
		  	final.push(course);
		  }
		  else{
		  	if(updatedCourses.find(item => item.id === course.id)){
		  		final.push(course);
		  	}
		  	else{
		  		console.log(course);
		  	}
		  }
		}
      fs.writeFileSync(path.join(__dirname, './data/courses.json'), JSON.stringify(final, null, 2), 'utf-8');
      res.json({ success: true, user });
    } catch (error) {
      console.error('Error writing to user.json:', error);
      res.status(500).json({ success: false, message: 'Error saving user data' });
    }
  } else {
    res.json({ success: false });
  }

});

app.post('/api/cart', (req, res) => {
  //console.log(res.json(cart));
  const { course } = req.body;
  //if(cart.length!==0){
  if (!cart.find(item => item.id === course.id)) {
    cart.push(course);
  }
  //res.status(200).json(cart);
  //}
  res.status(200).json(cart);
});

app.delete('/api/cart', (req, res) => {
  const { courseId } = req.body;
  cart = cart.filter(item => item.id !== courseId);
  res.status(200).json(cart);
});

app.post('/api/purchasesp', (req, res) => {
  const { user, course, invoice } = req.body;

  if (!user || !course || !invoice) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Path to the JSON file
  const filePath = path.join(__dirname, 'data', 'boughtCourses.json');

  // Read existing data
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading file' });
    }

    let boughtCourses = [];
    if (data) {
      boughtCourses = JSON.parse(data);
    }

    // Create a new purchase entry
    const newPurchase = {
      user,
      course,
      invoice,
    };

    // Add new purchase to the list
    boughtCourses.push(newPurchase);

    // Write updated data to file
    fs.writeFile(filePath, JSON.stringify(boughtCourses, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing file' });
      }
      res.status(200).json({ message: 'Purchase recorded successfully' });
    });
  });
});


app.post('/api/add-course', (req, res) => {
  const newCourse = req.body;
  const user = JSON.parse(fs.readFileSync('./data/user.json', 'utf-8'));
  newCourse.college = user.college;
  newCourse.status= 'unverified';
  let courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf-8'));
  //console.log(newCourse);
  newCourse.id = courses[courses.length-1].id + 1;
  //console.log(newCourse);
  //console.log('executed');
  if(!courses.find(item => item === newCourse)){
   console.log(newCourse);
   courses.push(newCourse);
   fs.writeFileSync('./data/courses.json', JSON.stringify(courses, null, 2));
   res.status(200).json({ success: true });
   }
});

app.get('/api/courses-admin', (req, res) => {
	try{
   		 const data = fs.readFileSync('./data/courses.json', 'utf8');
   		 res.status(200).send(JSON.parse(data));
        }
    catch (error){
        res.status(500).send('Error reading courses file');
    }
    });

// API to update course status
app.post('/api/courses-admin', (req, res) => {
    try{
    	const updatedCourses = req.body;
		//let courses = JSON.parse(fs.readFileSync('./data/courses.json', 'utf8'));
		//courses = courses.map(course => course.id === updatedCourse.id ? updatedCourse : course);
		const branches = [...new Set(updatedCourses.map(course => course.branch))];
		const districts = [...new Set(updatedCourses.map(course => course.district))];
		fs.writeFileSync('./data/courses.json', JSON.stringify(updatedCourses, null, 2), 'utf8');
		res.status(200).send('Course updated successfully');
		
		const filters = {
        branches: branches.sort(),
        districts: districts.sort()
    	};
    	fs.writeFileSync('./data/filters.json', JSON.stringify(filters, null, 2), 'utf8');
    
    } catch (error){
    	res.status(500).send('Error reading courses file '+error);
    }
    });
    
    
app.get('/api/purchases-admin', (req, res) => {
  const boughtCourses = JSON.parse(fs.readFileSync('./data/boughtCourses.json', 'utf-8'));
  res.status(200).json(boughtCourses);
});
*/
