// Phân loại hình dạng mặt dựa trên các số đo
import { calculateMeasurementQuality } from './qualityCalculator.js';

// Xác định hình dạng mặt dựa trên các số đo sử dụng hệ thống điểm
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