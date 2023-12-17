# Google ClassRoom Backend


## Setup Procedure

1. **Clone the Repository:**
    ```bash
    git clone <repository-url>
    ```

2. **Install Dependencies:**
    ```bash
    cd <project-folder>
    npm install
    ```

3. **Environment Variables:**
    Create a `.env` file in the root directory with the following content:
    ```env
    PORT=5000
    DATABASE_URL=<your-mongodb-atlas-url>
    JWT_SECRET_KEY=<your-secret-key>
    ```

4. **Run the Application:**
    ```bash
    npm start
    ```

## Role-Based Scenario

### Teacher Role
- Teachers can create classes and assignments.
- Each class carries different number of assignments.
- Teachers can update and delete classes and assignments.
- Teachers can view their classes and assignments.
- Also assign marks to students based on assignment performance.

### Student Role
- Students can enroll and unenroll to classes.
- One Student can enroll different number of classes
- Students can see list of enroll classes
- Students can submit assignments.

## API Testing
The API can be tested using [Postman](https://documenter.getpostman.com/view/28691829/2s9Ykn8Mg5)

## Hosted API URL
The API is hosted at [https://your-hosted-api-url](https://classroom-backend-t65b.onrender.com).

