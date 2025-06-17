// Face shape analysis utilities

// Mediapipe FaceMesh landmark indices
export const FACE_LANDMARKS = {
  // Face outline
  FACE_OVAL: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
  
  // Eyes
  LEFT_EYE: [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398],
  RIGHT_EYE: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
  
  // Eyebrows
  LEFT_EYEBROW: [70, 63, 105, 66, 107, 55, 65, 52, 53, 46, 49, 115, 120, 121, 122],
  RIGHT_EYEBROW: [300, 293, 334, 296, 336, 285, 295, 282, 283, 276, 279, 344, 349, 350, 351],
  
  // Nose
  NOSE: [1, 2, 98, 327, 294, 278, 360, 330, 250, 290, 305, 289, 392, 305, 290, 250, 330, 360, 278, 294, 327, 98, 2, 1],
  
  // Mouth
  MOUTH: [61, 84, 17, 314, 405, 320, 307, 375, 321, 308, 324, 318, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 78, 191, 80, 81, 82, 13, 312, 311, 310, 415],
  
  // Jawline - Enhanced with more precise points
  JAWLINE: [132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58],
  
  // Cheekbones
  LEFT_CHEEKBONE: [123, 50, 36, 137, 0, 12, 72, 11, 38, 20, 151, 9, 8, 168, 6, 197, 93, 46, 53, 52, 65],
  RIGHT_CHEEKBONE: [352, 280, 330, 277, 329, 350, 349, 347, 348, 346, 345, 344, 343, 342, 341, 340, 339, 338, 337, 336, 335],
  
  // Forehead
  FOREHEAD: [10, 151, 9, 8, 168, 6, 197, 93, 46, 53, 52, 65, 123, 50, 36, 137, 0, 12, 72, 11, 38, 20],
  
  // Chin - Enhanced with multiple points for better analysis
  CHIN_TIP: [152], // Tip of chin
  CHIN_CENTER: [175], // Center of chin area
  JAW_MID_LEFT: [93], // Mid left jaw
  JAW_MID_RIGHT: [323] // Mid right jaw
};

// Calculate distance between two points
export const calculateDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Calculate angle between three points
export const calculateAngle = (point1, point2, point3) => {
  const a = calculateDistance(point1, point2);
  const b = calculateDistance(point2, point3);
  const c = calculateDistance(point1, point3);
  
  if (a === 0 || b === 0) return 0;
  
  const cosAngle = (a * a + b * b - c * c) / (2 * a * b);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
};

