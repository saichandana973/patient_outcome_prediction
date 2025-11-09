# 🏥 Patient Outcome Prediction

This project predicts patient outcomes using deep learning models (GAT + LSTM) trained on the **eICU dataset**.  
It is implemented using a full-stack approach — including **frontend, backend, and model integration**.

---

## 📁 Project Structure

patient_outcome_prediction/
│
├── backend/ # Express.js API for model and data handling
├── frontend/ # React.js frontend for user interface
├── Model_Implementation/ # GAT + LSTM Model implementation and Colab links
│ ├── elICU_master_final.csv
│ └── GAT_LSTM_Model_Link.txt
│
├── database/ # MongoDB connection and configuration
├── docs/ # Supporting documentation or notes
├── Documentation/ # Project report and documentation
│ └── eICU-Predicting Patient Outcomes.docx
│
├── package.json
└── README/ # (This folder)
└── README.md



🔧 Backend Setup
Prerequisites

Node.js v16+

MongoDB Atlas account (or local MongoDB)

Google Colab model running (GAT + LSTM)

Installation Steps

Navigate to backend directory

cd backend


Install dependencies

npm install


Configure environment variables
Create .env file inside /backend:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
PORT=4000
MODEL_API_URL=https://your-ngrok-url.ngrok-free.app


Run backend server

npm start


Server will start at:
👉 http://localhost:4000

🎨 Frontend Setup
Prerequisites

Node.js 16+

npm or yarn

Installation Steps

Navigate to frontend directory

cd frontend


Install dependencies

npm install


Start the React development server

npm start


Opens automatically at 👉 http://localhost:3000

🧠 Model Implementation (GAT + LSTM)

The GAT + LSTM model is hosted in Google Colab.
You can access the model here:
🔗 GAT + LSTM Google Colab Notebook

Model Input

Age

Gender

Heart Rate

Blood Pressure

Oxygen Level

Temperature

Medications

Diagnosis

Model Output

Predicted Outcome Probability

Risk Classification: Low, Medium, or High

🚀 Running the Complete Application

Start MongoDB
Ensure MongoDB Atlas or local MongoDB is running.

Run Google Colab model

Open the Colab notebook (link above)

Start the Flask/Gradio model cell

Copy the ngrok URL

Paste it into the backend .env as MODEL_API_URL

Run Backend

cd backend
npm start


Run Frontend

cd frontend
npm start


Access Application
Open your browser and go to
👉 http://localhost:3000

🩺 Application Features

Patient data entry and validation

Role-based dashboards (Admin / Doctor / User)

Real-time prediction using GAT + LSTM

Interactive visualization of prediction results

Secure user authentication (JWT)

MongoDB integration for data persistence



📊 Database Collections

users – Registered user accounts

patients – Patient medical data

predictions – Prediction logs with outcomes

feedback – User feedback for model evaluation