<h1>Node.js social_auth API for authentication and roles. </h1> 

<h2>🚀 Setup Instructions</h2>

This project requires a client ID, client secret key, and database URL for testing. Follow the steps below to set up your own credentials and test the API.

<h2>1️⃣ Clone the Repository </h2>

git clone <your-repository-link>  
cd <your-project-folder>  

<h2>2️⃣ Install Dependencies </h2>

npm install  

<h2>3️⃣ Set Up Environment Variables </h2>

Create a .env file in the root directory and add the following variables:

* CLIENT_ID=your-client-id  
* CLIENT_SECRET=your-client-secret-key  
* DB_URL=your-database-url  
* PORT=8080  # or any available port
* JWT_secret_key="your_secret_key" 

<h2>How to Get Your Own Credentials? </h2>

Client ID & Secret Key: If you are using OAuth (Google, Facebook, etc.), create credentials from their developer portals.

Database URL: If using MongoDB, create a free database on MongoDB Atlas or use a local instance.

<h2>4️⃣ Run the Server </h2>

npm start  

Or for development with hot reload:

npm run dev  

<h2>5️⃣ Test with Postman </h2>

Import the Postman Collection (if provided).

Use the base URL: http://localhost:8080

Pass the CLIENT_ID and CLIENT_SECRET as needed in API requests.

<h2>📌 Notes </h2>

Make sure your .env file is not committed to Git.


<h2>🔗 Author & Contact</h2>

If you have any issues, feel free to reach out with me -  abhishekbelaganj0609@gmail.com

Hope this helps! 🚀

