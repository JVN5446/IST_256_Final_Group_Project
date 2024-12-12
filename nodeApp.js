// Import the Express library for building web applications
// Import the HTTPS module for creating a secure HTTPS server
// Import the file system(fs) module for reading files
// Import the body-parser middleware for parsing JSON request bodies
// Import the MongoClient class from the MongoDB library

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");

// Initialize an Express application
const app = express();

// Use the JSON parser middleware to handle JSON request bodies
app.use(bodyParser.json());

// Define the port on which the server will run
// Define the IP address of the server
// HTTPS options, including the SSL key and certificate files

const port = 3004;
const ipAddress = '130.203.136.203';
const options = {
    key: fs.readFileSync('ist256.key'), // Read the private key file
    cert: fs.readFileSync('ist256.cert'), // Read the certificate file
};

// Middleware to enable Cross-Origin Resource Sharing (CORS) for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Respond to preflight requests
    }
    next(); // Pass control to the next middleware function
});

// MongoDB connection URI and client setup
// Function to connect to MongoDB
const uri = "mongodb://team4:team4@localhost:27017"; // MongoDB connection string
const client = new MongoClient(uri); // Create a MongoDB client instance
async function connectToMongoDB() {
    try {
        await client.connect(); // Establish connection to MongoDB
        console.log("Connected to MongoDB"); // Log success message
    } catch (error) {
        console.error("Error connecting to MongoDB:", error); // Log error message
    }
}

// Connect to MongoDB when the server starts
connectToMongoDB();

// Define a POST route for handling JSON product payloads
app.post('/product', async (req, res) => {
    try {
        const dbName = 'team4DB'; // Specify the database name
        const collectionName = 'products'; // Specify the collection name
        const productData = req.body; // Retrieve the JSON payload from the request body

        console.log("Received product data:", productData); // Log received payload

        // Connect to the specified database
        const db = client.db(dbName);
        console.log(`Opened database: ${dbName}`); // Log database connection

        // Access the specified collection
        const collection = db.collection(collectionName);
        console.log(`Scanning collection: ${collectionName}`); // Log collection access

        // Check for an existing document with the same productID
        const existingProduct = await collection.findOne({ productID: productData.productID });

        if (existingProduct) {
            // If a document with the same productID exists, update it
            console.log("Product with the same productID found. Updating document...");
            await collection.updateOne(
                { productID: productData.productID }, // Filter by productID
                { $set: productData } // Update with the new data
            );
            console.log("Document updated successfully.");
            res.status(200).json({ message: "Product updated successfully." });
        } else {
            // If no document with the same productID exists, insert a new one
            console.log("No matching productID found. Creating and inserting a new document...");
            await collection.insertOne(productData);
            console.log("Document inserted successfully.");
            res.status(201).json({ message: "Product created and inserted successfully." });
        }
    } catch (error) {
        console.error("Error during database operation:", error); // Log any errors
        res.status(500).json({ message: "Error during database operation." });
    }
});

// Define a POST route for handling JSON shopper payloads
app.post('/shopper', async (req, res) => {
    try {
        const dbName = 'team4DB'; // Specify the database name
        const collectionName = 'shopper'; // Specify the collection name
        const shopperData = req.body; // Retrieve the JSON payload from the request body

        console.log("Received shopper data:", shopperData); // Log received payload

        // Connect to the specified database
        const db = client.db(dbName);
        console.log(`Opened database: ${dbName}`); // Log database connection

        // Access the specified collection
        const collection = db.collection(collectionName);
        console.log(`Scanning collection: ${collectionName}`); // Log collection access

        // Check for an existing document with the same ShopperPassword
        const existingShopper = await collection.findOne({ ShopperPassword: shopperData.ShopperPassword });

        if (existingShopper) {
            // If a document with the same ShopperPassword exists, update it
            console.log("Shopper with the same ShopperPassword found. Updating document...");
            await collection.updateOne(
                { ShopperPassword: shopperData.ShopperPassword }, // Filter by ShopperPassword
                { $set: shopperData } // Update with the new data
            );
            console.log("Document updated successfully.");
            res.status(200).json({ message: "Shopper updated successfully." });
        } else {
            // If no document with the same ShopperPassword exists, insert a new one
            console.log("No matching ShopperPassword found. Creating and inserting a new document...");
            await collection.insertOne(shopperData);
            console.log("Document inserted successfully.");
            res.status(201).json({ message: "Shopper created and inserted successfully." });
        }
    } catch (error) {
        console.error("Error during database operation:", error); // Log any errors
        res.status(500).json({ message: "Error during database operation." });
    }
});