// Calculate face measurements with enhanced precision
export const calculateFaceMeasurements = (landmarks) => {
  if (!landmarks || landmarks.length === 0) {
    return null;
  }

  // Face length (forehead to chin)
  const foreheadPoint = landmarks[10]; // Top of forehead
  const chinPoint = landmarks[152]; // Bottom of chin
  const faceLength = calculateDistance(foreheadPoint, chinPoint);

  // Face width (left to right jawline)
  const leftJaw = landmarks[132]; // Left jaw
  const rightJaw = landmarks[361]; // Right jaw
  const faceWidth = calculateDistance(leftJaw, rightJaw);

  // Cheekbone width
  const leftCheekbone = landmarks[123]; // Left cheekbone
  const rightCheekbone = landmarks[352]; // Right cheekbone
  const cheekboneWidth = calculateDistance(leftCheekbone, rightCheekbone);

  // Enhanced jaw analysis
  const leftJawBottom = landmarks[58]; // Left bottom jaw
  const rightJawBottom = landmarks[288]; // Right bottom jaw
  const jawWidth = calculateDistance(leftJawBottom, rightJawBottom);
  
  // Jaw angle analysis
  const leftJawMid = landmarks[93]; // Mid left jaw
  const rightJawMid = landmarks[323]; // Mid right jaw
  const jawMidWidth = calculateDistance(leftJawMid, rightJawMid);
  
  // Chin analysis - multiple measurements
  const chinTip = landmarks[152]; // Tip of chin
  const chinLeft = landmarks[132]; // Left chin
  const chinRight = landmarks[361]; // Right chin
  const chinBottomLeft = landmarks[58]; // Bottom left chin
  const chinBottomRight = landmarks[288]; // Bottom right chin
  
  // Chin width at different levels
  const chinTopWidth = calculateDistance(chinLeft, chinRight);
  const chinBottomWidth = calculateDistance(chinBottomLeft, chinBottomRight);
  const chinMidWidth = calculateDistance(leftJawMid, rightJawMid);
  
  // Chin shape analysis
  const chinAngle = calculateAngle(chinLeft, chinTip, chinRight);
  // Corrected jaw angle landmarks: Jaw angle point, bottom jaw point, chin tip
  const leftJawAngle = calculateAngle(landmarks[132], landmarks[58], landmarks[152]); 
  const rightJawAngle = calculateAngle(landmarks[361], landmarks[288], landmarks[152]);
  
  // Chin projection (how far chin extends forward)
  const chinProjection = Math.abs(chinTip.y - (chinLeft.y + chinRight.y) / 2);

  // Eye distance
  const leftEyeInner = landmarks[362]; // Left eye inner corner
  const rightEyeInner = landmarks[33]; // Right eye inner corner
  const eyeDistance = calculateDistance(leftEyeInner, rightEyeInner);

  // Nose width
  const leftNostril = landmarks[129]; // Left nostril
  const rightNostril = landmarks[358]; // Right nostril
  const noseWidth = calculateDistance(leftNostril, rightNostril);

  // Additional measurements for better accuracy
  // Forehead width (at eyebrow level)
  const leftEyebrow = landmarks[70]; // Left eyebrow
  const rightEyebrow = landmarks[300]; // Right eyebrow
  const foreheadWidth = calculateDistance(leftEyebrow, rightEyebrow);

  // Calculate enhanced ratios
  const faceRatio = faceLength / faceWidth;
  const jawToForeheadRatio = jawWidth / faceWidth;
  const cheekboneToJawRatio = cheekboneWidth / jawWidth;
  const foreheadToCheekboneRatio = foreheadWidth / cheekboneWidth;
  
  // Enhanced chin ratios
  const chinTopToBottomRatio = chinTopWidth / chinBottomWidth;
  const chinToJawRatio = chinTopWidth / jawWidth;
  const chinMidToJawRatio = chinMidWidth / jawWidth;
  const chinAngleRatio = chinAngle / 180; // Normalize angle
  const jawAngleRatio = (leftJawAngle + rightJawAngle) / 360; // Average jaw angles
  
  const eyeToFaceRatio = eyeDistance / faceWidth;

  return {
    faceLength,
    faceWidth,
    cheekboneWidth,
    jawWidth,
    jawMidWidth,
    eyeDistance,
    noseWidth,
    foreheadWidth,
    
    // Enhanced chin measurements
    chinTopWidth,
    chinBottomWidth,
    chinMidWidth,
    chinAngle,
    leftJawAngle,
    rightJawAngle,
    chinProjection,
    
    // Ratios
    faceRatio,
    jawToForeheadRatio,
    cheekboneToJawRatio,
    foreheadToCheekboneRatio,
    chinTopToBottomRatio,
    chinToJawRatio,
    chinMidToJawRatio,
    chinAngleRatio,
    jawAngleRatio,
    eyeToFaceRatio
  };
};

