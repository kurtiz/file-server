<center>
<img src="https://i.ibb.co/18j74vR/icon.png" alt="Version" style="width: 100px;"/>

# File Server API Documentation

<img src="https://img.shields.io/badge/Version-0.0.1-green.svg" alt="Version" style="max-width: 100%;"/>
<img src="https://wakatime.com/badge/user/9657174f-2430-4dfd-aaef-2b316eb71a36/project/018ed26e-f74a-4f48-b4e7-5ebb729aaa6b.svg" alt="wakatime"/>
<img src="https://img.shields.io/badge/Language(s)-JavaScript/TypeScript-yellow.svg" alt="Version" style="max-width: 100%;"/>
<img src="https://i.ibb.co/NCPSW02/image.png" alt="Version" style="max-width: 80%;"/>

</center>

## Overview

The File Server API provides comprehensive endpoints for file management, including file uploads, downloads, user
authentication, email operations, and administrative tasks. The API supports both user and admin roles with specific
routes for each.

## Deployed Links
- Backend: https://file-server-zr8t.onrender.com
- Frontend: https://weserve.onrender.com

## Installation

- clone repository

```bash
cd file-server
```

- install dependencies

```bash
npm install
```

- create `.envrc.json` file
- add environment variables
- run server

```bash
npm run start
```

## Database Structure and Entity Relationships

The database structure and entity relationships in the File Server API are as follows:

### Admin

- **Fields**:
  - fullname
  - email
  - emailVerified
  - authentication
    - password
    - session
      - token
      - expires
    - otp
      - code
      - expires

- **Relationships**:
  - `File.uploadedBy` references `Admin`
  - `Email.sentByAdmin` references `Admin`

### Download

- **Fields**:
  - file (references `File`)

- **Relationships**:
  - `Download.file` references `File`

### Email

- **Fields**:
  - recipient
  - subject
  - content
  - file (references `File`)
  - sentByUser (references `User`)
  - sentByAdmin (references `Admin`)

- **Relationships**:
  - `Email.file` references `File`
  - `Email.sentByUser` references `User`
  - `Email.sentByAdmin` references `Admin`

### File

- **Fields**:
  - filename
  - fileSize
  - title
  - description
  - path
  - uploadedBy (references `Admin`)

- **Relationships**:
  - `File.uploadedBy` references `Admin`

### User

- **Fields**:
  - fullname
  - email
  - emailVerified
  - authentication
    - password
    - session
      - token
      - expires
    - otp
      - code
      - expires

- **Relationships**:
  - `Email.sentByUser` references `User`

The image below shows the ER diagram

![file-server](https://i.ibb.co/BcwHrkT/erdiagram.png)

## Base URL

```
https://file-server-zr8t.onrender.com
```

## Authentication

All endpoints require authentication via an API key. Include the API key in the `Authorization` header for each request.

```
Authorization: Bearer SESSON_TOKEN
```

## Endpoints

### Admin Routes

#### 1. Register

Register a new admin user.

- **URL:** `/admin/register`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  - `username` (required): The username of the admin.
  - `password` (required): The password of the admin.
- **Responses:**
  - `201 Created`: Admin registered successfully.
  - `400 Bad Request`: Missing or invalid parameters.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/admin/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'securepassword'
  })
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "message": "Admin registered successfully."
}
```

#### 2. Login

Authenticate an admin user.

- **URL:** `/admin/login`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  - `username` (required): The username of the admin.
  - `password` (required): The password of the admin.
- **Responses:**
  - `200 OK`: Authentication successful.
  - `401 Unauthorized`: Invalid username or password.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/admin/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'securepassword'
  })
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "data": {
    "fullname": "Admin User",
    "email": "LwXpE@example.com",
    "emailVerified": true,
    "authentication": {
      "session": {
        "token": "admin123",
        "expires": "2024-07-06T12:00:00Z"
      },
      "otp": {
        "code": "123456",
        "expires": "2024-07-06T12:00:00Z"
      },
      "password": "securepassword"
      //...other related fields
    }
  }
}
```

#### 3. File Upload to AWS

Upload a file to AWS S3.

- **URL:** `/admin/file/upload/aws`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer SESSON_TOKEN`
  - `Content-Type: multipart/form-data`
- **Request Parameters:**
  - `file` (required): The file to be uploaded.
- **Responses:**
  - `200 OK`: File uploaded successfully.
  - `400 Bad Request`: Missing file parameter.
  - `401 Unauthorized`: Invalid or missing session token.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('https://file-server-zr8t.onrender.com/admin/file/upload/aws', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer SESSON_TOKEN'
  },
  body: formData
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "data": {
    "id": "file123",
    "name": "example.txt",
    "url": "https://s3.amazonaws.com/yourbucket/example.txt",
    "created_at": "2024-07-06T12:00:00Z"
  }
}
```

