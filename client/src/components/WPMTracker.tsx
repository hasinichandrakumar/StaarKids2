import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, Target, TrendingUp } from "lucide-react";

interface WPMTrackerProps {
  grade: number;
  passageText: string;
  questionText: string;
  isReading: boolean;
  onReadingComplete: (wpm: number, timeSpent: number) => void;
  onStartReading: () => void;
}

export default function WPMTracker({ 
  grade, 
  passageText, 
  isReading, 
  onReadingComplete, 
  onStartReading 
}: WPMTrackerProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate word count from passage text
  const wordCount = passageText.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Grade-level reading speed targets (WPM)
  const getTargetWPM = (grade: number) => {
    switch (grade) {
      case 3: return 120;
      case 4: return 140;
      case 5: return 160;
      default: return 140;
    }
  };

  const targetWPM = getTargetWPM(grade);

  const startReading = () => {
    setStartTime(Date.now());
    setHasStarted(true);
    setIsComplete(false);
    setTimeElapsed(0);
    setCurrentWPM(0);
    onStartReading();
  };

  const completeReading = () => {
    if (startTime) {
      const endTime = Date.now();
      const totalTimeMinutes = (endTime - startTime) / 60000;
      const finalWPM = Math.round(wordCount / totalTimeMinutes);
      
      setCurrentWPM(finalWPM);
      setIsComplete(true);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      onReadingComplete(finalWPM, Math.round((endTime - startTime) / 1000));
    }
  };

  useEffect(() => {
    if (hasStarted && !isComplete && startTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const elapsedMinutes = elapsed / 60;
        
        setTimeElapsed(elapsed);
        
        if (elapsedMinutes > 0) {
          const wpm = Math.round(wordCount / elapsedMinutes);
          setCurrentWPM(wpm);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [hasStarted, isComplete, startTime, wordCount]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWPMColor = (wpm: number) => {
    if (wpm >= targetWPM) return "text-green-600";
    if (wpm >= targetWPM * 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (wpm: number) => {
    if (wpm >= targetWPM) return "bg-green-500";
    if (wpm >= targetWPM * 0.8) return "bg-yellow-500";
    return "bg-red-500";
  };

  const progressPercentage = Math.min((currentWPM / targetWPM) * 100, 100);

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-blue-800 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Reading Speed Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Passage Info */}
        <div className="flex justify-between items-center text-sm text-blue-600">
          <span>{wordCount} words</span>
          <span>Target: {targetWPM} WPM (Grade {grade})</span>
        </div>

        {/* WPM Display */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getWPMColor(currentWPM)}`}>
            {currentWPM} WPM
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 mt-2"
          />
          <p className="text-xs text-blue-600 mt-1">
            {currentWPM >= targetWPM ? "Excellent!" : 
             currentWPM >= targetWPM * 0.8 ? "Good pace!" : 
             hasStarted ? "Keep reading!" : "Ready to start"}
          </p>
        </div>

        {/* Time and Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-blue-600">
            <Clock className="w-4 h-4 mr-1" />
            {formatTime(timeElapsed)}
          </div>
          
          {!hasStarted ? (
            <Button 
              onClick={startReading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Reading
            </Button>
          ) : !isComplete ? (
            <Button 
              onClick={completeReading}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Finished Reading
            </Button>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <Target className="w-4 h-4 mr-1" />
              Complete!
            </div>
          )}
        </div>

        {/* Performance Feedback */}
        {isComplete && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-800">Reading Complete!</p>
                <p className="text-xs text-blue-600">
                  {currentWPM >= targetWPM ? 
                    "Excellent reading speed! You're reading at or above grade level." :
                    currentWPM >= targetWPM * 0.8 ?
                    "Good reading speed! Keep practicing to reach the target." :
                    "Practice makes perfect! Try reading more to improve your speed."
                  }
                </p>
              </div>
              <TrendingUp className={`w-5 h-5 ${getWPMColor(currentWPM)}`} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}