// Determine face shape based on measurements using a scoring system
export const determineFaceShape = (measurements) => {
  if (!measurements) {
    return { shape: 'Unknown', confidence: 0 };
  }

  const {
    faceRatio, // Length/Width
    jawToForeheadRatio, // Jaw width / Face width (used instead of forehead width for simplicity)
    cheekboneToJawRatio, // Cheekbone width / Jaw width
    foreheadToCheekboneRatio, // Forehead width / Cheekbone width
    chinTopToBottomRatio, // Chin top width / Chin bottom width
    chinAngleRatio, // Chin angle normalized (pointed vs rounded)
    jawAngleRatio, // Jaw angle normalized (sharp vs soft)
    eyeToFaceRatio, // Eye distance / Face width
    chinProjection // Added chinProjection for use in shape determination
  } = measurements;

  const scores = {
    Oval: 0,
    Round: 0,
    Square: 0,
    Heart: 0,
    Diamond: 0,
    Oblong: 0,
  };

  // Oval face scoring (balanced)
  if (faceRatio >= 1.3 && faceRatio <= 1.5 && 
      jawToForeheadRatio >= 0.8 && jawToForeheadRatio <= 1.0 && 
      cheekboneToJawRatio >= 0.9 && cheekboneToJawRatio <= 1.1) {
    scores.Oval += 0.9;
  } else if (faceRatio >= 1.25 && faceRatio <= 1.55) {
    scores.Oval += 0.6;
  }
  // Additional oval indicators (general balance)
  if (Math.abs(foreheadToCheekboneRatio - 1) < 0.1) {
    scores.Oval += 0.1;
  }

  // Round face scoring
  if (faceRatio >= 0.9 && faceRatio <= 1.1 && 
      jawToForeheadRatio >= 0.9 && jawToForeheadRatio <= 1.1 && 
      cheekboneToJawRatio >= 0.9 && cheekboneToJawRatio <= 1.1) {
    scores.Round += 0.9;
  } else if (faceRatio < 1.2 && faceRatio > 0.8 &&
             jawToForeheadRatio >= 0.8 && jawToForeheadRatio <= 1.2) {
    scores.Round += 0.6;
  }
  // Additional round indicators
  if (chinAngleRatio > 0.6) { // Softer chin angle
    scores.Round += 0.2;
  }
  if (jawAngleRatio > 0.6) { // Softer jaw angle
    scores.Round += 0.2;
  }

  // Square face scoring
  if (faceRatio >= 0.9 && faceRatio <= 1.1 && 
      jawToForeheadRatio >= 1.0 && jawToForeheadRatio <= 1.2 && 
      cheekboneToJawRatio >= 0.9 && cheekboneToJawRatio <= 1.1) {
    scores.Square += 0.9;
  } else if (faceRatio < 1.2 && faceRatio > 0.8 &&
             jawToForeheadRatio >= 0.9 && jawToForeheadRatio <= 1.3) {
    scores.Square += 0.6;
  }
  // Additional square indicators
  if (jawAngleRatio < 0.4) { // Sharper jaw angle
    scores.Square += 0.2;
  }
  if (chinTopToBottomRatio >= 0.9) { // Less tapering chin
    scores.Square += 0.1;
  }

  // Heart face scoring
  if (foreheadToCheekboneRatio >= 1.1 && foreheadToCheekboneRatio <= 1.3 &&
      jawToForeheadRatio >= 0.7 && jawToForeheadRatio <= 0.9 &&
      chinAngleRatio < 0.5) { // More pointed chin
    scores.Heart += 0.9;
  } else if (foreheadToCheekboneRatio >= 1.05 && foreheadToCheekboneRatio <= 1.4 &&
             jawToForeheadRatio >= 0.6 && jawToForeheadRatio <= 1.0) {
    scores.Heart += 0.6;
  }

  // Additional heart indicators
  if (jawToForeheadRatio < 0.7) { // Narrow jaw compared to forehead
    scores.Heart += 0.2;
  }
  if (chinAngleRatio < 0.3) { // Pointed chin
    scores.Heart += 0.2;
  }

  // Diamond face scoring
  if (foreheadToCheekboneRatio >= 0.7 && foreheadToCheekboneRatio <= 0.9 &&
      cheekboneToJawRatio >= 1.1 && cheekboneToJawRatio <= 1.3 &&
      chinAngleRatio < 0.5) { // Narrow forehead, wide cheekbones, pointed chin
    scores.Diamond += 0.9;
  } else if (foreheadToCheekboneRatio >= 0.6 && foreheadToCheekboneRatio <= 1.0 &&
             cheekboneToJawRatio >= 1.05 && cheekboneToJawRatio <= 1.4) {
    scores.Diamond += 0.6;
  }
  // Additional diamond indicators
  if (eyeToFaceRatio < 0.25) { // Eyes might be closer together relative to face width
    scores.Diamond += 0.1;
  }

  // Oblong face scoring (longer than oval, similar width ratios)
  if (faceRatio > 1.5 && faceRatio <= 1.8 &&
      jawToForeheadRatio >= 0.8 && jawToForeheadRatio <= 1.0 &&
      cheekboneToJawRatio >= 0.9 && cheekboneToJawRatio <= 1.1) {
    scores.Oblong += 0.9;
  } else if (faceRatio > 1.4 && faceRatio <= 1.9) {
    scores.Oblong += 0.6;
  }
  // Additional oblong indicators
  if (chinProjection > 10) { // More prominent chin
    scores.Oblong += 0.1;
  }

  // Determine best shape and second best shape
  let bestShape = 'Unknown';
  let bestScore = 0;
  let secondBestShape = null;
  let secondBestScore = 0;

  for (const shape in scores) {
    if (scores[shape] > bestScore) {
      secondBestScore = bestScore; // Move current best to second best
      secondBestShape = bestShape;
      bestScore = scores[shape];
      bestShape = shape;
    } else if (scores[shape] > secondBestScore && shape !== bestShape) {
      secondBestScore = scores[shape];
      secondBestShape = shape;
    }
  }
  
  // Calculate score difference for confidence adjustment
  const scoreDiff = bestScore - secondBestScore;

  // Calculate confidence based on score
  let confidence = 0;
  if (bestScore >= 1.0) {
    confidence = 95; // High confidence for strong matches
  } else if (bestScore >= 0.8) {
    confidence = 90;
  } else if (bestScore >= 0.6) {
    confidence = 85;
  } else if (bestScore >= 0.4) {
    confidence = 75;
  } else {
    confidence = 60; // Default lower confidence
  }

  // Adjust confidence based on score difference (if scores are very close, reduce confidence)
  if (scoreDiff < 0.1 && secondBestShape) {
    confidence *= 0.8; // Reduce confidence by 20% if scores are very close
  } else if (scoreDiff < 0.2 && secondBestShape) {
    confidence *= 0.9; // Reduce confidence by 10%
  }

  // Calculate and adjust confidence based on measurement quality
  const measurementQuality = calculateMeasurementQuality(measurements);
  confidence *= measurementQuality; // Scale confidence by quality (e.g., 0.8 to 1.0)

  // Ensure confidence is within a reasonable range
  confidence = Math.max(50, Math.min(95, confidence));

  return {
    shape: bestShape,
    confidence: parseFloat(confidence.toFixed(1)),
    scores,
    secondBestShape,
    scoreDiff: parseFloat(scoreDiff.toFixed(2)),
    quality: parseFloat(measurementQuality.toFixed(2)),
  };
};

