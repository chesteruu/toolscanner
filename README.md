# Tool Inventory Management System

A RESTful API for managing tool inventory and tracking tool lending, featuring immediate QR code generation for easy tool identification and printing.

## Features

- Track tool inventory with detailed information
- Record tool lending and returns
- View complete lending history
- Immediate QR code generation upon tool creation
- Print-ready QR codes for physical tool labeling
- SQLite database for easy maintenance
- RESTful API design
- MVC architecture
- Docker support for easy deployment

## Tech Stack

- Python 3.12
- Flask
- SQLAlchemy
- QRCode
- SQLite
- Docker

## Project Structure

```
toolscanner/
├── app/
│   ├── config/         # Configuration settings
│   ├── controllers/    # Business logic
│   ├── database/       # Database setup
│   ├── models/         # Database models
│   ├── utils/          # Utility functions
│   └── views/          # Route definitions
├── app.py             # Application entry point
├── requirements.txt   # Project dependencies
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── README.md         # Project documentation
```

## Setup

### Option 1: Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd toolscanner
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python app.py
```

### Option 2: Docker Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd toolscanner
```

2. Build and run using Docker Compose:
```bash
docker-compose up --build
```

The server will start at `http://localhost:5000`

## Docker Commands

### Build and Start
```bash
docker-compose up --build
```

### Start in Background
```bash
docker-compose up -d
```

### Stop Containers
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Rebuild and Restart
```bash
docker-compose down
docker-compose up --build
```

## API Endpoints

### Tools

#### List All Tools
```http
GET /api/tools
```
Response:
```json
[
    {
        "id": 1,
        "name": "Hammer",
        "description": "Standard claw hammer",
        "status": "available",
        "created_at": "2024-03-20T10:00:00",
        "qr_code": "base64_encoded_qr_code",
        "print_ready": true
    }
]
```

#### Create New Tool
```http
POST /api/tools
Content-Type: application/json

{
    "name": "Hammer",
    "description": "Standard claw hammer"
}
```

Response:
```json
{
    "id": 1,
    "name": "Hammer",
    "description": "Standard claw hammer",
    "status": "available",
    "created_at": "2024-03-20T10:00:00",
    "qr_code": "base64_encoded_qr_code",
    "print_ready": true
}
```

#### Get Tool Details
```http
GET /api/tools/<tool_id>
```

#### Get Tool QR Code
```http
GET /api/tools/<tool_id>/qr
```
Response:
```json
{
    "tool_id": 1,
    "tool_name": "Hammer",
    "qr_code": "base64_encoded_qr_code",
    "print_ready": true
}
```

### Lending

#### Lend a Tool
```http
POST /api/tools/<tool_id>/lend
Content-Type: application/json

{
    "borrower_name": "John Doe",
    "notes": "For weekend project"
}
```

#### Return a Tool
```http
POST /api/tools/<tool_id>/return
```

#### View Lending Records
```http
GET /api/lending-records
```

## Example Usage

### Add a new tool
```bash
curl -X POST http://localhost:5000/api/tools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hammer",
    "description": "Standard claw hammer"
  }'
```

### Lend a tool
```bash
curl -X POST http://localhost:5000/api/tools/1/lend \
  -H "Content-Type: application/json" \
  -d '{"borrower_name": "John Doe", "notes": "For weekend project"}'
```

### Get tool QR code
```bash
curl http://localhost:5000/api/tools/1/qr
```

### Return a tool
```bash
curl -X POST http://localhost:5000/api/tools/1/return
```

## QR Code Usage

The system generates QR codes immediately when creating a tool. The QR codes are:
- Generated automatically upon tool creation
- Ready for immediate printing
- Stored in the database for future access
- Available through the API for reprinting

The QR code contains:
- Tool ID
- Tool Name

To print a QR code:
1. Create a new tool using the API
2. The response will include a base64-encoded QR code
3. Decode the base64 string to get the QR code image
4. Print the QR code and attach it to the physical tool

## Development

### Running Tests
```bash
# Add test commands here when tests are implemented
```

### Code Style
This project follows PEP 8 style guide for Python code.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Flask for the web framework
- SQLAlchemy for the ORM
- QRCode for QR code generation
- Docker for containerization 