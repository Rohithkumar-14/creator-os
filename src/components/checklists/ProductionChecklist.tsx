import React from 'react';
import { ProductionChecklist as IChecklist } from '../../types';
import { 
  Check, 
  Search, 
  FileText, 
  Video, 
  Scissors, 
  Image as ImageIcon, 
  Subtitles, 
  Rocket 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductionChecklistProps {
  contentId: string;
  checklist: IChecklist;
  onToggle: (contentId: string, itemKey: keyof IChecklist) => void;
  compact?: boolean;
}

export const ProductionChecklist: React.FC<ProductionChecklistProps> = ({
  contentId,
  checklist,
  onToggle,
  compact = false,
}) => {
  const steps: { key: keyof IChecklist; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'research', label: 'Research & Angle', icon: Search },
    { key: 'scripting', label: 'Script & Talking Points', icon: FileText },
    { key: 'recording', label: 'A/B-Roll Footage', icon: Video },
    { key: 'editing', label: 'Rough Cut & Sound Design', icon: Scissors },
    { key: 'thumbnails', label: 'Thumbnail Variants', icon: ImageIcon },
    { key: 'captions', label: 'Captions & Metadata', icon: Subtitles },
    { key: 'published', label: 'Publish to Platform', icon: Rocket },
  ];

  const safeChecklist = checklist || {
    research: false,
    scripting: false,
    recording: false,
    editing: false,
    thumbnails: false,
    captions: false,
    published: false,
  };

  const totalSteps = steps.length;
  const completedSteps = steps.filter((s) => safeChecklist[s.key]).length;
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  const handleToggle = (key: keyof IChecklist) => {
    // If user is completing the last item (or published), trigger celebratory confetti!
    if (!safeChecklist[key] && (key === 'published' || completedSteps === totalSteps - 1)) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Safe fallback if confetti canvas fails
      }
    }
    onToggle(contentId, key);
  };

  return (
    <div className="space-y-3">
      {/* Progress Header */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-text-secondary flex items-center gap-1.5">
          Production Pipeline
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
          progressPercent === 100 
            ? 'bg-status-success/20 text-status-success border border-status-success/30' 
            : 'bg-accent/15 text-accent border border-accent/25'
        }`}>
          {progressPercent}% Done ({completedSteps}/{totalSteps})
        </span>
      </div>

      {/* Progress Bar */}
      <div 
        className="w-full bg-surface-muted rounded-full h-2 overflow-hidden border border-border"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Production progress"
      >
        <div
          className={`h-full transition-all duration-300 ease-out rounded-full ${
            progressPercent === 100 ? 'bg-status-success' : 'bg-gradient-to-r from-accent to-purple-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Grid */}
      <div className={`grid ${compact ? 'grid-cols-1 gap-1.5' : 'grid-cols-1 sm:grid-cols-2 gap-2'} pt-1`}>
        {steps.map((step) => {
          const isDone = Boolean(safeChecklist[step.key]);
          const Icon = step.icon;

          return (
            <button
              key={step.key}
              type="button"
              onClick={() => handleToggle(step.key)}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all text-xs font-medium focus-ring select-none cursor-pointer ${
                isDone
                  ? 'bg-accent/10 border-accent/30 text-text-primary'
                  : 'bg-surface-elevated/40 border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
              }`}
              aria-label={`Mark ${step.label} as ${isDone ? 'incomplete' : 'completed'}`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-3.5 h-3.5 ${isDone ? 'text-accent' : 'text-text-muted'}`} />
                <span className={isDone ? 'line-through text-text-muted font-normal' : ''}>
                  {step.label}
                </span>
              </div>

              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                  isDone
                    ? 'bg-accent border-accent text-white shadow-sm'
                    : 'border-border bg-surface-muted'
                }`}
              >
                {isDone && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