// Determine measurement quality based on extreme values (indicates potential detection issues)
const calculateMeasurementQuality = (measurements) => {
  if (!measurements) return 0.5; // Return lower quality if no measurements

  const { 
    faceLength, 
    faceWidth, 
    cheekboneWidth, 
    jawWidth, 
    chinTopWidth,
    eyeDistance,
    noseWidth
  } = measurements;

  // Simple checks for extreme values (adjust thresholds as needed)
  let qualityScore = 1.0; // Start with perfect quality

  // Check for very small or very large ratios
  if (faceLength / faceWidth < 1.1 || faceLength / faceWidth > 1.9) qualityScore -= 0.1; // Very round or very long
  if (cheekboneWidth / faceWidth < 0.7 || cheekboneWidth / faceWidth > 1.1) qualityScore -= 0.1; // Very narrow or very wide cheekbones
  if (jawWidth / faceWidth < 0.6 || jawWidth / faceWidth > 1.1) qualityScore -= 0.1; // Very narrow or very wide jaw
  if (chinTopWidth / jawWidth < 0.7 || chinTopWidth / jawWidth > 1.1) qualityScore -= 0.1; // Very pointed or very wide chin
  if (eyeDistance / faceWidth < 0.2 || eyeDistance / faceWidth > 0.5) qualityScore -= 0.1; // Very close or very wide set eyes
  if (noseWidth / faceWidth < 0.1 || noseWidth / faceWidth > 0.3) qualityScore -= 0.1; // Very narrow or very wide nose

  // Ensure quality score is within a valid range
  return Math.max(0.7, Math.min(1.0, qualityScore));
};

