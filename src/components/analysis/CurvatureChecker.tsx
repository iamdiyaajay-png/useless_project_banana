'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OfficialCard } from '@/components/ui/OfficialCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import Script from 'next/script';

declare global {
  interface Window {
    cv: any;
  }
}

type InputMode = 'CAMERA' | 'UPLOAD' | null;

interface AnalysisResults {
  lengthEstimate: number; // in relative units or cm
  arcLength: number;
  chordLength: number;
  maxDeviation: number;
  curvatureIndex: number;
  bendAngle: number;
  symmetryScore: number;
  classification: string;
  isCalibrated: boolean;
}

export function CurvatureChecker({ bananaId }: { bananaId: string }) {
  const router = useRouter();
  const [cvLoaded, setCvLoaded] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>(null);
  
  // Camera & Image state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasOverlayRef = useRef<HTMLCanvasElement>(null);
  const imageDisplayRef = useRef<HTMLImageElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Calibration state
  const [calibrationLength, setCalibrationLength] = useState<string>('');
  
  // Processing state
  const [status, setStatus] = useState<string>('AWAITING INPUT');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  
  // Canvas for result visualization
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load OpenCV
  useEffect(() => {
    if (window.cv && window.cv.Mat) setCvLoaded(true);
  }, []);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startCamera = async () => {
    setError(null);
    setCameraError(null);
    setCapturedImage(null);
    setResults(null);
    setInputMode('CAMERA');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStatus('CAMERA ACTIVE');
      drawAlignmentGuide();
    } catch (err: any) {
      setCameraError('CAMERA PERMISSION DENIED OR UNAVAILABLE. PLEASE USE IMAGE UPLOAD.');
      setInputMode('UPLOAD');
    }
  };

  const drawAlignmentGuide = () => {
    if (!canvasOverlayRef.current || !videoRef.current) return;
    const canvas = canvasOverlayRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (!stream) return;
      
      // Match canvas internal resolution to its display size to avoid stretching
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. & 3. Alignment grid / measurement guide
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = centerX % gridSize; x < width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = centerY % gridSize; y < height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // 1. Horizontal reference axis
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)'; // Cyan
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // 2. Vertical reference axis
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 4. Banana positioning zone (professional outline)
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.6)';
      ctx.lineWidth = 3;
      
      const guideWidth = Math.min(width * 0.7, 600);
      const guideHeight = guideWidth * 0.25;
      const startX = centerX - guideWidth / 2;
      const endX = centerX + guideWidth / 2;
      
      ctx.beginPath();
      // Outer gentle arc
      ctx.moveTo(startX, centerY + 20);
      ctx.quadraticCurveTo(centerX, centerY - guideHeight, endX, centerY + 20);
      // Inner gentle arc
      ctx.quadraticCurveTo(centerX, centerY - guideHeight + 50, startX, centerY + 20);
      ctx.stroke();

      // 5. Endpoint markers
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.beginPath(); ctx.arc(startX, centerY + 20, 6, 0, 2 * Math.PI); ctx.fill();
      ctx.beginPath(); ctx.arc(endX, centerY + 20, 6, 0, 2 * Math.PI); ctx.fill();
      
      // Target brackets at ends
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      // Left bracket
      ctx.beginPath(); ctx.moveTo(startX - 15, centerY + 10); ctx.lineTo(startX - 15, centerY + 30); ctx.moveTo(startX - 15, centerY + 20); ctx.lineTo(startX - 5, centerY + 20); ctx.stroke();
      // Right bracket
      ctx.beginPath(); ctx.moveTo(endX + 15, centerY + 10); ctx.lineTo(endX + 15, centerY + 30); ctx.moveTo(endX + 15, centerY + 20); ctx.lineTo(endX + 5, centerY + 20); ctx.stroke();

      // Central Alignment Reticle
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(centerX - 30, centerY); ctx.lineTo(centerX + 30, centerY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(centerX, centerY - 30); ctx.lineTo(centerX, centerY + 30); ctx.stroke();

      // 6. Text instruction
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillStyle = '#00ffff';
      ctx.textAlign = 'center';
      ctx.fillText('ALIGN BANANA ALONG REFERENCE AXIS', centerX, centerY - guideHeight - 20);

      // Corner Markers
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      const corner = 40;
      const m = 30; // margin
      ctx.beginPath(); ctx.moveTo(m, m + corner); ctx.lineTo(m, m); ctx.lineTo(m + corner, m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width - m - corner, m); ctx.lineTo(width - m, m); ctx.lineTo(width - m, m + corner); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m, height - m - corner); ctx.lineTo(m, height - m); ctx.lineTo(m + corner, height - m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(width - m - corner, height - m); ctx.lineTo(width - m, height - m); ctx.lineTo(width - m, height - m - corner); ctx.stroke();

      // Optional: Standard Capture Indicator
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(m, m, 180, 28);
      ctx.fillStyle = '#fff';
      ctx.font = '13px "Courier New", monospace';
      ctx.textAlign = 'left';
      // Blinking record dot
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(m + 14, m + 14, 5, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.fillStyle = '#fff';
      ctx.fillText('STANDARD CAPTURE', m + 26, m + 18);

      requestAnimationFrame(render);
    };
    render();
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
      setInputMode(null);
      setStatus('IMAGE CAPTURED');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResults(null);
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
        setStatus('IMAGE UPLOADED');
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!window.cv || !window.cv.Mat || !capturedImage || !imageDisplayRef.current || !resultCanvasRef.current) return;

    try {
      setStatus('PROCESSING IMAGE');
      setError(null);
      await new Promise(r => setTimeout(r, 100)); // UI tick

      const cv = window.cv;
      let src = cv.imread(imageDisplayRef.current);
      
      // Resize to standard analysis resolution to ensure performance
      const MAX_DIM = 800;
      let scale = 1;
      if (src.cols > MAX_DIM || src.rows > MAX_DIM) {
        scale = MAX_DIM / Math.max(src.cols, src.rows);
        let dsize = new cv.Size(Math.round(src.cols * scale), Math.round(src.rows * scale));
        let resized = new cv.Mat();
        cv.resize(src, resized, dsize, 0, 0, cv.INTER_AREA);
        src.delete();
        src = resized; // working image
      }

      // Convert to HSV for robust color segmentation
      let hsv = new cv.Mat();
      cv.cvtColor(src, hsv, cv.COLOR_RGBA2RGB);
      cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

      // Yellow/Green banana mask
      let mask = new cv.Mat();
      let low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [10, 40, 40, 0]);
      let high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [90, 255, 255, 0]);
      cv.inRange(hsv, low, high, mask);

      // Morphological operations to clean up
      let M = cv.Mat.ones(9, 9, cv.CV_8U);
      cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, M);
      cv.morphologyEx(mask, mask, cv.MORPH_OPEN, M);

      // Find contours
      let contours = new cv.MatVector();
      let hierarchy = new cv.Mat();
      cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      if (contours.size() === 0) {
        throw new Error('SPECIMEN IMAGE QUALITY INSUFFICIENT: No specimen detected.');
      }

      // Find largest contour (assume it's the banana)
      let maxArea = 0;
      let maxContourIndex = -1;
      for (let i = 0; i < contours.size(); ++i) {
        let area = cv.contourArea(contours.get(i));
        if (area > maxArea) {
          maxArea = area;
          maxContourIndex = i;
        }
      }

      if (maxArea < (src.rows * src.cols * 0.05)) {
        throw new Error('SPECIMEN IMAGE QUALITY INSUFFICIENT: Detected object too small. Move camera closer.');
      }

      let contour = contours.get(maxContourIndex);

      // Extract points
      let points: {x: number, y: number}[] = [];
      for(let i=0; i < contour.rows; i++) {
        points.push({
          x: contour.data32S[i*2],
          y: contour.data32S[i*2 + 1]
        });
      }

      // Find the two furthest points on the contour (endpoints/tips)
      let maxDistSq = 0;
      let tip1 = points[0], tip2 = points[0];
      const step = Math.max(1, Math.floor(points.length / 100)); // Optimize
      for(let i=0; i<points.length; i+=step) {
        for(let j=i+step; j<points.length; j+=step) {
          let dx = points[i].x - points[j].x;
          let dy = points[i].y - points[j].y;
          let distSq = dx*dx + dy*dy;
          if (distSq > maxDistSq) {
            maxDistSq = distSq;
            tip1 = points[i];
            tip2 = points[j];
          }
        }
      }

      const chordLengthPx = Math.sqrt(maxDistSq);

      // To find max deviation (curvature), we find the contour point furthest from the chord
      let maxDeviationPx = 0;
      let apexPt = points[0];
      for(let i=0; i<points.length; i++) {
        // Distance from point to line connecting tip1 and tip2
        const num = Math.abs((tip2.x - tip1.x)*(tip1.y - points[i].y) - (tip1.x - points[i].x)*(tip2.y - tip1.y));
        const dist = num / chordLengthPx;
        if (dist > maxDeviationPx) {
          maxDeviationPx = dist;
          apexPt = points[i];
        }
      }

      // We define Centerline approximation: we take the midpoint of the contour thickness at the apex.
      // But for a simple reliable visual, we draw the chord (RED), the apex deviation (YELLOW), and the contour (GREEN).
      // Let's create an approximate arc length = dist(tip1, apexPt) + dist(apexPt, tip2)
      const d1 = Math.sqrt(Math.pow(tip1.x - apexPt.x, 2) + Math.pow(tip1.y - apexPt.y, 2));
      const d2 = Math.sqrt(Math.pow(tip2.x - apexPt.x, 2) + Math.pow(tip2.y - apexPt.y, 2));
      const arcLengthPx = d1 + d2;

      // Draw Visuals on src
      const outputImg = src.clone();
      
      // GREEN: Boundary
      let colorGreen = new cv.Scalar(0, 255, 0, 255);
      cv.drawContours(outputImg, contours, maxContourIndex, colorGreen, 3, cv.LINE_8, hierarchy, 0);

      // RED: Straight chord
      let colorRed = new cv.Scalar(255, 0, 0, 255);
      cv.line(outputImg, new cv.Point(tip1.x, tip1.y), new cv.Point(tip2.x, tip2.y), colorRed, 3, cv.LINE_AA);

      // BLUE: Approximate Centerline (Arc)
      let colorBlue = new cv.Scalar(255, 255, 0, 255); // Cyan-ish in OpenCV RGBA is BGR mapped? Wait, it's RGBA in JS. 
      cv.line(outputImg, new cv.Point(tip1.x, tip1.y), new cv.Point(apexPt.x, apexPt.y), colorBlue, 2, cv.LINE_AA);
      cv.line(outputImg, new cv.Point(apexPt.x, apexPt.y), new cv.Point(tip2.x, tip2.y), colorBlue, 2, cv.LINE_AA);

      // YELLOW: Max Curvature Deviation
      let colorYellow = new cv.Scalar(0, 255, 255, 255); 
      // Draw perpendicular line from apex to chord (approx)
      cv.circle(outputImg, new cv.Point(apexPt.x, apexPt.y), 8, colorYellow, -1);

      cv.imshow(resultCanvasRef.current, outputImg);

      // Math
      const curvatureIndex = (maxDeviationPx / chordLengthPx) * 100;
      
      // Bend angle (cosine rule on the triangle formed by tip1, tip2, apex)
      // Triangle sides: a=d1, b=d2, c=chordLengthPx
      // Angle at apex: C
      // c^2 = a^2 + b^2 - 2ab * cos(C)
      const cosC = (d1*d1 + d2*d2 - chordLengthPx*chordLengthPx) / (2 * d1 * d2);
      const angleRad = Math.acos(Math.max(-1, Math.min(1, cosC)));
      // Bend angle is 180 - apex angle
      const bendAngle = 180 - (angleRad * (180 / Math.PI));

      let classification = 'UNKNOWN';
      if (curvatureIndex < 10) classification = 'NEARLY STRAIGHT';
      else if (curvatureIndex < 25) classification = 'SLIGHTLY CURVED';
      else if (curvatureIndex < 40) classification = 'MODERATELY CURVED';
      else if (curvatureIndex < 60) classification = 'HIGHLY CURVED';
      else classification = 'EXTREMELY CURVED';

      // Calibration scaling
      let isCalibrated = false;
      let scaleFactor = 1; // 1 pixel = 1 unit
      if (calibrationLength && !isNaN(parseFloat(calibrationLength))) {
        // Assume calibration length was provided for the chord (for simplicity of the demo)
        // Usually you'd click a ruler, but we'll map the known length to the chord for now, or just provide a generic pixel scale
        const cal = parseFloat(calibrationLength);
        scaleFactor = cal / chordLengthPx;
        isCalibrated = true;
      }

      setResults({
        isCalibrated,
        lengthEstimate: isCalibrated ? chordLengthPx * scaleFactor : chordLengthPx,
        arcLength: isCalibrated ? arcLengthPx * scaleFactor : arcLengthPx,
        chordLength: isCalibrated ? chordLengthPx * scaleFactor : chordLengthPx,
        maxDeviation: isCalibrated ? maxDeviationPx * scaleFactor : maxDeviationPx,
        curvatureIndex: curvatureIndex,
        bendAngle: bendAngle,
        symmetryScore: 100 - Math.abs((d1 - d2) / Math.max(d1, d2)) * 100, // 100 is perfectly symmetric bend
        classification
      });

      setStatus('ANALYSIS COMPLETE');

      // Cleanup
      src.delete(); hsv.delete(); low.delete(); high.delete(); mask.delete(); M.delete();
      contours.delete(); hierarchy.delete(); contour.delete(); outputImg.delete();

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Processing failed. Please ensure the image is clear.');
      setStatus('FAILED');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <Script 
        src="https://docs.opencv.org/4.8.0/opencv.js" 
        strategy="lazyOnload" 
        onReady={() => { setTimeout(() => setCvLoaded(true), 1000); }} 
      />

      <div style={{ textAlign: 'center', marginBottom: '28px', borderBottom: '3px solid var(--gov-blue)', paddingBottom: '20px' }}>
        <h1 style={{ margin: '0 0 6px 0', color: 'var(--gov-blue)', fontSize: 'clamp(1.3rem, 3.5vw, 2.2rem)', letterSpacing: '1.5px' }}>
          BANANA CURVATURE ANALYSIS DIVISION
        </h1>
        <div style={{ fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', fontFamily: 'monospace', fontWeight: 'bold' }}>
          SPECIMEN GEOMETRY & CURVATURE ASSESSMENT PORTAL
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        {/* Left Column */}
        <div style={{ flex: '2 1 540px', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <OfficialCard title="SECTION 01: SPECIMEN INPUT">
            {!capturedImage && !inputMode && (
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button onClick={startCamera} style={{ flex: '1 1 200px', minHeight: '52px', padding: '16px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  📷 LIVE CAMERA
                </button>
                <button onClick={() => setInputMode('UPLOAD')} style={{ flex: '1 1 200px', minHeight: '52px', padding: '16px', backgroundColor: 'var(--ivory)', color: 'var(--gov-blue)', border: '2px solid var(--gov-blue)', borderRadius: 'var(--radius-md)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  📁 UPLOAD SPECIMEN IMAGE
                </button>
              </div>
            )}

            {cameraError && (
              <div style={{ padding: '14px', backgroundColor: 'var(--status-warning-light)', color: 'var(--status-warning)', border: '1px solid var(--status-warning)', marginTop: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
                {cameraError}
              </div>
            )}

            {inputMode === 'CAMERA' && !capturedImage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ position: 'relative', width: '100%', backgroundColor: '#000', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: 'block', maxHeight: '480px', objectFit: 'cover' }} />
                  <canvas ref={canvasOverlayRef} width={800} height={600} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10, width: '90%', justifyContent: 'center' }}>
                    <button onClick={captureImage} style={{ padding: '12px 24px', backgroundColor: '#fff', color: 'var(--gov-blue)', border: 'none', borderRadius: '24px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', minHeight: '44px' }}>
                      CAPTURE SPECIMEN
                    </button>
                    <button onClick={() => { stopCamera(); setInputMode(null); }} style={{ padding: '12px 18px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#fff', border: '1px solid #fff', borderRadius: '24px', cursor: 'pointer', minHeight: '44px', fontSize: '0.9rem' }}>
                      CANCEL
                    </button>
                  </div>
                </div>
                {/* Responsive guide card */}
                <div style={{ backgroundColor: 'var(--gov-blue-dark)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', fontFamily: 'monospace', border: '1px solid rgba(0, 255, 255, 0.4)' }}>
                  <div style={{ color: '#00ffff', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    📐 ALIGN SPECIMEN GUIDE
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', color: 'rgba(255, 255, 255, 0.9)' }}>
                    <li>Place banana inside the guide ellipse</li>
                    <li>Keep both ends visible & parallel to camera</li>
                    <li>Ensure uniform lighting & high contrast</li>
                  </ul>
                </div>
              </div>
            )}

            {inputMode === 'UPLOAD' && !capturedImage && (
              <div style={{ border: '2px dashed var(--gov-blue)', padding: '30px 16px', textAlign: 'center', borderRadius: 'var(--radius-md)', backgroundColor: '#fafafa' }}>
                <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleFileUpload} style={{ display: 'none' }} id="file-upload" />
                <label htmlFor="file-upload" style={{ padding: '14px 28px', backgroundColor: 'var(--gov-blue)', color: '#fff', cursor: 'pointer', borderRadius: 'var(--radius-md)', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px', minHeight: '44px' }}>
                  SELECT FILE
                </label>
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Supports JPG, PNG. Clear contrast background recommended.</div>
                <button onClick={() => setInputMode(null)} style={{ marginTop: '16px', display: 'block', margin: '16px auto 0', padding: '8px 16px', background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer', textDecoration: 'underline' }}>
                  Cancel
                </button>
              </div>
            )}

            {capturedImage && (
               <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <div style={{ fontWeight: 'bold', color: 'var(--status-green)' }}>✓ SPECIMEN SECURED</div>
                   <button onClick={() => { setCapturedImage(null); setResults(null); }} style={{ padding: '6px 12px', border: '1px solid var(--border-color)', background: '#fff', cursor: 'pointer', borderRadius: '4px' }}>
                     RETAKE IMAGE
                   </button>
                 </div>
                 
                 <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                   <div style={{ flex: '1', minWidth: 'min(100%, 260px)' }}>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '8px' }}>INPUT BUFFER</div>
                     <img ref={imageDisplayRef} src={capturedImage} style={{ width: '100%', border: '1px solid var(--border-color)', borderRadius: '4px', display: results ? 'none' : 'block' }} />
                     
                     <canvas ref={resultCanvasRef} style={{ width: '100%', border: '1px solid var(--gov-blue)', borderRadius: '4px', display: results ? 'block' : 'none' }} />
                   </div>

                   {results && (
                     <div style={{ flex: '1', minWidth: '200px' }}>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '8px' }}>VISUAL ANALYSIS OVERLAY</div>
                       <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         <li><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#00ff00', marginRight: '8px' }}></span> Detected Specimen Boundary</li>
                         <li><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ffff00', marginRight: '8px' }}></span> Approximate Centerline Arc</li>
                         <li><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#ff0000', marginRight: '8px' }}></span> Straight Chord Reference</li>
                         <li><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#00ffff', marginRight: '8px' }}></span> Maximum Curvature Deviation</li>
                       </ul>
                     </div>
                   )}
                 </div>
               </div>
            )}
          </OfficialCard>

          {capturedImage && !results && (
            <OfficialCard title="SECTION 02: REFERENCE SCALE (OPTIONAL)">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '16px' }}>
                For absolute physical measurements, enter the known chord length of the specimen in cm. Otherwise, the system will use relative unit estimates.
              </p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="number" 
                  placeholder="e.g. 15.0" 
                  value={calibrationLength}
                  onChange={(e) => setCalibrationLength(e.target.value)}
                  style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '4px', width: '120px' }} 
                />
                <span style={{ fontWeight: 'bold' }}>cm</span>
              </div>
            </OfficialCard>
          )}

          {error && (
            <div style={{ backgroundColor: 'var(--status-red-light)', color: 'var(--status-red)', padding: '24px', borderRadius: '4px', border: '1px solid var(--status-red)' }}>
              <strong>SPECIMEN IMAGE QUALITY: INSUFFICIENT</strong><br />
              <div style={{ marginTop: '8px', marginBottom: '16px' }}>Reason: {error}</div>
              
              <div style={{ fontSize: '0.9rem', display: 'flex', gap: '24px' }}>
                <div>
                  <strong>Recommended capture:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    <li>Place specimen on a flat surface</li>
                    <li>Keep entire specimen visible</li>
                    <li>Keep camera parallel to specimen plane</li>
                    <li>Avoid strong shadows</li>
                  </ul>
                </div>
                <div>
                  <strong>Avoid:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    <li>Extreme camera angles</li>
                    <li>Cropped specimen</li>
                    <li>Multiple overlapping specimens</li>
                  </ul>
                </div>
              </div>
              <button onClick={() => { setCapturedImage(null); setError(null); }} style={{ padding: '8px 16px', marginTop: '16px', backgroundColor: '#fff', border: '1px solid var(--status-red)', color: 'var(--status-red)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                RETAKE IMAGE
              </button>
            </div>
          )}

        </div>

        {/* Right Column */}
        <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <OfficialCard title="Execution Engine">
            <div style={{ marginBottom: '16px' }}>
              <strong>Status:</strong> <StatusBadge status={status} />
            </div>
            
            <button 
              onClick={processImage}
              disabled={!cvLoaded || !capturedImage || status === 'PROCESSING IMAGE'}
              style={{ display: 'block', width: '100%', padding: '16px', backgroundColor: 'var(--gov-blue)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', cursor: (cvLoaded && capturedImage) ? 'pointer' : 'not-allowed', opacity: (cvLoaded && capturedImage) ? 1 : 0.5 }}
            >
              {status === 'PROCESSING IMAGE' ? 'PROCESSING...' : 'RUN CURVATURE EXTRACTION'}
            </button>
          </OfficialCard>

          {results && (
            <OfficialCard title="SECTION 03: CURVATURE RESULTS">
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                  <tbody>
                    <tr>
                      <th style={{ padding: '10px 12px', width: '55%' }}>Measurement Mode</th>
                      <td style={{ padding: '10px 12px', fontWeight: 'bold', color: results.isCalibrated ? 'var(--status-green)' : 'var(--status-warning)' }}>
                        {results.isCalibrated ? 'ABSOLUTE (cm)' : 'RELATIVE (est)'}
                      </td>
                    </tr>
                    <tr>
                      <th style={{ padding: '10px 12px' }}>Arc / Centerline Length</th>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{results.arcLength.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '10px 12px' }}>Straight Chord Length</th>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{results.chordLength.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '10px 12px' }}>Maximum Deviation</th>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{results.maxDeviation.toFixed(1)}</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '10px 12px' }}>Estimated Bend Angle</th>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{results.bendAngle.toFixed(1)}°</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '10px 12px' }}>Symmetry Score</th>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{results.symmetryScore.toFixed(1)} / 100</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '10px 12px', fontSize: '1.05rem', color: 'var(--gov-blue)' }}>Curvature Index</th>
                      <td style={{ padding: '10px 12px', fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--gov-blue)' }}>{results.curvatureIndex.toFixed(1)}%</td>
                    </tr>
                    <tr>
                      <th style={{ padding: '10px 12px' }}>Classification</th>
                      <td style={{ padding: '10px 12px', fontWeight: 'bold', color: '#cc0000' }}>{results.classification}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '20px', padding: '16px', backgroundColor: 'var(--gov-blue)', color: '#fff', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.85, textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>OFFICIAL CURVATURE STATUS</div>
                <div style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 'bold' }}>
                  {results.classification === 'NEARLY STRAIGHT' ? 'STRAIGHT-SPECIMEN COMPLIANCE' : 
                   results.classification === 'EXTREMELY CURVED' ? 'CURVATURE REQUIRES REVIEW' : 'ACCEPTABLE'}
                </div>
                <div style={{ marginTop: '6px', fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--muted-gold)' }}>
                  GRADE: {results.curvatureIndex < 10 ? 'C' : results.curvatureIndex < 25 ? 'B' : results.curvatureIndex < 40 ? 'A' : 'A+'}
                </div>
              </div>
              
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '12px', fontStyle: 'italic', textAlign: 'center' }}>
                * NOTE: These categories are part of an experimental classification system.
              </div>
            </OfficialCard>
          )}

          <div style={{ marginTop: 'auto' }}>
             <button onClick={() => router.push(`/registry/${bananaId}/analysis`)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '14px', backgroundColor: 'transparent', color: 'var(--gov-blue)', border: '2px solid var(--gov-blue)', borderRadius: 'var(--radius-md)', fontWeight: 'bold', cursor: 'pointer', minHeight: '44px', fontSize: '0.9rem' }}>
               RETURN TO GENERAL ANALYSIS
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
