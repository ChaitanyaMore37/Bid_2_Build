export interface UserProfile { name: string; education: string; careerGoal: string; skills: string[]; desiredSkills: string[]; interests: string[] }
export interface Mentor { id: string; name: string; title: string; company: string; experience: number; domain: string; expertise: string[]; skills: string[]; focus: string; bio: string; interests: string[]; color: string }
export interface MentorMatch { mentor: Mentor; score: number; reasons: string[]; overlap: string[]; desired: string[]; breakdown: {career: number; desired: number; existing: number; interests: number} }
export interface LearningResource { id: string; title: string; type: string; skill: string; description: string; content: string[] }
export interface Skill { name: string; reason: string; relevance: string }
export interface SavedItem { id: string; kind: 'mentor' | 'resource' }
export interface ActivityLog { id: string; action: string; entity: string; timestamp: string; description?: string }
export interface Feedback { id: string; about: string; entity: string; helpful: string; improvement: string; comments: string; timestamp: string }
export interface ProgressRecord { month: string; Python: number; 'Machine Learning': number; DSA: number; Cloud: number; MLOps: number }
export interface GeneratedReport { id: string; timestamp: string; profile: UserProfile; matches: MentorMatch[]; skills: Skill[]; resources: LearningResource[]; activityCount: number; savedMentors: number; savedResources: number; progress: ProgressRecord }
export interface AppData { version: 1; profile: UserProfile; saved: SavedItem[]; comparison: string[]; activities: ActivityLog[]; feedback: Feedback[] }
