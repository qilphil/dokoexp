# DokoExp - Installation and Usage Guide

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd dokoexp
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

4. Access the web interface at:
   ```
   http://localhost:3000
   ```

## Testing with Sample Data

The repository includes a sample database dump in JSON format. You can test the upload functionality with this sample data:

```
npm run test-upload
```

This will upload the sample data to the server and display a link to view the uploaded dump.

## API Usage

### Upload a Database Dump

#### Using JSON in Request Body

```
POST /api/upload
Content-Type: application/json

{
  "data": { ... your JSON data ... }
}
```

#### Using File Upload

```
POST /api/upload
Content-Type: multipart/form-data

file=@your-file.json
```

### Get All Dumps

```
GET /api/dumps
```

### Get a Specific Dump

```
GET /api/dumps/:id
```

## Database Structure

The server creates the following tables:

- `dumps` - Stores the complete JSON files with timestamps
- `spiel` - Stores game data
- `spielrunde` - Stores game round data
- `spieler` - Stores player data

Each table (except `dumps`) includes a reference to the dump ID for versioning.

## File Structure

- `server.js` - Main server file
- `db.js` - Database initialization and connection
- `views/` - EJS templates for the web interface
- `public/` - Static files (CSS, JavaScript)
- `data/` - SQLite database (created on first run)
- `uploads/` - Temporary storage for uploaded files 