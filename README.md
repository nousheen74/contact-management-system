Contact Management System
This is a Contact Management System built using Next.js and TypeScript. The system allows users to manage their contacts with features such as user authentication, contact management, file handling, and more.

PROJECT STEUP

1.To set up the project locally, follow these steps:
Clone the repository:
git clone <repository-url>
cd <repository-directory>

2. Install Dependencies: Make sure you have Node.js and npm installed. Then, run:
npm install

3. Configure Environment Variables: In the project root directory, create a .env file and add the following variables with your specific configurations:
DATABASE_URL="sqlite://./database.sqlite"  # Update as necessary
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret


Running the Backend Server
1.Start the Development Server:
npm run dev
The server will start at http://localhost:3000.

2.Build and Run for Production:
npm run build
npm start

* ER DIAGRAM OF CONTACT-MANAGEMENT_SYSTEM *
+----------------+       +--------------------+
|     Users      |       |      Contacts      |
+----------------+       +--------------------+
| user_id (PK)   |<-----| contact_id (PK)    |
| email (Unique)  |       | user_id (FK)       |
| password        |       | name               |
| name            |       | email (Unique)     |
+----------------+       | phone              |
                         | address            |
                         | timezone           |
                         | created_at (UTC)   |
                         | updated_at (UTC)   |
                         +--------------------+
Relationship:
Users can have multiple Contacts (1-to-Many relationship).

API DOCUMENTATION
The API includes the following endpoints:

1.User Authentication
.POST /api/auth/register - Register a new user
Request Body:
{
  "email": "user@example.com",
  "password": "yourpassword",
  "name": "User Name"
}
Response:
201 Created: User successfully registered.
400 Bad Request: Invalid input or email already exists.

.POST /api/auth/login - Log in a user
Request Body:
{
  "email": "user@example.com",
  "password": "yourpassword"
}
Response:
200 OK: Authentication successful, returns JWT token.
401 Unauthorized: Invalid credentials.

.POST /api/auth/reset-password - Reset a user's password
Request Body:
{
  "email": "user@example.com",
  "newPassword": "newpassword",
  "code": "one-time-code"
}
Response:
200 OK: Password reset successful.
400 Bad Request: Invalid code or input.

2.Contact Management

.POST /api/contacts - Add a new contact
Request Body:
{
  "name": "Contact Name",
  "email": "contact@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "timezone": "UTC"
}
Response:
201 Created: Contact successfully added.
400 Bad Request: Invalid input or email already exists.

.GET /api/contacts - Retrieve contacts with filtering options
Response:
200 OK: Returns a list of contacts.
400 Bad Request: Invalid query parameters.

.PUT /api/contacts/:id - Update contact details
Request Body:
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
Response:
200 OK: Contact successfully updated.
404 Not Found: Contact not found.

.DELETE /api/contacts/:id - Soft delete a contact
Response:
204 No Content: Contact successfully deleted.
404 Not Found: Contact not found.

.POST /api/contacts/upload - Upload contacts via CSV/Excel
Request Body: Multipart file upload.
Response:
200 OK: Contacts successfully uploaded.
400 Bad Request: Invalid file format or data.


DATABASE SETUP:

The project uses a SQL database (e.g., SQLite, PostgreSQL, or MySQL) to store user and contact information.
Migrations can be managed using a tool like Sequelize or TypeORM to ensure schema changes are tracked.

OTHWR RELEVANT INFORMATION:
This project uses JWT for user authentication and includes email verification and password reset functionality.
The application supports time zone handling for contact information and date-time management.
The file upload feature allows bulk contact creation and updates via CSV/Excel files.




