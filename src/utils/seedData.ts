import { AppStateData, ContentItem, DiaryNote, TaskItem, UserSettings } from '../types';
import { getTodayString, parseLocalDate } from './date';

function offsetDate(days: number): string {
  const base = parseLocalDate(getTodayString());
  base.setDate(base.getDate() + days);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createInitialSeedData(): AppStateData {
  const contentItems: ContentItem[] = [
    {
      id: 'c-1',
      title: 'How I Built an Autonomous AI Agent in 24 Hours',
      platform: 'youtube',
      stage: 'recording',
      dueDate: offsetDate(2),
      publishDate: offsetDate(4),
      tags: ['AI', 'Coding', 'Tutorial', 'Deep Dive'],
      scriptNotes: `HOOK: Most people think AI agents require a massive team and months of research. In the next 12 minutes, I'll show you how I built a full production agent from scratch.

Outline:
1. Architecture overview & LLM tool calling loops
2. Setting up the memory & persistent state system
3. Connecting local terminal execution safely
4. Real demo: Solving a complex bug autonomously
5. Lessons learned & prompt injection gotchas`,
      researchLinks: [
        'https://developer.mozilla.org/en-US/docs/Web/API',
        'https://github.com/features/actions',
        'https://huggingface.co/papers'
      ],
      checklist: {
        research: true,
        scripting: true,
        recording: false,
        editing: false,
        thumbnails: false,
        captions: false,
        published: false,
      },
      isArchived: false,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'c-2',
      title: '3 Secret CSS Features You Need to Use in 2026',
      platform: 'instagram',
      stage: 'editing',
      dueDate: offsetDate(0), // Today!
      publishDate: offsetDate(1),
      tags: ['CSS', 'WebDev', 'Reels', 'Design'],
      scriptNotes: `Hook: Stop writing 50 lines of JavaScript for things CSS can do natively in 2026!
Point 1: CSS anchor positioning for instant tooltips.
Point 2: Scroll-driven animations with 3 lines of pure CSS.
Point 3: The :has() selector for stateful parent styling.
Call to Action: Comment "CSS" and I'll DM you the cheat sheet repo!`,
      researchLinks: [
        'https://web.dev/baseline',
        'https://caniuse.com'
      ],
      checklist: {
        research: true,
        scripting: true,
        recording: true,
        editing: false,
        thumbnails: true,
        captions: false,
        published: false,
      },
      isArchived: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'c-3',
      title: 'My Minimalist Desk Setup for Maximum Productivity',
      platform: 'youtube',
      stage: 'scripting',
      dueDate: offsetDate(5),
      publishDate: offsetDate(7),
      tags: ['Productivity', 'DeskSetup', 'Minimalism', 'Hardware'],
      scriptNotes: `Key message: Clutter in your physical workspace is cognitive friction for your creativity.
- The 49-inch curved monitor vs dual monitors
- Custom mechanical keyboard: Silent tactile switches
- Hidden cable management tray & magnetic chargers
- Ambient bias lighting behind the desk for late night editing`,
      researchLinks: [
        'https://kit.co',
        'https://store.google.com'
      ],
      checklist: {
        research: true,
        scripting: false,
        recording: false,
        editing: false,
        thumbnails: false,
        captions: false,
        published: false,
      },
      isArchived: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'c-4',
      title: '5 VS Code Shortcuts That Saved Me 200 Hours',
      platform: 'instagram',
      stage: 'published',
      dueDate: offsetDate(-3),
      publishDate: offsetDate(-3),
      tags: ['VSCode', 'Productivity', 'Shortcuts', 'QuickTips'],
      scriptNotes: `Hook visual: Hands moving across keyboard with terminal zooming in.
1. Multi-cursor selection (Ctrl+D / Cmd+D)
2. Quick file switcher (Cmd+P)
3. Move line up/down (Alt+Up/Down)
4. Toggle terminal with inline focus
5. Regex find and replace trick`,
      researchLinks: [
        'https://code.visualstudio.com/docs/getstarted/keybindings'
      ],
      checklist: {
        research: true,
        scripting: true,
        recording: true,
        editing: true,
        thumbnails: true,
        captions: true,
        published: true,
      },
      isArchived: false,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'c-5',
      title: 'Why Most Creators Quit Within 90 Days (And How Not To)',
      platform: 'youtube',
      stage: 'research',
      dueDate: offsetDate(9),
      publishDate: offsetDate(12),
      tags: ['CreatorEconomy', 'Mindset', 'Growth', 'Strategy'],
      scriptNotes: `Core theme: The difference between outcome obsession vs system consistency.
Data points:
- 90% of YouTube channels stall before reaching 1,000 subscribers
- Burnout happens when production cost exceeds creative energy
- Solution: The 80/20 batching workflow`,
      researchLinks: [
        'https://newsroom.tiktok.com',
        'https://blog.youtube'
      ],
      checklist: {
        research: false,
        scripting: false,
        recording: false,
        editing: false,
        thumbnails: false,
        captions: false,
        published: false,
      },
      isArchived: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'c-6',
      title: 'How I Edit 4K Reels in Under 15 Minutes',
      platform: 'instagram',
      stage: 'idea',
      dueDate: offsetDate(11),
      publishDate: offsetDate(14),
      tags: ['PremierePro', 'Reels', 'Editing', 'Workflow'],
      scriptNotes: `Idea: Showcase my Premiere Pro template with adjustment layers, auto-caption presets, and sound design markers.`,
      researchLinks: [],
      checklist: {
        research: false,
        scripting: false,
        recording: false,
        editing: false,
        thumbnails: false,
        captions: false,
        published: false,
      },
      isArchived: false,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    }
  ];

  const tasks: TaskItem[] = [
    {
      id: 't-1',
      contentId: 'c-2',
      title: 'Export 9:16 vertical render & test audio mix on phone',
      description: 'Check compression and make sure voiceover sits well with lofi background beat.',
      priority: 'urgent',
      dueDate: offsetDate(0),
      completed: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 't-2',
      contentId: 'c-1',
      title: 'Record B-roll of IDE terminal and live code agent running',
      description: 'Capture close-up monitor footage and keyboard typing with 50mm f/1.8 lens.',
      priority: 'high',
      dueDate: offsetDate(1),
      completed: false,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 't-3',
      contentId: 'c-1',
      title: 'Design high-contrast thumbnail: split screen code vs robot',
      description: 'Use bold yellow typography with 3-word hook: "BUILD AI NOW".',
      priority: 'high',
      dueDate: offsetDate(2),
      completed: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 't-4',
      contentId: 'c-3',
      title: 'Clean desk surface and re-route monitor arm cables',
      description: 'Need pristine shot before filming aesthetic B-roll.',
      priority: 'medium',
      dueDate: offsetDate(4),
      completed: false,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 't-5',
      title: 'Reply to comments on previous YouTube upload',
      description: 'Pin the best community feedback and answer top 10 questions.',
      priority: 'medium',
      dueDate: offsetDate(0),
      completed: true,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 't-6',
      title: 'Backup SD card footage to 2TB external SSD and cloud storage',
      description: 'Maintain 3-2-1 backup strategy for all raw footage.',
      priority: 'low',
      dueDate: offsetDate(3),
      completed: false,
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    }
  ];

  const notes: DiaryNote[] = [
    {
      id: 'n-1',
      title: 'High-Retention Video Hook Framework (The 3-Second Rule)',
      content: `Rule 1: Never start with "Hey guys, welcome back to my channel".
Rule 2: State the highest-stakes problem or show the final mind-blowing result in the first 2.5 seconds.
Rule 3: Cut dead air before the first syllable.
Example Hook: "I asked 5 different AI models to build the same web app. 4 of them broke instantly, but the last one did something terrifying."`,
      tags: ['Hook', 'Retention', 'Scripting', 'Framework'],
      type: 'hook',
      contentId: 'c-1',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'n-2',
      title: 'Reel Idea: Micro-interactions that make websites feel like native apps',
      content: `Showcase:
1. Magnetic button physics on cursor hover
2. Haptic-style subtle bounce on tab switches
3. Glassmorphic contextual popovers with backdrop-filter
4. Skeleton loaders that morph into actual content rather than popping in.`,
      tags: ['Idea', 'Design', 'UI/UX', 'Inspiration'],
      type: 'idea',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'n-3',
      title: 'Script Segment: Explaining Context Windows with Visual Metaphor',
      content: `Visual: A creator's physical desk.
"Think of an LLM's context window not like a computer hard drive, but like the surface area of your desk. Whatever papers are sitting on this desk right now, the model can read and reason across simultaneously. But when the desk gets flooded with too much junk, older papers fall off the edge."`,
      tags: ['Script', 'Metaphor', 'AI', 'Storytelling'],
      type: 'script',
      contentId: 'c-1',
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'n-4',
      title: 'Creator Burnout Prevention: The 4-Day Batching Model',
      content: `Monday: Research + Scripting (Brain power intensive)
Tuesday: Shooting B-roll & A-roll all in one batch (Camera setup once)
Wednesday: Rough assembly cut + sound design
Thursday: Color grading, captions, thumbnail variants & scheduling
Friday - Sunday: Off & Creative recharge without filming guilt`,
      tags: ['Productivity', 'Mindset', 'Research', 'LifeHacks'],
      type: 'research',
      contentId: 'c-5',
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    }
  ];

  const settings: UserSettings = {
    theme: 'dark',
    notificationsEnabled: true,
    defaultPlatform: 'youtube',
    compactView: false,
  };

  return {
    version: 1,
    content: contentItems,
    tasks,
    notes,
    settings,
  };
}
