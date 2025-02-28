# DokoExp - Doppelkopf Game Data Explorer

A Node.js Express application for uploading, storing, and exploring Doppelkopf game data.

## Features

- Upload JSON data directly via API or file upload
- View uploaded game data through a web interface
- RESTful API for programmatic access to game data
- Stores data in SQLite database for easy querying

## Project Structure

```
dokoexp/
├── config/                 # Configuration files
│   └── upload.js           # Multer upload configuration
├── controllers/            # Controller logic
│   ├── apiController.js    # API endpoint handlers
│   └── webController.js    # Web interface handlers
├── public/                 # Static assets
│   └── wwwroot/
│       ├── css/            # CSS stylesheets
│       └── js/             # JavaScript files
├── routes/                 # Route definitions
│   ├── apiRoutes.js        # API routes
│   └── webRoutes.js        # Web interface routes
├── uploads/                # Uploaded files storage
├── views/                  # EJS templates
│   ├── dump.ejs            # Dump details view
│   ├── error.ejs           # Error page
│   └── index.ejs           # Home page
├── db.js                   # Database configuration
├── server.js               # Main application entry point
└── README.md               # Project documentation
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```

## API Usage

### Upload JSON Data

```
POST /api/upload
Content-Type: application/json

{
  "Spiel": [...],
  "Spielrunde": [...],
  "Spieler": [...]
}
```

### Upload JSON File

```
POST /api/upload/file
Content-Type: multipart/form-data

file: [JSON file]
```

### Get All Dumps

```
GET /api/dumps
```

### Get Specific Dump

```
GET /api/dumps/:id
```

## Database Structure

The application uses SQLite with the following tables:

- `dumps`: Stores metadata and raw content of uploaded dumps
- `spiel`: Game data extracted from dumps
- `spielrunde`: Game round data extracted from dumps
- `spieler`: Player data extracted from dumps

## Development

### VS Code Debugging

Launch configuration for VS Code:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server.js"
    }
  ]
}
``` 