# API Integration Documentation

## Overview

The frontend has been integrated with the GeniQ backend API to provide real data generation capabilities. The integration includes:

- **Tabular Data Generation**: Create structured datasets with custom columns
- **Q&A Pairs Generation**: Generate conversational data for AI training
- **Feedback System**: Submit and track user feedback
- **File Downloads**: Download generated datasets in CSV/JSON format

## CORS Configuration ✅

The backend has been configured with CORS middleware to allow access from everywhere:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)
```

This resolves the CORS error: `CORS header 'Access-Control-Allow-Origin' missing`.

## API Endpoints

### Backend Server
- **URL**: `http://localhost:8001`
- **Protocol**: HTTP/HTTPS
- **Content-Type**: `application/json`

### Available Endpoints

#### 1. Health Check
```
GET /
```

**Response:**
```json
{
  "status": "healthy",
  "message": "GeniQ API server is running",
  "version": "1.0.0"
}
```

#### 2. Generate Tabular Data
```
POST /generate/tabular
```

**Request Body:**
```json
{
  "columns": [
    {
      "name": "User ID",
      "dtype": "int",
      "description": "Unique user identifier",
      "validation": "",
      "options": []
    }
  ],
  "num_rows": 1000,
  "description": "Customer dataset",
  "use_case": "Customer analytics",
  "output_format": "csv"
}
```

**Response:** File download (CSV or JSON)

#### 3. Generate Q&A Pairs
```
POST /generate/qa
```

**Request Body:**
```json
{
  "domain": "healthcare",
  "complexity": "intermediate",
  "num_pairs": 50,
  "context": "Medical diagnosis questions",
  "constraints": "Medical accuracy, Evidence-based"
}
```

**Response:** File download (JSON)

#### 4. Submit Feedback
```
POST /submit-feedback
```

**Request Body:**
```json
{
  "dataset_id": "feedback_1234567890",
  "rating": 5,
  "comments": "Great tool!",
  "improvements": ["Better UI", "More formats"]
}
```

#### 5. Get Feedback Report
```
GET /feedback-report
```

## Frontend Integration

### API Service (`src/lib/api.ts`)

The frontend uses a centralized API service that handles:

- **Request/Response handling**
- **Error management**
- **File downloads**
- **Type safety**

### Key Features

1. **Type Safety**: Full TypeScript interfaces for all API requests/responses
2. **Error Handling**: Comprehensive error handling with user-friendly messages
3. **Progress Tracking**: Real-time progress updates during generation
4. **File Downloads**: Automatic file download handling
5. **Toast Notifications**: User feedback for all operations

### Usage Examples

#### Tabular Data Generation
```typescript
import { apiService } from '@/lib/api';

const request = {
  columns: [
    { name: 'ID', dtype: 'int', description: 'Unique ID' },
    { name: 'Email', dtype: 'str', description: 'User email' }
  ],
  num_rows: 1000,
  description: 'User dataset',
  use_case: 'User analytics',
  output_format: 'csv'
};

const response = await apiService.generateTabularData(request);
if (response.success) {
  apiService.downloadFile(response.downloadUrl!, 'dataset.csv');
}
```

#### Q&A Generation
```typescript
const qaRequest = {
  domain: 'healthcare',
  complexity: 'intermediate',
  num_pairs: 50,
  context: 'Medical diagnosis',
  constraints: 'Medical accuracy'
};

const response = await apiService.generateQAPairs(qaRequest);
```

## Setup Instructions

### 1. Start Backend Server
```bash
# From the services directory
cd services
python main.py

# Or from the app directory (if you have the start script)
npm run backend
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

### 3. Test API Connection
```bash
# Run the test script to verify connection
node test-api.js
```

### 4. Verify Connection
- Backend should be running on `http://localhost:8001`
- Frontend should be running on `http://localhost:5173`
- Check browser console for any connection errors
- Visit `http://localhost:8001/` to see the health check

## Error Handling

The API service includes comprehensive error handling:

- **Network errors**: Connection timeout, server unavailable
- **Validation errors**: Invalid request parameters
- **Server errors**: Backend processing failures
- **File download errors**: Download failures
- **CORS errors**: Cross-origin request issues (now resolved)

All errors are displayed to users via toast notifications.

## Data Types

### Column Types
- `int`: Integer values
- `float`: Decimal numbers
- `str`: Text strings
- `bool`: Boolean values
- `datetime`: Date/time values

### Complexity Levels
- `beginner`: Basic concepts and terminology
- `intermediate`: Technical depth and detailed explanations
- `advanced`: Expert-level content and complex scenarios

### Domains
- `healthcare`: Medical and health-related content
- `finance`: Financial and banking content
- `education`: Educational and academic content
- `business`: Business and corporate content

## Security Features

- **Input Validation**: All user inputs are validated
- **Error Sanitization**: Error messages are sanitized for security
- **File Type Validation**: Only allowed file types are processed
- **Rate Limiting**: Backend implements rate limiting (if configured)
- **CORS Configuration**: Properly configured for cross-origin requests

## Performance Considerations

- **Progress Simulation**: Frontend shows realistic progress during generation
- **File Size Limits**: Backend enforces maximum file sizes
- **Memory Management**: Large datasets are streamed to prevent memory issues
- **Caching**: Generated files are cached for quick re-downloads

## Troubleshooting

### Common Issues

1. **CORS errors** ✅ **FIXED**
   - Backend now includes CORS middleware
   - All origins are allowed
   - Check browser console for any remaining CORS issues

2. **Backend not starting**
   - Check Python installation
   - Verify dependencies: `pip install -r requirements.txt`
   - Check port 8001 availability

3. **File download issues**
   - Check browser download settings
   - Verify file permissions
   - Check available disk space

4. **Generation timeouts**
   - Reduce dataset size (now limited to 5-50 rows for testing)
   - Check backend performance
   - Verify network connectivity

5. **405 Method Not Allowed**
   - Ensure you're using POST for generation endpoints
   - Check request headers include `Content-Type: application/json`

### Debug Mode

Enable debug logging in the backend:
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Testing API Connection

Use the provided test script:
```bash
node test-api.js
```

This will test:
- Health check endpoint
- CORS preflight requests
- Tabular generation endpoint

## Future Enhancements

- **Real-time progress**: WebSocket integration for live progress updates
- **Batch processing**: Support for multiple dataset generation
- **Advanced validation**: More sophisticated input validation
- **Caching layer**: Client-side caching for better performance
- **Offline support**: Service worker for offline functionality 