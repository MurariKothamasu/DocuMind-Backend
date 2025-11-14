# DocuMind-Backend 🧠📄

This is the Node.js & Express API that powers the [DocuMind-Frontend](https://github.com/MurariKothamasu/DocuMind-Frontend). It handles user authentication, file uploads, PDF/Image text extraction, and communication with the OpenAI API for summarization.

## ✨ Features

* **Secure JWT Authentication:** Manages user signup and login with JSON Web Tokens.
* **Cross-Domain Cookie Management:** Uses `httpOnly`, `secure`, and `SameSite="None"` cookies for secure cross-domain authentication.
* **File Uploads:** Uses `multer` to handle `multipart/form-data` uploads, including file type and size validation.
* **Text Extraction:**
    * **PDF:** Uses `pdf-parse` to read text from PDF documents.
    * **Images (OCR):** Uses OCR libraries to extract text from images.
* **AI Summarization:** Connects to the OpenAI API (gpt-4o-mini) to generate summaries and key points based on user-selected length.
* **Global Error Handling:** Includes a centralized error handler for catching Multer errors, auth errors, and other server issues.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Token (JWT) & bcrypt (for password hashing)
* **File Handling:** Multer (for uploads), `pdf-parse` (for PDFs)
* **AI:** OpenAI Node.js Library
* **Deployment:** Render (or Vercel)

## 🚀 Getting Started

To run this project on your local machine, follow these steps.

### Prerequisites

* Node.js (v18 or later recommended)
* `npm` or `yarn`
* A running MongoDB database (local or a free Atlas cluster)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/MurariKothamasu/DocuMind-Backend.git](https://github.com/MurariKothamasu/DocuMind-Backend.git)
    cd DocuMind-Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file in the project root named `.env`. This is crucial for running the server.

    ```env
    # MongoDB
    MONGO_URI=your_mongodb_connection_string

    # JWT
    JWT_SECRET=your_super_secret_jwt_key

    # OpenAI
    OPENAI_API_KEY=your_openai_api_key

    # Frontend
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Run the development server:**
    This will start the server, usually on `http://localhost:3000`.
    ```bash
    npm run dev
    ```

## 🔑 Environment Variables

To run this project, you must have a `.env` file with the following variables:

* `MONGO_URI`: Your MongoDB connection string.
* `JWT_SECRET`: A long, random string used to sign your authentication tokens.
* `OPENAI_API_KEY`: Your API key from OpenAI.
* `FRONTEND_URL`: The URL of your frontend (e.g., `http://localhost:5173` for local dev or your live Vercel URL for production).

## API Endpoints

* `POST /signup`: Creates a new user.
* `POST /login`: Logs in a user and sets an auth cookie.
* `POST /logout`: Clears the auth cookie.
* `GET /me`: Gets the current user's data from their cookie.
* `POST /extract`: Handles file upload, processes the file, and returns the summary.