// Get hairstyle recommendations based on face shape
export const getHairstyleRecommendations = (faceShape) => {
  switch (faceShape) {
    case 'Oval':
      return {
        short: 'Bob cut, Pixie cut, Lob (long bob)',
        medium: 'Layered shoulder-length, Shag, Face-framing layers',
        long: 'Long layers, Beach waves, Straight with minimal layers',
        description: 'An oval face is well-proportioned and symmetrical, allowing for almost any hairstyle. It\'s versatile, so feel free to experiment!'
      };
    case 'Round':
      return {
        short: 'Asymmetrical bob, Pixie with height, Side-swept bangs',
        medium: 'Lob with layers, Shoulder-length with soft waves, Graduated bob',
        long: 'Long layers, Straight hair to elongate, High ponytails or buns',
        description: 'A round face often has similar length and width with soft, curved features. Aim for styles that add height and create angles to elongate the face.'
      };
    case 'Square':
      return {
        short: 'Soft pixie, Layered bob (to jawline), Side-parted styles',
        medium: 'Wavy lob, Shoulder-length with soft layers, Curtain bangs',
        long: 'Long waves, Layered cuts, Rounder styles to soften angular features',
        description: 'A square face has a strong, angular jawline and a broad forehead. Choose styles that soften these features and add balance, such as soft layers and waves.'
      };
    case 'Heart':
      return {
        short: 'Pixie with volume at top, Chin-length bob, Side-swept bangs',
        medium: 'Collarbone-length with waves, Lob with layers starting below chin, Long bangs',
        long: 'Long layers, Deep side part, Styles that add width around the jawline',
        description: 'A heart-shaped face has a wider forehead and cheekbones, tapering to a narrower, sometimes pointed, chin. Styles that balance the wider top with the narrower bottom are ideal.'
      };
    case 'Diamond':
      return {
        short: 'Chin-length bob, Pixie with side bangs, Tucked behind ears',
        medium: 'Shoulder-length with layers, Waves that add volume at jawline, Deep side part',
        long: 'Long layers with volume at chin, Half-up styles, Sweeping bangs',
        description: 'A diamond face features wide cheekbones with a narrower forehead and jawline. Styles that soften the cheekbones and add width to the forehead and jaw are flattering.'
      };
    case 'Oblong':
      return {
        short: 'Chin-length bob, Curly bob, Blunt bangs',
        medium: 'Shoulder-length waves, Layered cuts that add volume to the sides, Full bangs',
        long: 'Long layers with volume at the sides, Beach waves, Styles that create horizontal interest',
        description: 'An oblong face is longer than it is wide, often with a straight and narrow jawline. Styles that add width and soften the length are most complementary.'
      };
    default:
      return {
        short: 'Consult a stylist',
        medium: 'Consult a stylist',
        long: 'Consult a stylist',
        description: 'Unable to determine specific recommendations. Please consult a professional stylist.'
      };
  }
};

