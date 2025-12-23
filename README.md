

# Fleet Management System API Documentation

This document provides details on **authentication and user management API endpoints** for the Fleet Management System backend (Node.js, Express, MongoDB). It is intended for frontend developers to integrate securely with the backend services.

---

## **Base URL**

```
http://<your-backend-domain>/api
```

---

## **Authentication Endpoints**

### **1. Bootstrap Super Admin (One-time Setup)**

**POST** `/auth/bootstrap-super-admin`

* Creates the initial Super Admin account.
* Should only be used once during system setup.
* Requires a `bootstrapKey`.
* Returns success message with created Super Admin ID.
* Errors: Invalid bootstrap key, Super Admin already exists.

---

### **2. Login**

**POST** `/auth/login`

* Authenticate a user (all roles).
* Requires email and password.
* Returns access token and user information (ID, name, email, role).
* Errors: Missing fields, invalid credentials.

---

### **3. Logout**

**POST** `/auth/logout`

* Stateless logout.
* Client should remove JWT token after successful response.

---

### **4. Forgot Password**

**POST** `/auth/forgot-password`

* Generate a password reset token and send it via email.
* Requires a valid email address.
* Returns a message indicating that a password reset token has been sent.
* Errors: Invalid email, user not found.

---

### **5. Reset Password**

**POST** `/auth/reset-password`

* Reset password using the token received via email.
* Requires email, reset token, and new password.
* Returns a success message after password is updated.
* Errors: Invalid or expired reset token, invalid password.

---

## **User Management Endpoints**

> **Note:** All user endpoints require a valid JWT token in the `Authorization` header.

### **1. Create User**

**POST** `/user/`

* Accessible by **Super Admin** and **Admin** only.
* Admins can only create operators.
* Returns a message confirming user creation.
* Errors: Missing fields, unauthorized role, email already exists.

---

### **2. Update User**

**PUT** `/user/:id`

* Accessible by **Super Admin** and **Admin** (Admins can only update operators).
* Supports updating name, email, password, role, and active status.
* Errors: User not found, unauthorized role, cannot modify Super Admin.

---

### **3. Delete User**

**DELETE** `/user/:id`

* Accessible by **Super Admin** and **Admin** (Admins can only delete operators).
* Returns a message confirming deletion.
* Errors: User not found, unauthorized role, cannot delete Super Admin.

---

## **Middleware & Roles**

* **JWT Authentication:** Required for all `/user` endpoints.
* **Roles:**

  * `super_admin`: Full access
  * `admin`: Can manage operators
  * `operator`: Cannot manage users

---

## **Error Codes Summary**

| Code | Meaning                            |
| ---- | ---------------------------------- |
| 400  | Bad Request / Validation Error     |
| 401  | Unauthorized / Invalid credentials |
| 403  | Forbidden / Access denied          |
| 404  | Not Found                          |
| 409  | Conflict / Duplicate entry         |
| 500  | Internal Server Error              |

---

