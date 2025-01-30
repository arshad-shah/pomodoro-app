import React, { useEffect, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/hook';
import { updateTimer, updateStats, updateTask } from '@/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Play, Pause, SkipForward, RotateCcw, Brain,
  Coffee, Battery, Clock, Sparkles, Flame, 
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import ModeSelector from '@/components/ModeSelector';
import { cn } from '@/lib/utils';
import CurrentTask from '@/components/CurrentTask';

const TIMER_THEMES = {
  work: {
    icon: Brain,
    title: 'Focus Time',
    shortTitle: 'Focus',
    gradient: 'from-violet-500 to-fuchsia-500',
    iconColor: 'text-violet-500',
    progressColor: 'bg-violet-500',
    glowColor: 'shadow-violet-500/25',
    accentLight: 'bg-violet-50',
    accentText: 'text-violet-600',
  },
  shortBreak: {
    icon: Coffee,
    title: 'Short Break',
    shortTitle: 'Break',
    gradient: 'from-blue-500 to-cyan-500',
    iconColor: 'text-blue-500',
    progressColor: 'bg-blue-500',
    glowColor: 'shadow-blue-500/25',
    accentLight: 'bg-blue-50',
    accentText: 'text-blue-600',
  },
  longBreak: {
    icon: Battery,
    title: 'Long Break',
    shortTitle: 'Long Break',
    gradient: 'from-green-500 to-emerald-500',
    iconColor: 'text-green-500',
    progressColor: 'bg-green-500',
    glowColor: 'shadow-green-500/25',
    accentLight: 'bg-green-50',
    accentText: 'text-green-600',
  },
};

export const Timer: React.FC = () => {
  const timer = useAppSelector(state => state.timer);
  const settings = useAppSelector(state => state.settings);
  const stats = useAppSelector(state => state.stats);
  const currentTask = useAppSelector(state => 
    state.tasks.find(task => task.id === timer.currentTask)
  );

  const dispatch = useAppDispatch();

  const currentTheme = TIMER_THEMES[timer.mode];

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getCurrentDuration = useCallback((): number => {
    const durations = {
      work: settings.workDuration,
      shortBreak: settings.shortBreakDuration,
      longBreak: settings.longBreakDuration,
    };
    return durations[timer.mode];
  }, [settings, timer.mode]);

  const progress = useMemo(() => {
    const totalSeconds = getCurrentDuration() * 60;
    return ((totalSeconds - timer.timeLeft) / totalSeconds) * 100;
  }, [getCurrentDuration, timer.timeLeft]);

  console.log('Timer rendered progress:', progress);
  

  const handleTimerComplete = useCallback(() => {
    if (timer.mode === 'work') {
      dispatch(updateStats({
        dailyPomodoros: stats.dailyPomodoros + 1,
        weeklyPomodoros: stats.weeklyPomodoros + 1,
        totalFocusTime: stats.totalFocusTime + settings.workDuration
      }));
      
      dispatch(updateTimer({
        mode: 'shortBreak',
        timeLeft: settings.shortBreakDuration * 60,
        isActive: settings.autoStartBreaks
      }));
    } else {
      dispatch(updateTimer({
        mode: 'work',
        timeLeft: settings.workDuration * 60,
        isActive: settings.autoStartPomodoros
      }));
    }
    if (currentTask) {
      const newCompletedPomodoros = currentTask.completedPomodoros + 1;
      dispatch(updateTask({
        id: currentTask.id,
        updates: {
          completedPomodoros: newCompletedPomodoros,
          completed: newCompletedPomodoros >= currentTask.pomodoros
        }
      }));
    }

    if (settings.soundEnabled) {
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10...');
        audio.play().catch(console.error);
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  }, [timer.mode, settings, stats, dispatch]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isActive && timer.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch(updateTimer({ timeLeft: timer.timeLeft - 1 }));
      }, 1000);
    } else if (timer.timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [timer.isActive, timer.timeLeft, handleTimerComplete, dispatch]);

  const handleTimerToggle = () => {
    // Don't start if we're in work mode with no task
    if (!timer.isActive && timer.mode === 'work' && !timer.currentTask) {
      return;
    }
    dispatch(updateTimer({ isActive: !timer.isActive }));
  };

  return (
    <Card className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg border-0 shadow-xl">
      <CardContent className="pt-6 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8">
        <ModeSelector 
          currentMode={timer.mode} 
          onModeChange={(mode) => {
            dispatch(updateTimer({ 
              mode, 
              timeLeft: settings[`${mode}Duration`] * 60,
              isActive: false,
            }));
          }}
        />
        {/* Current Task Display */}
        {timer.mode === 'work' && (
          <div className="mt-6 sm:mt-8">
            <CurrentTask />
          </div>
        )}

        <div className="mt-6 sm:mt-8 relative overflow-hidden">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-5 rounded-2xl sm:rounded-3xl",
            currentTheme.gradient
          )} />
          
          <div className="relative text-center py-8 sm:py-12 px-4 sm:px-6 rounded-2xl sm:rounded-3xl">
            {/* Timer Info */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 mb-6 sm:mb-8">
              <div className={cn(
                "p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white shadow-lg mb-4 sm:mb-0",
                currentTheme.glowColor
              )}>
                {timer.mode === 'work' && currentTask ? (
                  <ListTodo className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8",
                    currentTheme.iconColor
                  )} />
                ) : (
                  <currentTheme.icon className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8",
                    currentTheme.iconColor
                  )} />
                )}
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:space-x-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                  <span className="hidden sm:inline">{currentTheme.title}</span>
                  <span className="sm:hidden">{currentTheme.shortTitle}</span>
                </h2>
                {timer.mode === 'work' && stats.dailyPomodoros > 0 && (
                  <div className={cn(
                    "flex items-center space-x-1 px-3 py-1",
                    "bg-amber-50 text-amber-600 rounded-full text-sm"
                  )}>
                    <Flame className="w-4 h-4" />
                    <span>{stats.dailyPomodoros} today</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timer Display */}
            <div className="mb-6 sm:mb-8">
              <div className={cn(
                "text-6xl sm:text-8xl font-mono font-bold tracking-tighter",
                "bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent",
                "hover:scale-105 transition-transform duration-300",
                "group cursor-default"
              )}>
                {formatTime(timer.timeLeft)}
                {progress >= 100 && (
                  <CheckCircle2 className="w-8 h-8 text-green-500 
                                       absolute -right-2 -top-2 
                                       opacity-0 group-hover:opacity-100 
                                       transition-opacity duration-300" />
                )}
              </div>
              
              <div className="text-sm text-gray-600 mt-4 flex items-center justify-center font-medium">
                <Clock className="w-4 h-4 mr-2" />
                {Math.floor(timer.timeLeft / 60)} minutes remaining
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8 sm:mb-12">
              <Progress 
                value={progress} 
                className={cn(
                  "h-2 sm:h-3 rounded-full bg-gray-100 overflow-hidden",
                  "transition-all duration-300",
                  progress > 0 ? currentTheme.glowColor : ''
                )}
              />
              {progress >= 100 && (
                <div className="absolute top-full left-0 right-0 text-center mt-2">
                  <div className="inline-flex items-center space-x-1 text-sm text-amber-600">
                    <Sparkles className="w-4 h-4" />
                    <span>Time's up!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                onClick={handleTimerToggle}
                size="lg"
                className={cn(
                  "w-full sm:w-auto px-8 sm:px-10 py-6 sm:py-7 rounded-xl sm:rounded-2xl",
                  "transition-all duration-300 transform hover:scale-105 hover:-translate-y-1",
                  "flex items-center justify-center text-white",
                  timer.isActive 
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200/50' 
                    : cn(
                        'bg-gradient-to-r shadow-lg',
                        currentTheme.gradient,
                        currentTheme.glowColor
                      )
                )}
              >
                {timer.isActive ? (
                  <>
                    <Pause className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-base sm:text-lg font-medium">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-base sm:text-lg font-medium">Start</span>
                  </>
                )}
              </Button>

              <div className="flex space-x-3">
                <Button 
                  onClick={() => dispatch(updateTimer({
                    timeLeft: getCurrentDuration() * 60,
                    isActive: false,
                  }))}
                  variant="outline" 
                  size="icon"
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2",
                    "hover:scale-105 transition-all duration-300 hover:-translate-y-1",
                    currentTheme.glowColor,
                    "hover:border-transparent",
                    "hover:bg-gradient-to-br hover:text-white",
                    currentTheme.gradient
                  )}
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
                <Button 
                  onClick={handleTimerComplete} 
                  variant="outline" 
                  size="icon"
                  className={cn(
                    "w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2",
                    "hover:scale-105 transition-all duration-300 hover:-translate-y-1",
                    currentTheme.glowColor,
                    "hover:border-transparent",
                    "hover:bg-gradient-to-br hover:text-white",
                    currentTheme.gradient
                  )}
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};