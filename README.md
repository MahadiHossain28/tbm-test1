# User Import Service

## Project Description

This project provides a robust API endpoint for importing users from a spreadsheet file (e.g., `.xlsx`, `.csv`). It validates each row of the input file, imports the valid users into the system, and generates a detailed report for any rows that failed validation.

## Features

-   **Bulk User Import**: Import multiple users at once by uploading a file.
-   **Row-level Validation**: Each user record in the file is individually validated.
-   **Detailed Error Reporting**: If any records fail validation, an Excel file is generated containing the invalid rows and specific error messages.
-   **Success and Failure Responses**: The API provides clear JSON responses indicating the status of the import.

## API Endpoint

### Import Users

-   **URL**: `/api/users/import`
-   **Method**: `POST`
-   **Content-Type**: `multipart/form-data`

#### Request

The request must be a `multipart/form-data` request containing a single file field.

-   `file`: The spreadsheet file containing user data to import.

**Example `curl` request:**

```bash
curl -X POST http://your-domain.com/api/users/import \
-H "Content-Type: multipart/form-data" \
-F "file=@/path/to/your/users.xlsx"
```

#### Responses

**1. Successful Import (All users imported)**

If all users in the file are valid and imported successfully.

-   **Status Code**: `200 OK`
-   **Body**:
    ```json
    {
      "message": "All users imported successfully!"
    }
    ```

**2. Import with Validation Errors**

If some users in the file fail validation, valid users will still be imported. A report of the failed rows will be generated.

-   **Status Code**: `422 Unprocessable Entity`
-   **Body**:
    ```json
    {
      "message": "Import completed with some errors.",
      "failures": 5,
      "download_link": "http://your-domain.com/storage/import/users/imported_errors_1678886400.xlsx"
    }
    ```
    -   `failures`: The number of rows that failed validation.
    -   `download_link`: A URL to download the Excel file containing the details of the validation failures.

**3. Server Error**

If an unexpected error occurs during the import process.

-   **Status Code**: `500 Internal Server Error`
-   **Body**:
    ```json
    {
      "message": "An error occurred during import.",
      "error": "Error message details."
    }
    ```

## Error Reporting File

When validation failures occur, an Excel file is generated. This file includes the original data for the failed rows along with the reasons for the failure, making it easy to correct and re-upload the data.

The columns in the error report are:
- `row`: The original row number from the uploaded file.
- `name`: The name provided.
- `email`: The email address provided.
- `phone`: The phone number provided.
- `gender`: The gender provided.
- `errors`: A comma-separated list of validation errors for that row.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/MahadiHossain28/tbm-test1.git
    cd tbm-test1
    ```

2.  **Install dependencies:**
    ```bash
    composer install
    npm install
    ```

3.  **Create your environment file:**
    ```bash
    cp .env.example .env
    ```

4.  **Generate an application key:**
    ```bash
    php artisan key:generate
    ```

5.  **Configure your `.env` file** with your database credentials and other settings.

6.  **Run database migrations:**
    ```bash
    php artisan migrate
    ```

7.  **Create the public storage link:**
    ```bash
    php artisan storage:link
    ```
