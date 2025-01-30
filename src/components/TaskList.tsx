import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hook';
import { addTask, updateTask, deleteTask } from '@/store';
import { 
  Plus, Trash2, CheckCircle2, Circle, Timer,
  ListTodo, AlertTriangle, Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TaskItem: React.FC<{
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}> = ({ task, onUpdate, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        "group flex items-center justify-between",
        "p-3 sm:p-4 rounded-xl transition-all duration-300",
        "hover:shadow-md hover:-translate-y-0.5",
        task.completed 
          ? 'bg-gray-50/80 backdrop-blur-sm border border-gray-100' 
          : 'bg-white shadow-sm hover:shadow-gray-200'
      )}
    >
      <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
        <button
          onClick={() => onUpdate({ completed: !task.completed })}
          className={cn(
            "flex-shrink-0 p-1 rounded-full transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-violet-500",
            "hover:bg-violet-50 group/check"
          )}
        >
          {task.completed ? (
            <div className="relative">
              <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-green-500 transition-colors duration-200" />
              <Sparkles 
                className={cn(
                  "absolute -right-1 -top-1 w-3 h-3 text-yellow-400",
                  "opacity-0 group-hover/check:opacity-100 transition-opacity duration-200"
                )}
              />
            </div>
          ) : (
            <Circle className="w-5 sm:w-6 h-5 sm:h-6 text-gray-300 hover:text-violet-500 
                           transition-colors duration-200" />
          )}
        </button>
        
        {/* Task Title */}
        <div className="flex-1 min-w-0">
          <span className={cn(
            "block text-sm sm:text-base truncate transition-colors duration-200",
            task.completed 
              ? 'text-gray-400 line-through' 
              : 'text-gray-700'
          )}>
            {task.title}
          </span>
          
          {/* Mobile Pomodoro Counter */}
          <div className="sm:hidden mt-1">
            <div className={cn(
              "inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs",
              task.completed
                ? 'bg-gray-100 text-gray-400'
                : 'bg-violet-50 text-violet-600'
            )}>
              <Timer className="w-3 h-3" />
              <span>{task.completedPomodoros}/{task.pomodoros}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center space-x-3 flex-shrink-0">
        {/* Pomodoro Counter */}
        <div className={cn(
          "flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm",
          "transition-all duration-200",
          task.completed
            ? 'bg-gray-100 text-gray-400'
            : cn(
                'bg-violet-50 text-violet-600',
                task.completedPomodoros >= task.pomodoros && 'bg-green-50 text-green-600'
              )
        )}>
          <Timer className="w-4 h-4" />
          <span>{task.completedPomodoros}/{task.pomodoros}</span>
        </div>
        
        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className={cn(
            "opacity-0 group-hover:opacity-100",
            "hover:bg-red-50 hover:text-red-500",
            "transition-all duration-200 rounded-lg",
            isHovering && "sm:animate-pulse"
          )}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Mobile Delete Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="sm:hidden hover:bg-red-50 hover:text-red-500 
                 transition-colors duration-200 rounded-lg p-2"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export const TaskList: React.FC = () => {
  const tasks = useAppSelector(state => state.tasks);
  const dispatch = useAppDispatch();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      dispatch(addTask({
        title: newTaskTitle.trim(),
        completed: false,
        pomodoros: 1,
        completedPomodoros: 0,
      }));
      setNewTaskTitle('');
    }
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    dispatch(updateTask({ id, updates }));
  };

  return (
    <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg 
                    rounded-xl shadow-xl p-4 sm:p-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-violet-100 text-violet-600">
            <ListTodo className="w-5 h-5" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Tasks for Today
          </h2>
        </div>
        
        {tasks.length > 0 && (
          <div className="text-sm text-gray-500">
            {tasks.filter(t => t.completed).length}/{tasks.length} completed
          </div>
        )}
      </div>
      
      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 sm:gap-3 mb-6">
        <Input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          className={cn(
            "flex-1 h-10 sm:h-12 rounded-xl border-gray-200",
            "bg-white/50 backdrop-blur-sm",
            "focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
            "placeholder:text-gray-400 text-gray-600",
            "transition-all duration-200"
          )}
        />
        <Button 
          type="submit"
          disabled={!newTaskTitle.trim()}
          className={cn(
            "h-10 sm:h-12 px-3 sm:px-4",
            "bg-violet-500 hover:bg-violet-600 text-white rounded-xl",
            "shadow-lg shadow-violet-200/50 transition-all duration-200",
            "hover:shadow-xl hover:shadow-violet-200/60 hover:-translate-y-0.5",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </form>

      {/* Task List */}
      <div className="space-y-2 sm:space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={(updates) => handleUpdateTask(task.id, updates)}
            onDelete={() => dispatch(deleteTask(task.id))}
          />
        ))}
        
        {tasks.length === 0 && (
          <Alert className="bg-white text-gray-500 border border-gray-100">
            <AlertTitle className="text-gray-700">
              No tasks found</AlertTitle>
            <AlertDescription className="text-gray-600">
              Get started by adding a new task using the form above.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default TaskList;