// Define a POST route for handling JSON shopping cart payloads
app.post('/shoppingCart', async (req, res) => {
    try {
        const dbName = 'team4DB'; // Specify the database name
        const collectionName = 'shoppingCart'; // Specify the collection name
        const cartItems = req.body; // Retrieve the JSON array payload from the request body

        console.log("Received shopping cart items:", cartItems); // Log received payload

        // Convert the array into a JSON object with a field 'items'
        const cartData = {
            items: cartItems,  // Assuming cartItems is an array of objects representing each cart item
            createdAt: new Date()  // Optionally add a timestamp field
        };

        console.log("Formatted cart data to insert:", cartData); // Log the formatted data

        // Connect to the specified database
        const db = client.db(dbName);
        console.log(`Opened database: ${dbName}`); // Log database connection

        // Access the specified collection
        const collection = db.collection(collectionName);
        console.log(`Scanning collection: ${collectionName}`); // Log collection access

        // Insert the shopping cart data as a document
        console.log("Inserting shopping cart data...");
        await collection.insertOne(cartData);
        console.log("Document inserted successfully.");

        res.status(201).json({ message: "Shopping cart created and inserted successfully." });
    } catch (error) {
        console.error("Error during database operation:", error); // Log any errors
        res.status(500).json({ message: "Error during database operation." });
    }
});



// Define a POST route for handling JSON shopper payloads
app.post('/shipping', async (req, res) => {
    try {
        const dbName = 'team4DB'; // Specify the database name
        const collectionName = 'shipping'; // Specify the collection name
        const shippingData = req.body; // Retrieve the JSON payload from the request body

        console.log("Received Shipping data:", shippingData); // Log received payload

        // Connect to the specified database
        const db = client.db(dbName);
        console.log(`Opened database: ${dbName}`); // Log database connection

        // Access the specified collection
        const collection = db.collection(collectionName);
        console.log(`Scanning collection: ${collectionName}`); // Log collection access

        // Check for an existing document with the same Address
        const existingShopper = await collection.findOne({ Address: shippingData.Address });

        if (existingShopper) {
            // If a document with the same Address exists, update it
            console.log("Shipping with the same Address found. Updating document...");
            await collection.updateOne(
                { Address: shippingData.Address }, // Filter by ShopperPassword
                { $set: shippingData } // Update with the new data
            );
            console.log("Document updated successfully.");
            res.status(200).json({ message: "Shipping Info updated successfully." });
        } else {
            // If no document with the same Address exists, insert a new one
            console.log("No matching Address found. Creating and inserting a new document...");
            await collection.insertOne(shippingData);
            console.log("Document inserted successfully.");
            res.status(201).json({ message: "Shipping info created and inserted successfully." });
        }
    } catch (error) {
        console.error("Error during database operation:", error); // Log any errors
        res.status(500).json({ message: "Error during database operation." });
    }
});

// Define a POST route for handling JSON shopper payloads
app.post('/billing', async (req, res) => {
    try {
        const dbName = 'team4DB'; // Specify the database name
        const collectionName = 'billing'; // Specify the collection name
        const billingData = req.body; // Retrieve the JSON payload from the request body

        console.log("Received billing data:", billingData); // Log received payload

        // Connect to the specified database
        const db = client.db(dbName);
        console.log(`Opened database: ${dbName}`); // Log database connection

        // Access the specified collection
        const collection = db.collection(collectionName);
        console.log(`Scanning collection: ${collectionName}`); // Log collection access

        // Check for an existing document with the same Name
        const existingShopper = await collection.findOne({ Name: billingData.Name });

        if (existingShopper) {
            // If a document with the same Name exists, update it
            console.log("Shipping with the same Address found. Updating document...");
            await collection.updateOne(
                { Name: billingData.Name }, // Filter by Name
                { $set: billingData } // Update with the new data
            );
            console.log("Document updated successfully.");
            res.status(200).json({ message: "Billing Info updated successfully." });
        } else {
            // If no document with the same Address exists, insert a new one
            console.log("No matching Name found. Creating and inserting a new document...");
            await collection.insertOne(billingData);
            console.log("Document inserted successfully.");
            res.status(201).json({ message: "Billing info created and inserted successfully." });
        }
    } catch (error) {
        console.error("Error during database operation:", error); // Log any errors
        res.status(500).json({ message: "Error during database operation." });
    }
});

// Define a GET route to fetch a product by its productID
app.get('/product/:productID', async (req, res) => {
    try {
        const dbName = 'team4DB'; // Specify the database name
        const collectionName = 'products'; // Specify the collection name

        // Connect to the specified database
        const db = client.db(dbName);
        console.log(`Opened database: ${dbName}`); // Log database connection

        // Access the specified collection
        const collection = db.collection(collectionName);
        console.log(`Scanning collection: ${collectionName}`); // Log collection access

        // Find all products
        const products = await collection.find().toArray(); // Find all documents in the collection

        if (products.length > 0) {
            // If products are found, return them as JSON
            console.log("Products found:", products); // Log found products data
            res.status(200).json(products); // Return all products as JSON
        } else {
            // If no products are found, return a 404 status with an error message
            console.log("No products found");
            res.status(404).json({ message: "No products found." });
        }
    } catch (error) {
        console.error("Error during database operation:", error); // Log any errors
        res.status(500).json({ message: "Error during database operation." });
    }
});


// Create an HTTPS server with the defined options and Express app
const server = https.createServer(options, app);

// Start the HTTPS server
try {
    server.listen(port, () => {
        console.log(`Secure server is running on ${ipAddress}:${port}`); // Log the server details
    });
} catch (error) {
    console.error("Error starting server:", error); // Log error
}