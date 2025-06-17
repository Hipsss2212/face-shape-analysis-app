// Tính toán các số đo khuôn mặt từ landmarks
import { calculateDistance, calculateAngle } from './mathUtils.js';

// Tính toán các số đo khuôn mặt với độ chính xác cao
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