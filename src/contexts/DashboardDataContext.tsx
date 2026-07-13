import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react";
import { students as initialStudents } from "@/data/schoolData";

export type Term = "Term 1" | "Term 2" | "Term 3";

export interface DashboardStats {
  // Main stats
  totalStudents: number;
  totalStaff: number;
  teachingStaff: number;
  nonTeachingStaff: number;
  
  // Financial stats
  revenue: number;
  outstandingFees: number;
  
  // Academic stats
  avgPerformance: number;
  attendanceRate: number;
  attendanceAlerts: number;
  
  // Student breakdown
  maleStudents: number;
  femaleStudents: number;
  boardingStudents: number;
  dayStudents: number;
  
  // Admission stats
  admissionInquiries: number;
  pendingApprovals: number;
}

interface DashboardDataContextType {
  currentTerm: Term;
  setCurrentTerm: (term: Term) => void;
  stats: DashboardStats;
  updateStats: (updates: Partial<DashboardStats>) => void;
  resetStats: () => void;
  resetAllTerms: () => void;
  incrementStat: (key: keyof DashboardStats, amount: number) => void;
  resetFinancialData: () => void;
  syncFinancialData: () => void;
}

const DashboardDataContext = createContext<DashboardDataContextType | null>(null);

const STORAGE_KEY_PREFIX = "dashboard_stats_";
const CURRENT_TERM_KEY = "dashboard_current_term";

const initialStats: DashboardStats = {
  totalStudents: 0,
  totalStaff: 0,
  teachingStaff: 0,
  nonTeachingStaff: 0,
  revenue: 0,
  outstandingFees: 0,
  avgPerformance: 0,
  attendanceRate: 0,
  attendanceAlerts: 0,
  maleStudents: 0,
  femaleStudents: 0,
  boardingStudents: 0,
  dayStudents: 0,
  admissionInquiries: 0,
  pendingApprovals: 0,
};

function getStorageKey(term: Term): string {
  return STORAGE_KEY_PREFIX + term.replace(" ", "_");
}

function getStoredStats(term: Term): DashboardStats {
  try {
    const data = localStorage.getItem(getStorageKey(term));
    const stats = data ? JSON.parse(data) : initialStats;
    
    // On first load, initialize outstandingFees from student data if not set
    if (stats.outstandingFees === 0 && !data) {
      stats.outstandingFees = initialStudents.reduce((sum, s) => sum + s.feeBalance, 0);
    }
    
    return stats;
  } catch {
    const stats = { ...initialStats };
    // Initialize outstandingFees from student data
    stats.outstandingFees = initialStudents.reduce((sum, s) => sum + s.feeBalance, 0);
    return stats;
  }
}

function getStoredTerm(): Term {
  try {
    const term = localStorage.getItem(CURRENT_TERM_KEY);
    return (term as Term) || "Term 1";
  } catch {
    return "Term 1";
  }
}

function saveStats(term: Term, data: DashboardStats) {
  try {
    localStorage.setItem(getStorageKey(term), JSON.stringify(data));
  } catch (e) {
    console.error("Error saving dashboard stats:", e);
  }
}

function saveTerm(term: Term) {
  try {
    localStorage.setItem(CURRENT_TERM_KEY, term);
  } catch (e) {
    console.error("Error saving current term:", e);
  }
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [currentTerm, setCurrentTermState] = useState<Term>(() => getStoredTerm());
  const [stats, setStats] = useState<DashboardStats>(() => getStoredStats(currentTerm));

  // Persist stats whenever they change
  useEffect(() => {
    saveStats(currentTerm, stats);
  }, [stats, currentTerm]);

  const setCurrentTerm = useCallback((term: Term) => {
    setCurrentTermState(term);
    saveTerm(term);
    const termStats = getStoredStats(term);
    setStats(termStats);
    // Sync outstanding fees when switching terms
    const totalOutstanding = initialStudents.reduce((sum, s) => sum + s.feeBalance, 0);
    if (termStats.outstandingFees === 0) {
      termStats.outstandingFees = totalOutstanding;
    }
    setStats(termStats);
  }, []);

  const updateStats = useCallback((updates: Partial<DashboardStats>) => {
    setStats(prev => ({ ...prev, ...updates }));
  }, []);

  const resetStats = useCallback(() => {
    setStats(initialStats);
  }, []);

  const resetAllTerms = useCallback(() => {
    ["Term 1", "Term 2", "Term 3"].forEach((term) => {
      localStorage.removeItem(getStorageKey(term as Term));
    });
    setStats(initialStats);
  }, []);

  const incrementStat = useCallback((key: keyof DashboardStats, amount: number) => {
    setStats(prev => ({
      ...prev,
      [key]: Math.max(0, (prev[key] as number) + amount)
    }));
  }, []);

  const resetFinancialData = useCallback(() => {
    setStats(prev => ({
      ...prev,
      revenue: 0,
      outstandingFees: 0,
    }));
  }, []);

  const syncFinancialData = useCallback(() => {
    // Sync outstandingFees with actual student data
    const totalOutstanding = initialStudents.reduce((sum, s) => sum + s.feeBalance, 0);
    setStats(prev => ({
      ...prev,
      outstandingFees: totalOutstanding,
    }));
  }, []);

  return (
    <DashboardDataContext.Provider value={{ currentTerm, setCurrentTerm, stats, updateStats, resetStats, resetAllTerms, incrementStat, resetFinancialData, syncFinancialData }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData must be used within a DashboardDataProvider");
  }
  return context;
}
