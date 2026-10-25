import React, { useState, useRef } from 'react';
import { 
  UserSettings, 
  AppStateData 
} from '../../types';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { getStorageStats } from '../../utils/storage';
import { YoutubeIcon, InstagramIcon } from '../common/PlatformIcons';
import { 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

interface SettingsViewProps {
  state: AppStateData;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onExportData: () => void;
  onImportData: (jsonString: string) => { success: boolean; error?: string };
  onResetToSample: () => void;
  onClearAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetToSample,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const stats = getStorageStats(state);
  const usedKb = (stats.usedBytes / 1024).toFixed(2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = onImportData(content);
      if (!res.success) {
        setImportError(res.error || 'Failed to import backup.');
      } else {
        setImportError(null);
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read the selected backup file.');
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Privacy and Offline Notice */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-card flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-accent/15 text-accent flex-shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-text-primary">
            Private, Local-First Architecture
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Creator OS stores 100% of your video scripts, hooks, research links, and tasks inside your local browser storage. No cloud database or third-party servers track your creative ideas. To keep backups or move to another machine, use the JSON Export below.
          </p>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border pb-3">
          Workspace Preferences
        </h3>

        {/* Theme Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Appearance & Theme</h4>
            <p className="text-xs text-text-secondary">Switch between dark obsidian theme and crisp daylight theme</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'dark' })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all focus-ring ${
                state.settings.theme === 'dark'
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Studio</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ theme: 'light' })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all focus-ring ${
                state.settings.theme === 'light'
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Studio</span>
            </button>
          </div>
        </div>

        {/* Default Platform */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">Default Video Platform</h4>
            <p className="text-xs text-text-secondary">Pre-selects platform when opening the New Video modal</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateSettings({ defaultPlatform: 'youtube' })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all focus-ring ${
                state.settings.defaultPlatform === 'youtube'
                  ? 'bg-red-500/15 text-red-400 border-red-500 shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
              }`}
            >
              <YoutubeIcon className="w-4 h-4 text-red-500" />
              <span>YouTube</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateSettings({ defaultPlatform: 'instagram' })}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all focus-ring ${
                state.settings.defaultPlatform === 'instagram'
                  ? 'bg-pink-500/15 text-pink-400 border-pink-500 shadow-sm'
                  : 'bg-surface-elevated text-text-secondary hover:text-text-primary border-border'
              }`}
            >
              <InstagramIcon className="w-4 h-4 text-pink-500" />
              <span>Instagram</span>
            </button>
          </div>
        </div>

        {/* In-App Notifications Preference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60">
          <div>
            <h4 className="text-sm font-semibold text-text-primary">In-App Notifications</h4>
            <p className="text-xs text-text-secondary">Shows deadline badges, overdue alerts, and celebratory milestone toasts</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={state.settings.notificationsEnabled}
              onChange={(e) => onUpdateSettings({ notificationsEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent" />
          </label>
        </div>
      </div>

      {/* Storage & Backup Section */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-card space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-border pb-3 flex items-center justify-between">
          <span>Data Storage & Backups</span>
          <span className="text-xs font-semibold text-accent font-mono">
            {usedKb} KB used
          </span>
        </h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-center">
            <span className="text-xl font-bold text-text-primary">{stats.totalItems.content}</span>
            <p className="text-[11px] text-text-muted mt-0.5">Video Projects</p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-center">
            <span className="text-xl font-bold text-text-primary">{stats.totalItems.tasks}</span>
            <p className="text-[11px] text-text-muted mt-0.5">Active Tasks</p>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-center">
            <span className="text-xl font-bold text-text-primary">{stats.totalItems.notes}</span>
            <p className="text-[11px] text-text-muted mt-0.5">Vault Notes</p>
          </div>
        </div>

        {importError && (
          <div className="p-3.5 rounded-xl bg-status-error/15 border border-status-error/30 text-status-error text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        {/* Export and Import buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            icon={Download}
            onClick={onExportData}
            className="flex-1 justify-center"
          >
            Export Backup (.json)
          </Button>

          <Button
            variant="outline"
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 justify-center"
          >
            Import Backup (.json)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <p className="text-[11px] text-text-muted">
          Importing a backup validates all content and tasks before replacing current state. If a backup is malformed or invalid, your existing data remains untouched.
        </p>

        {/* Reset Actions */}
        <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <h4 className="text-xs font-bold text-text-primary">Reset Workspace Data</h4>
            <p className="text-[11px] text-text-secondary">Reset to original sample data or wipe all local items</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => setResetDialogOpen(true)}
              className="text-xs py-1.5"
            >
              Reset to Sample
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setClearDialogOpen(true)}
              className="text-xs py-1.5"
            >
              Clear Workspace
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={onResetToSample}
        title="Reset to Sample Data?"
        message="This will overwrite current changes and reload the original YouTube and Instagram sample projects, tasks, and ideas. Are you sure you want to proceed?"
        confirmLabel="Reset to Sample"
        isDestructive={false}
      />

      <ConfirmDialog
        isOpen={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={onClearAll}
        title="Clear All Workspace Data?"
        message="This will permanently delete all your content pipelines, production tasks, and diary notes from this browser. This action cannot be undone unless you have an exported JSON backup."
        confirmLabel="Clear All Data"
        isDestructive={true}
      />
    </div>
  );
};