#### 4. File Upload to Local Server

Upload a file to the local server storage.

- **URL:** `/admin/file/upload/local`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer SESSON_TOKEN`
  - `Content-Type: multipart/form-data`
- **Request Parameters:**
  - `file` (required): The file to be uploaded.
- **Responses:**
  - `200 OK`: File uploaded successfully.
  - `400 Bad Request`: Missing file parameter.
  - `401 Unauthorized`: Invalid or missing session token.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('https://file-server-zr8t.onrender.com/admin/file/upload/local', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer SESSON_TOKEN'
  },
  body: formData
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "data": {
    "id": "file123",
    "name": "example.txt",
    "url": "https://file-server-zr8t.onrender.com/files/file123",
    "created_at": "2024-07-06T12:00:00Z"
  }
}
```

#### 5. Delete File

Delete a file from the server.

- **URL:** `/admin/file/delete/:fileId`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization: Bearer SESSON_TOKEN`
- **Path Parameters:**
  - `fileId` (required): The ID of the file to delete.
- **Responses:**
  - `200 OK`: File deleted successfully.
  - `401 Unauthorized`: Invalid or missing session token.
  - `404 Not Found`: File not found.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/admin/file/delete/file123', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer SESSON_TOKEN'
  }
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "message": "File deleted successfully."
}
```

#### 6. List All Files

List all files available on the server.

- **URL:** `/admin/files`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer SESSON_TOKEN`
- **Responses:**
  - `200 OK`: Files listed successfully.
  - `401 Unauthorized`: Invalid or missing session token.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/admin/files', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer SESSON_TOKEN'
  }
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "data": [
    {
      "id": "file123",
      "name": "example.txt",
      "url": "https://file-server-zr8t.onrender.com/files/file123",
      "created_at": "2024-07-06T12:00:00Z"
    },
    {
      "id": "file124",
      "name": "example2.txt",
      "url": "https://file-server-zr8t.onrender.com/files/file124",
      "created_at": "2024-07-06T12:00:00Z"
    }
  ]
}
```

#### 7. Send File via Email

Send a file via email.

- **URL:** `/admin/send-email`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer SESSON_TOKEN`
  - `Content-Type: application/json`
- **Request Body:**
  - `email` (required): The recipient's email address.
  - `fileId` (required): The ID of the file to send.
- **Responses:**
  - `200 OK`: Email sent successfully.
  - `400 Bad Request`: Missing or invalid parameters.
  - `401 Unauthorized`: Invalid or missing session token.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/admin/send-email', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer SESSON_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'recipient@example.com',
    fileId: 'file123'
  })
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "message": "Email sent successfully."
}
```

### User Routes

#### 1. Register

Register a new user.

- **URL:** `/user/register`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  - `username` (required): The username of the user.
  - `password` (required): The password of the user.
- **Responses:**
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Missing or invalid parameters.
  - `500 Internal Server

Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/user/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'user',
    password: 'securepassword'
  })
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "message": "User registered successfully."
}
```

#### 2. Login

Authenticate a user.

- **URL:** `/user/login`
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  - `username` (required): The username of the user.
  - `password` (required): The password of the user.
- **Responses:**
  - `200 OK`: Authentication successful.
  - `401 Unauthorized`: Invalid username or password.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/user/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'user',
    password: 'securepassword'
  })
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "data": {
    "fullname": "Admin User",
    "email": "LwXpE@example.com",
    "emailVerified": true,
    "authentication": {
      "session": {
        "token": "admin123",
        "expires": "2024-07-06T12:00:00Z"
      },
      "otp": {
        "code": "123456",
        "expires": "2024-07-06T12:00:00Z"
      },
      "password": "securepassword"
      //...other related fields
    }
  }
}
```

#### 3. Search File

Search for a file.

- **URL:** `/user/file/search/:query`
- **Method:** `GET`
- **Headers:**
  - `Authorization: Bearer SESSON_TOKEN`
- **Path Parameters:**
  - `query` (required): The search query.
- **Responses:**
  - `200 OK`: Files found successfully.
  - `401 Unauthorized`: Invalid or missing session token.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/user/file/search/example', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer SESSON_TOKEN'
  }
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "files": [
    {
      "id": "file123",
      "name": "example.txt",
      "url": "https://file-server-zr8t.onrender.com/files/file123",
      "created_at": "2024-07-06T12:00:00Z"
    }
  ]
}
```

#### 4. Send File via Email

Send a file via email.

- **URL:** `/user/send-email`
- **Method:** `POST`
- **Headers:**
  - `Authorization: Bearer SESSON_TOKEN`
  - `Content-Type: application/json`
- **Request Body:**
  - `email` (required): The recipient's email address.
  - `fileId` (required): The ID of the file to send.
