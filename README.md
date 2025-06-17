# Face Shape Detection and Analysis Application

A comprehensive web application built with ReactJS that analyzes facial features using OpenCV.js and Mediapipe FaceMesh to determine face shape and provide personalized hairstyle recommendations.

## Features

- **Face Detection**: Uses Mediapipe FaceMesh to detect 468 facial landmarks
- **Face Shape Analysis**: Determines face shape (Oval, Round, Square, Heart, Diamond, Oblong)
- **Facial Measurements**: Calculates detailed facial parameters including:
  - Face length and width
  - Cheekbone and jaw measurements
  - Eye distance and nose width
  - Key facial ratios
- **Hairstyle Recommendations**: Provides personalized hairstyle suggestions based on face shape
- **Visual Analysis**: Displays detected face with landmarks and measurement lines
- **Privacy-Focused**: All processing happens locally on the user's device

## Technical Stack

- **Frontend**: ReactJS 18.2.0
- **Styling**: Tailwind CSS 3.3.0
- **Image Processing**: OpenCV.js 4.8.0
- **Face Detection**: Mediapipe FaceMesh
- **Build Tool**: Create React App

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd face-shape-analysis-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
face-shape-analysis-app/
├── public/
│   ├── index.html          # Main HTML file with external library imports
│   └── manifest.json       # Web app manifest
├── src/
│   ├── components/
│   │   └── FaceAnalysis.js # Main component handling face analysis
│   ├── utils/
│   │   └── faceShapeUtils.js # Utility functions for analysis
│   ├── App.js              # Main app component
│   ├── index.js            # React entry point
│   └── index.css           # Global styles with Tailwind
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md              # This file
```

## How It Works

### 1. Face Detection Process

The application uses Mediapipe FaceMesh to detect facial landmarks:

1. **Image Upload**: User uploads an image (JPEG/PNG, max 10MB)
2. **Face Detection**: Mediapipe FaceMesh processes the image to detect faces
3. **Landmark Extraction**: 468 facial landmarks are extracted for precise analysis
4. **Validation**: Ensures only one face is detected for accurate analysis

### 2. Face Shape Determination

Face shape is determined using the following algorithm:

```javascript
// Key measurements used for classification:
- Face Ratio = Face Length / Face Width
- Jaw to Forehead Ratio = Jaw Width / Face Width  
- Cheekbone to Jaw Ratio = Cheekbone Width / Jaw Width

// Classification logic:
if (faceRatio > 1.75) → Oblong
else if (faceRatio < 1.3) {
  if (jawToForeheadRatio > 0.9) → Round
  else → Square
}
else if (cheekboneToJawRatio > 1.1) → Heart
else if (cheekboneToJawRatio > 1.05 && faceRatio > 1.4) → Diamond
else → Oval
```

### 3. Facial Measurements

The application calculates the following measurements:

- **Face Length**: Distance from forehead to chin
- **Face Width**: Distance between left and right jawline
- **Cheekbone Width**: Distance between left and right cheekbones
- **Jaw Width**: Width at the bottom of the face
- **Eye Distance**: Distance between inner eye corners
- **Nose Width**: Width of the nose at the nostrils

### 4. Hairstyle Recommendations

Recommendations are based on face shape characteristics:

- **Oval**: Most versatile, almost any style works
- **Round**: Styles that add height and length
- **Square**: Softening styles around the jawline
- **Heart**: Balance at the chin area
- **Diamond**: Balance narrow forehead and chin
- **Oblong**: Add width and break up length

## API Reference

### FaceAnalysis Component

Main component that handles the entire face analysis workflow.

#### Props
None (self-contained component)

#### State
- `selectedImage`: Base64 string of uploaded image
- `isProcessing`: Boolean indicating processing status
- `error`: Error message string
- `analysisResult`: Object containing analysis results
- `opencvReady`: Boolean indicating OpenCV.js loading status
- `mediapipeReady`: Boolean indicating Mediapipe loading status

#### Methods
- `handleImageUpload(event)`: Handles file upload
- `processImage()`: Processes the uploaded image
- `resetAnalysis()`: Resets the analysis state

### Utility Functions

#### `calculateFaceMeasurements(landmarks)`
Calculates facial measurements from Mediapipe landmarks.

**Parameters:**
- `landmarks`: Array of Mediapipe face landmarks

**Returns:**
- Object containing face measurements and ratios

#### `determineFaceShape(measurements)`
Determines face shape based on measurements.

**Parameters:**
- `measurements`: Object from calculateFaceMeasurements

**Returns:**
- Object with shape, confidence, and description

#### `getHairstyleRecommendations(faceShape)`
Returns hairstyle recommendations for a given face shape.

**Parameters:**
- `faceShape`: String representing face shape

**Returns:**
- Object with recommendations and styles to avoid

#### `drawLandmarks(canvas, landmarks, measurements, faceShape)`
Draws landmarks and measurements on canvas.

**Parameters:**
- `canvas`: HTML5 canvas element
- `landmarks`: Array of Mediapipe landmarks
- `measurements`: Face measurements object
- `faceShape`: Face shape object

## Error Handling

The application handles various error scenarios:

1. **No Face Detected**: Shows error message for images without faces
2. **Multiple Faces**: Warns when multiple faces are detected
3. **Invalid File Type**: Validates image file types
4. **File Size Limit**: Enforces 10MB file size limit
5. **Library Loading**: Shows loading status for external libraries
6. **Processing Errors**: Handles processing failures gracefully

## Browser Compatibility

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

## Performance Considerations

- **Image Size**: Large images are automatically scaled to canvas dimensions
- **Processing Time**: Typical processing takes 2-5 seconds on standard hardware
- **Memory Usage**: Images are processed locally and not stored
- **Library Loading**: External libraries are loaded asynchronously

## Privacy and Security

- **Local Processing**: All image processing happens in the browser
- **No Data Storage**: Images are not stored or transmitted
- **No External APIs**: No data is sent to external servers
- **Client-Side Only**: All analysis is performed locally

## Limitations

1. **Single Face**: Only supports single face analysis
2. **Image Quality**: Requires clear, well-lit front-facing photos
3. **Face Orientation**: Works best with front-facing faces
4. **Browser Support**: Requires modern browsers with WebGL support
5. **Processing Time**: May take several seconds for complex images

## Future Enhancements

1. **Multiple Face Support**: Analyze multiple faces in one image
2. **Real-time Analysis**: Webcam support for live analysis
3. **Advanced Measurements**: Additional facial feature measurements
4. **Hairstyle Visualization**: Show recommended hairstyles visually
5. **Export Results**: Save analysis results as PDF or image
6. **Mobile Optimization**: Better mobile device support
7. **Offline Support**: Service worker for offline functionality

## Troubleshooting

### Common Issues

1. **Libraries Not Loading**
   - Check internet connection
   - Refresh the page
   - Clear browser cache

2. **No Face Detected**
   - Ensure image has a clear, front-facing face
   - Check lighting conditions
   - Try a different image

3. **Slow Processing**
   - Reduce image size
   - Close other browser tabs
   - Check device performance

4. **Canvas Not Displaying**
   - Check browser WebGL support
   - Update browser to latest version
   - Disable browser extensions

### Debug Mode

Enable debug mode by opening browser console and setting:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Mediapipe**: For the FaceMesh face detection technology
- **OpenCV.js**: For image processing capabilities
- **ReactJS**: For the frontend framework
- **Tailwind CSS**: For the styling framework

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review browser compatibility requirements 