Node.js API Assignment

🚀 Setup Instructions

This project requires a client ID, client secret key, and database URL for testing. Follow the steps below to set up your own credentials and test the API.

1️⃣ Clone the Repository

git clone <your-repository-link>  
cd <your-project-folder>  

2️⃣ Install Dependencies

npm install  

3️⃣ Set Up Environment Variables

Create a .env file in the root directory and add the following variables:

* CLIENT_ID=your-client-id  
* CLIENT_SECRET=your-client-secret-key  
* DB_URL=your-database-url  
* PORT=8080  # or any available port
* JWT_secret_key="your_secret_key" 

How to Get Your Own Credentials?

Client ID & Secret Key: If you are using OAuth (Google, Facebook, etc.), create credentials from their developer portals.

Database URL: If using MongoDB, create a free database on MongoDB Atlas or use a local instance.

4️⃣ Run the Server

npm start  

Or for development with hot reload:

npm run dev  

5️⃣ Test with Postman

Import the Postman Collection (if provided).

Use the base URL: http://localhost:8080

Pass the CLIENT_ID and CLIENT_SECRET as needed in API requests.

📌 Notes

Make sure your .env file is not committed to Git.


🔗 Author & Contact

If you have any issues, feel free to reach out with me -  abhishekbelaganj0609@gmail.com

Hope this helps! 🚀

