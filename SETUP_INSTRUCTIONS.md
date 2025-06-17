# Setup Instructions for Face Shape Analysis Application

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Detailed Setup

### Prerequisites

- **Node.js**: Version 14 or higher
- **npm**: Comes with Node.js
- **Modern Browser**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+

### Step-by-Step Installation

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd face-shape-analysis-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install:
   - React and React DOM
   - Create React App build tools
   - Tailwind CSS and PostCSS
   - Testing libraries

3. **Verify Installation**
   ```bash
   npm run build
   ```
   This should complete without errors.

4. **Start Development Server**
   ```bash
   npm start
   ```

5. **Access the Application**
   - Open your browser
   - Navigate to `http://localhost:3000`
   - Wait for external libraries to load (OpenCV.js and Mediapipe)

## External Library Loading

The application loads two external libraries:

### OpenCV.js
- **Source**: `https://docs.opencv.org/4.8.0/opencv.js`
- **Purpose**: Image processing and manipulation
- **Loading Time**: 5-10 seconds on average connection

### Mediapipe FaceMesh
- **Source**: CDN from Google
- **Purpose**: Face detection and landmark extraction
- **Loading Time**: 3-5 seconds on average connection

### Library Status Indicators

The application shows real-time status of library loading:
- 🔴 **Red**: Library not loaded
- 🟢 **Green**: Library ready

## Testing the Application

### 1. Basic Functionality Test

1. **Upload an Image**
   - Click the upload area
   - Select a clear, front-facing photo
   - Ensure only one face is visible

2. **Process the Image**
   - Click "Analyze Face" button
   - Wait for processing (2-5 seconds)
   - Review results

### 2. Expected Results

After successful processing, you should see:

- **Face Shape**: Determined face shape with confidence level
- **Facial Measurements**: Detailed measurements in pixels
- **Hairstyle Recommendations**: Personalized suggestions
- **Visual Analysis**: Image with landmarks and measurement lines

### 3. Error Testing

Test error handling with:
- Images without faces
- Multiple faces in one image
- Non-image files
- Very large images (>10MB)

## Troubleshooting

### Common Issues

#### 1. Libraries Not Loading
**Symptoms**: Status indicators remain red
**Solutions**:
- Check internet connection
- Refresh the page
- Clear browser cache
- Try a different browser

#### 2. No Face Detected
**Symptoms**: Error message "No face detected"
**Solutions**:
- Use a clearer, front-facing photo
- Ensure good lighting
- Try a different image
- Check that only one face is visible

#### 3. Slow Processing
**Symptoms**: Processing takes more than 10 seconds
**Solutions**:
- Reduce image size
- Close other browser tabs
- Check device performance
- Use a smaller image file

#### 4. Canvas Not Displaying
**Symptoms**: No visual output after processing
**Solutions**:
- Check browser WebGL support
- Update browser to latest version
- Disable browser extensions
- Try incognito/private mode

### Browser-Specific Issues

#### Chrome
- Usually works best
- May need to enable WebGL in flags

#### Firefox
- Good compatibility
- May need to enable hardware acceleration

#### Safari
- Limited WebGL support on older versions
- Update to latest version

#### Edge
- Good compatibility with Chromium-based version
- Legacy Edge may have issues

## Performance Optimization

### For Better Performance

1. **Image Optimization**
   - Use images under 2MB
   - Resize large images before upload
   - Use JPEG format for photos

2. **Browser Optimization**
   - Close unnecessary tabs
   - Disable unnecessary extensions
   - Use hardware acceleration

3. **System Optimization**
   - Close other applications
   - Ensure adequate RAM (4GB+)
   - Use SSD for better I/O

## Development Notes

### File Structure
```
src/
├── components/
│   └── FaceAnalysis.js     # Main component
├── utils/
│   └── faceShapeUtils.js   # Analysis utilities
├── App.js                  # App wrapper
├── index.js               # Entry point
└── index.css              # Global styles
```

### Key Components

1. **FaceAnalysis.js**
   - Handles image upload
   - Manages processing state
   - Displays results

2. **faceShapeUtils.js**
   - Calculates measurements
   - Determines face shape
   - Provides recommendations

### Customization

#### Modifying Face Shape Logic
Edit `src/utils/faceShapeUtils.js`:
```javascript
// Adjust thresholds in determineFaceShape function
if (faceRatio > 1.75) // Change this value
```

#### Adding New Measurements
Edit `calculateFaceMeasurements` function:
```javascript
// Add new measurements
const newMeasurement = calculateDistance(landmarks[index1], landmarks[index2]);
```

#### Customizing UI
Edit `src/components/FaceAnalysis.js`:
- Modify styling classes
- Add new UI elements
- Change layout structure

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
1. **Netlify**: Drag and drop `build` folder
2. **Vercel**: Connect GitHub repository
3. **GitHub Pages**: Use `gh-pages` package
4. **AWS S3**: Upload `build` folder contents

### Environment Variables
No environment variables required for basic functionality.

## Security Considerations

- All processing happens locally
- No data is transmitted to external servers
- Images are not stored permanently
- No API keys required

## Support

For additional support:
1. Check the main README.md
2. Review browser console for errors
3. Test with different images
4. Verify library loading status 