

# Fleet Management System (Backend) – Overview

This backend system manages trucks, drivers, and driver-to-truck assignments. It is built with **Node.js, Express, and MongoDB** and designed with **enterprise best practices** including modular architecture, role-based access control, audit tracking, and data integrity.

---

## **1. Data Modeling**

You defined two main entities: **Truck** and **Driver**.

* **Truck model** includes key fields such as `plateNumber`, `model`, `capacity`, `status`, and an array of `assignedDrivers`. It tracks the lifecycle of a truck and links it to multiple drivers, supporting scenarios like co-drivers or shifts. It also has audit fields (`createdBy`, `updatedBy`) to maintain accountability on who creates or modifies truck records.

* **Driver model** stores driver-specific information such as `name`, `phone`, `licenseNumber`, and `salaryType`. Drivers also have a `status` field to indicate availability and a list of `assignedTrucks` to represent a many-to-many relationship with trucks. Similarly, audit fields track who performed modifications.

These schemas enforce **data integrity** (unique license numbers for drivers, unique plate numbers for trucks) and implement **business rules** through enumerations for status fields.

---

## **2. Controllers**

The **TruckController** and **DriverController** handle all business logic for trucks and drivers.

* **TruckController:** Handles creating, updating, deleting, and fetching trucks. It also implements driver assignment using the **AssignmentService**, which encapsulates rules for assigning a driver to a truck.
* **DriverController:** Handles similar CRUD operations for drivers and ensures that truck-driver relationships are correctly populated when retrieving data.

Both controllers use `req.user.id` to log **audit information**, ensuring traceability of all operations.

---

## **3. Assignment Service**

The **AssignmentService** encapsulates the logic for assigning drivers to trucks. It enforces these business rules:

* A driver must be **available**.
* A truck must be **available**.
* A driver cannot be assigned to the same truck twice.

Once the checks pass, the service updates both the truck and driver documents in the database, updating statuses (`in-use` for trucks, `assigned` for drivers) and maintaining an **audit trail** of who performed the assignment. This separation of concerns ensures maintainability and consistent application of business rules.

---

## **4. Routes and Role-Based Access Control**

All routes are protected via authentication middleware, with **role-based authorization** for sensitive operations:

* Only users with roles **superadmin** or **admin** can create, update, delete, or assign trucks and drivers.
* Regular authenticated users can view trucks and drivers but cannot modify them.

### **Truck Routes**

| Method | Endpoint                    | Role             | Description                                  |
| ------ | --------------------------- | ---------------- | -------------------------------------------- |
| POST   | `/trucks`                   | superadmin/admin | Create a new truck                           |
| GET    | `/trucks`                   | Authenticated    | Retrieve all trucks (optional status filter) |
| GET    | `/trucks/:id`               | Authenticated    | Retrieve truck by ID                         |
| PUT    | `/trucks/:id`               | superadmin/admin | Update truck details                         |
| DELETE | `/trucks/:id`               | superadmin       | Delete a truck                               |
| POST   | `/trucks/:id/assign-driver` | superadmin/admin | Assign a driver to a truck                   |

### **Driver Routes**

| Method | Endpoint       | Role             | Description                                   |
| ------ | -------------- | ---------------- | --------------------------------------------- |
| POST   | `/drivers`     | superadmin/admin | Create a new driver                           |
| GET    | `/drivers`     | Authenticated    | Retrieve all drivers (optional status filter) |
| GET    | `/drivers/:id` | Authenticated    | Retrieve driver by ID                         |
| PUT    | `/drivers/:id` | superadmin/admin | Update driver details                         |
| DELETE | `/drivers/:id` | superadmin/admin | Delete a driver                               |

---

## **5. Overall Design and Features**

This system provides:

* **CRUD operations** for trucks and drivers with proper error handling.
* **Many-to-many relationship management** between trucks and drivers.
* **Business rule enforcement** for driver assignments.
* **Audit trails** to track who created or updated records.
* **Role-based security** to protect sensitive operations.
* **Populated relational data** when fetching records, simplifying front-end integration.

Overall, this design results in a **robust, enterprise-ready backend** for fleet management, emphasizing **data integrity, security, maintainability, and clear separation of business logic**.

---

If you want, I can now **turn this into a clean README.md file** ready to drop into your project, fully formatted with sections, tables, and professional style.

Do you want me to do that?