- **Responses:**
  - `200 OK`: Email sent successfully.
  - `400 Bad Request`: Missing or invalid parameters.
  - `401 Unauthorized`: Invalid or missing session token.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/user/send-email', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer SESSON_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'recipient@example.com',
    fileId: 'file123'
  })
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "message": "Email sent successfully."
}
```

### Common Routes

#### 1. Download File

Download a file from the server.

- **URL:** `/file/download/:filename`
- **Method:** `GET`
- **Responses:**
  - `200 OK`: File downloaded successfully.
  - `404 Not Found`: File not found.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/file/download/example.txt', {
  method: 'GET'
})
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'example.txt';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
```

#### 2. Record Download

Record a file download request.

- **URL:** `/file/download/request/:fileId`
- **Method:** `GET`
- **Responses:**
  - `200 OK`: Download recorded successfully.
  - `404 Not Found`: File not found.
  - `500 Internal Server Error`: Server encountered an error.

**Example Request:**

```javascript
fetch('https://file-server-zr8t.onrender.com/file/download/request/file123', {
  method: 'GET'
})
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
```

**Example Response:**

```json
{
  "message": "Download recorded successfully."
}
```

## OpenAPI Specification

```yaml
openapi: 3.0.3
info:
  title: File Server API
  description: API for managing file uploads and downloads
  version: 1.0.0
servers:
  - url: https://file-server-zr8t.onrender.com
paths:
  /admin/register:
    post:
      summary: Register a new admin user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '201':
          description: Admin registered successfully
        '400':
          description: Missing or invalid parameters
        '500':
          description: Server encountered an error
  /admin/login:
    post:
      summary: Authenticate an admin user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
        '401':
          description: Invalid username or password
        '500':
          description: Server encountered an error
  /admin/file/upload/aws:
    post:
      summary: Upload a file to AWS S3
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
      responses:
        '200':
          description: File uploaded successfully
        '400':
          description: Missing file parameter
        '401':
          description: Invalid or missing API key
        '500':
          description: Server encountered an error
  /admin/file/upload/local:
    post:
      summary: Upload a file to the local server storage
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
      responses:
        '200':
          description: File uploaded successfully
        '400':
          description: Missing file parameter
        '401':
          description: Invalid or missing API key
        '500':
          description: Server encountered an error
  /admin/file/delete/{fileId}:
    delete:
      summary: Delete a file from the server
      parameters:
        - name: fileId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: File deleted successfully
        '401':
          description: Invalid or missing API key
        '404':
          description: File not found
        '500':
          description: Server encountered an error
  /admin/files:
    get:
      summary: List all files available on the server
      responses:
        '200':
          description: Files listed successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  files:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                        name:
                          type: string
                        url:
                          type: string
                        created_at:
                          type: string
                          format: date-time
        '401':
          description: Invalid or missing API key
        '500':
          description: Server encountered an error
  /admin/send-email:
    post:
      summary: Send a file via email
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                fileId:
                  type: string
      responses:
        '200':
          description: Email sent successfully
        '400':
          description: Missing or invalid parameters
        '401':
          description: Invalid or missing API key
        '500':
          description: Server encountered an error
  /user/register:
    post:
      summary: Register a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '201':
          description: User registered successfully
        '400':
          description: Missing or invalid parameters
        '500':
          description: Server encountered an error
  /user/login:
    post:
      summary: Authenticate a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                username:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Authentication successful
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
        '401':
          description: Invalid username or password
        '500':
          description: Server encountered an error
  /user/file/search/{query}:
    get:
      summary: Search for a file
      parameters:
        - name: query
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Files found successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  files:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                        name:
                          type: string
                        url:
                          type: string
                        created_at:
                          type: string
                          format: date-time
        '401':
          description: Invalid or missing API key
        '500':
          description: Server encountered an error
  /user/send-email:
    post:
      summary: Send a file via email
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                fileId:
                  type: string
      responses:
        '200':
          description: Email sent successfully
        '400':
          description: Missing or invalid parameters
        '401':
          description: Invalid or missing API key
        '500':
          description: Server encountered an error
  /file/download/{filename}:
    get:
      summary: Download a file from the server
      parameters:
        - name: filename
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: File downloaded successfully
        '404':
          description: File not found
        '500':
          description: Server encountered an error
  /file/download/request/{fileId}:
    get:
      summary: Record a file download request
      parameters:
        - name: fileId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Download recorded successfully
        '404':
          description: File not found
        '500':
          description: Server encountered an error
```

---

This documentation includes detailed routes for both admin and user functionalities, as well as a complete OpenAPI
specification for easy import into tools like Swagger and Postman. This structure ensures clarity and ease of use for
developers integrating with the File Server API.