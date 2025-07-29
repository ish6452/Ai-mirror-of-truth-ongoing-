import React, { useRef, useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Camera, CameraOff, Sparkles, Heart, Zap } from 'lucide-react';
import mockData from '../data/mock';

const EmotionMirror = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [emotionConfidence, setEmotionConfidence] = useState(0);
  const [currentTip, setCurrentTip] = useState('');
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Simulating face-api.js loading for now with mock data
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFaceApiLoaded(true);
        console.log('Face API models loaded (mock)');
      } catch (error) {
        console.error('Error loading face API models:', error);
      }
    };
    loadModels();
  }, []);

  // Mock emotion detection - will be replaced with real face-api.js
  useEffect(() => {
    let intervalId;
    if (isStreaming && faceApiLoaded) {
      intervalId = setInterval(() => {
        // Mock emotion cycling for demo
        const emotions = Object.keys(mockData.emotionTips);
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence
        
        setCurrentEmotion(randomEmotion);
        setEmotionConfidence(confidence);
        
        // Get random tip for the emotion
        const tips = mockData.emotionTips[randomEmotion];
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setCurrentTip(randomTip);
      }, 3000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming, faceApiLoaded]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setCurrentEmotion('neutral');
    setCurrentTip('');
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      sad: 'bg-blue-100 text-blue-800 border-blue-300',
      angry: 'bg-red-100 text-red-800 border-red-300',
      surprised: 'bg-purple-100 text-purple-800 border-purple-300',
      fearful: 'bg-gray-100 text-gray-800 border-gray-300',
      disgusted: 'bg-green-100 text-green-800 border-green-300',
      neutral: 'bg-slate-100 text-slate-800 border-slate-300'
    };
    return colors[emotion] || colors.neutral;
  };

  const getEmotionIcon = (emotion) => {
    switch(emotion) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'angry': return '😠';
      case 'surprised': return '😲';
      case 'fearful': return '😰';
      case 'disgusted': return '🤢';
      default: return '😐';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-500" />
            AI Mirror of Truth
            <Sparkles className="w-8 h-8 text-blue-500" />
          </h1>
          <p className="text-slate-600 text-lg">
            Discover your emotions in real-time and get personalized mood tips
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Camera Section */}
          <Card className="p-6 bg-white shadow-lg border-0">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Your Reflection</h2>
              <p className="text-slate-600">Look into the mirror and see your emotions</p>
            </div>

            <div className="relative">
              <div className="bg-slate-900 rounded-lg overflow-hidden aspect-video relative">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect
                />
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50">
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Camera is off</p>
                    </div>
                  </div>
                )}

                {/* Loading overlay */}
                {isStreaming && !faceApiLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-lg">Loading AI models...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="mt-4 flex justify-center">
                {!isStreaming ? (
                  <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Start Mirror
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline" className="px-6 py-3 rounded-lg flex items-center gap-2">
                    <CameraOff className="w-5 h-5" />
                    Stop Mirror
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Emotion Results Section */}
          <Card className="p-6 bg-white shadow-lg border-0">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Emotional Insight</h2>
              <p className="text-slate-600">Your current mood and personalized tips</p>
            </div>

            {isStreaming && faceApiLoaded ? (
              <div className="space-y-6">
                {/* Current Emotion */}
                <div className="text-center">
                  <div className="text-6xl mb-3">{getEmotionIcon(currentEmotion)}</div>
                  <Badge className={`text-lg px-4 py-2 ${getEmotionColor(currentEmotion)}`}>
                    {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
                  </Badge>
                  <div className="mt-2">
                    <p className="text-sm text-slate-600">
                      Confidence: {Math.round(emotionConfidence * 100)}%
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${emotionConfidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Mood Tip */}
                {currentTip && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-2">Mood Tip</h3>
                        <p className="text-slate-700 leading-relaxed">{currentTip}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emotion Stats */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(mockData.emotionTips).slice(0, 6).map((emotion) => (
                    <div 
                      key={emotion}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        emotion === currentEmotion 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl">{getEmotionIcon(emotion)}</div>
                        <p className="text-xs font-medium text-slate-600 mt-1 capitalize">
                          {emotion}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-500 text-lg">
                  {!isStreaming ? 'Start your mirror to begin emotion detection' : 'Preparing AI models...'}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>✨ Your emotions are processed locally in your browser - completely private ✨</p>
        </div>
      </div>
    </div>
  );
};

export default EmotionMirror;