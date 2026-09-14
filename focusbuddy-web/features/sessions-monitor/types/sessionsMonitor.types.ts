export interface AdminSessionMonitorItem {
    id: number;
    userId: number;
    userEmail: string;
    userFullName: string | null;
    goal: string | null;
    plannedDuration: number | null; // phút
    startedAt: string;
    lastHeartbeatAt: string | null;
    personalityCode: string | null;
    petName: string | null;
    isPaused: boolean;
}