import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react";
import { type AdmissionApplication, type FeePayment, admissionApplications, feePayments } from "@/data/schoolData";

interface AdminDataContextType {
  // Admissions
  admissions: AdmissionApplication[];
  updateAdmission: (appId: string, updates: Partial<AdmissionApplication>) => void;
  deleteAdmission: (appId: string) => void;
  addAdmission: (app: AdmissionApplication) => void;
  
  // Fee Payments
  payments: FeePayment[];
  addPayment: (payment: FeePayment) => void;
  deletePayment: (paymentId: string) => void;
  
  // Promotion records
  promotions: any[];
  addPromotion: (promo: any) => void;
  updatePromotion: (promoId: string, updates: any) => void;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

const STORAGE_KEY_ADMISSIONS = "admin_admissions";
const STORAGE_KEY_PAYMENTS = "admin_fee_payments";
const STORAGE_KEY_PROMOTIONS = "admin_promotions";

function getStoredAdmissions(): AdmissionApplication[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ADMISSIONS);
    return data ? JSON.parse(data) : admissionApplications;
  } catch {
    return admissionApplications;
  }
}

function getStoredPayments(): FeePayment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PAYMENTS);
    return data ? JSON.parse(data) : feePayments;
  } catch {
    return feePayments;
  }
}

function getStoredPromotions(): any[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROMOTIONS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveAdmissions(data: AdmissionApplication[]) {
  try {
    localStorage.setItem(STORAGE_KEY_ADMISSIONS, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving admissions:", e);
  }
}

function savePayments(data: FeePayment[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PAYMENTS, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving payments:", e);
  }
}

function savePromotions(data: any[]) {
  try {
    localStorage.setItem(STORAGE_KEY_PROMOTIONS, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving promotions:", e);
  }
}

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(() => getStoredAdmissions());
  const [payments, setPayments] = useState<FeePayment[]>(() => getStoredPayments());
  const [promotions, setPromotions] = useState<any[]>(() => getStoredPromotions());

  // Persist admissions
  useEffect(() => {
    saveAdmissions(admissions);
  }, [admissions]);

  // Persist payments
  useEffect(() => {
    savePayments(payments);
  }, [payments]);

  // Persist promotions
  useEffect(() => {
    savePromotions(promotions);
  }, [promotions]);

  const updateAdmission = useCallback((appId: string, updates: Partial<AdmissionApplication>) => {
    setAdmissions(prev => prev.map(app => app.id === appId ? { ...app, ...updates } : app));
  }, []);

  const deleteAdmission = useCallback((appId: string) => {
    setAdmissions(prev => prev.filter(app => app.id !== appId));
  }, []);

  const addAdmission = useCallback((app: AdmissionApplication) => {
    setAdmissions(prev => [...prev, app]);
  }, []);

  const addPayment = useCallback((payment: FeePayment) => {
    setPayments(prev => [...prev, payment]);
  }, []);

  const deletePayment = useCallback((paymentId: string) => {
    setPayments(prev => prev.filter(p => p.id !== paymentId));
  }, []);

  const addPromotion = useCallback((promo: any) => {
    setPromotions(prev => [...prev, promo]);
  }, []);

  const updatePromotion = useCallback((promoId: string, updates: any) => {
    setPromotions(prev => prev.map(p => p.id === promoId ? { ...p, ...updates } : p));
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        admissions,
        updateAdmission,
        deleteAdmission,
        addAdmission,
        payments,
        addPayment,
        deletePayment,
        promotions,
        addPromotion,
        updatePromotion,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used inside AdminDataProvider");
  }
  return context;
}