// Draw landmarks on canvas with measurements
export const drawLandmarks = (ctx, landmarks, canvas, faceShape, measurements, confidence, secondBestShape, scoreDifference, measurementQuality) => {
  // Clear the canvas before drawing new landmarks
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw face landmarks as points
  for (const landmark of landmarks) {
    ctx.beginPath();
    ctx.arc(landmark.x, landmark.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF0000'; // Red color for landmarks
    ctx.fill();
  }

  // Helper function to draw lines between landmarks
  const drawLine = (p1, p2, color = '#00FF00', lineWidth = 2) => {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Draw measurement lines
  drawLine(landmarks[10], landmarks[152], '#00FFFF'); // Face Length
  drawLine(landmarks[132], landmarks[361], '#FF00FF'); // Face Width
  drawLine(landmarks[123], landmarks[352], '#FFFF00'); // Cheekbone Width
  drawLine(landmarks[58], landmarks[288], '#00FF00'); // Jaw Width
  drawLine(landmarks[132], landmarks[361], '#FF4500'); // Chin Top Width
  drawLine(landmarks[58], landmarks[288], '#8A2BE2'); // Chin Bottom Width
  drawLine(landmarks[93], landmarks[323], '#ADFF2F'); // Chin Mid Width
  drawLine(landmarks[362], landmarks[33], '#FF69B4'); // Eye Distance
  drawLine(landmarks[129], landmarks[358], '#DA70D6'); // Nose Width
  drawLine(landmarks[70], landmarks[300], '#4682B4'); // Forehead Width

  // Draw measurements and labels
  ctx.font = '14px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  const drawMeasurement = (label, value, p1, p2, color, offsetX, offsetY) => {
    const midX = (p1.x + p2.x) / 2 + offsetX;
    const midY = (p1.y + p2.y) / 2 + offsetY;
    ctx.strokeStyle = color; // Set stroke color for the line
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    ctx.fillStyle = color; // Set fill color for the text
    ctx.fillText(`${label}: ${value.toFixed(1)}px`, midX, midY);
  };

  // Use distinct offsets for each measurement to prevent overlapping
  drawMeasurement('Face Length', measurements.faceLength, landmarks[10], landmarks[152], '#00FFFF', -measurements.faceWidth / 2 - 100, 0); 
  drawMeasurement('Face Width', measurements.faceWidth, landmarks[132], landmarks[361], '#FF00FF', 0, measurements.faceLength / 2 + 30);
  drawMeasurement('Cheekbone Width', measurements.cheekboneWidth, landmarks[123], landmarks[352], '#FFFF00', 0, -measurements.faceLength / 2 - 30);
  drawMeasurement('Jaw Width', measurements.jawWidth, landmarks[58], landmarks[288], '#00FF00', 0, measurements.faceLength / 2 + 60);
  drawMeasurement('Chin Top Width', measurements.chinTopWidth, landmarks[132], landmarks[361], '#FF4500', 0, measurements.faceLength / 2 + 90);
  drawMeasurement('Chin Bottom Width', measurements.chinBottomWidth, landmarks[58], landmarks[288], '#8A2BE2', 0, measurements.faceLength / 2 + 120);
  drawMeasurement('Chin Mid Width', measurements.chinMidWidth, landmarks[93], landmarks[323], '#ADFF2F', 0, measurements.faceLength / 2 + 150);
  drawMeasurement('Eye Dist', measurements.eyeDistance, landmarks[362], landmarks[33], '#FF69B4', 0, -measurements.faceLength / 2 - 60);
  drawMeasurement('Nose Width', measurements.noseWidth, landmarks[129], landmarks[358], '#DA70D6', 0, -measurements.faceLength / 2 - 90);
  drawMeasurement('Forehead Width', measurements.foreheadWidth, landmarks[70], landmarks[300], '#4682B4', 0, -measurements.faceLength / 2 - 120);

  // Draw face shape and confidence information
  ctx.font = '16px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  
  const shapeText = `Detected Face Shape: ${faceShape}`;
  const confidenceText = `Confidence: ${confidence}%`;
  const qualityText = `Measurement Quality: ${(measurementQuality * 100).toFixed(0)}%`;
  
  ctx.strokeText(shapeText, 10, canvas.height - 60);
  ctx.fillText(shapeText, 10, canvas.height - 60);
  
  ctx.strokeText(confidenceText, 10, canvas.height - 40);
  ctx.fillText(confidenceText, 10, canvas.height - 40);
  
  ctx.strokeText(qualityText, 10, canvas.height - 20);
  ctx.fillText(qualityText, 10, canvas.height - 20);

  // Show second best shape if available
  if (secondBestShape !== 'Unknown' && secondBestShape !== faceShape) {
    const secondText = `Second Best: ${secondBestShape} (${(scoreDifference * 100).toFixed(1)}% difference)`;
    ctx.strokeText(secondText, 10, canvas.height - 80);
    ctx.fillText(secondText, 10, canvas.height - 80);
  }

  // Draw face ratio information
  ctx.font = '14px Arial';
  ctx.fillText(`Face Ratio (L/W): ${measurements.faceRatio.toFixed(2)}`, 10, canvas.height - 120);
}; 