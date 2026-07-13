import { createContext, useContext, useState, useMemo, type ReactNode, useEffect } from "react";
import { type UserRole, type UserAccount, userAccounts, getStudentById } from "@/data/schoolData";

interface AuthState {
  user: UserAccount | null;
  login: (email: string, password: string) => boolean;
  loginStudent: (personId: string) => boolean;
  logout: () => void;
  registerUser: (newUser: UserAccount) => void;
  deleteAccount: (personId: string) => void;
  updateUserProfile: (updates: Partial<UserAccount>) => Promise<boolean>;
  accounts: UserAccount[];
  isAuthenticated: boolean;
  getUserById: (id: string) => UserAccount | undefined;
  getUserByEmail: (email: string) => UserAccount | undefined;
  getUserByPersonId: (personId: string) => UserAccount | undefined;
}

const AuthContext = createContext<AuthState | null>(null);

// Helper function to persist user to localStorage
const persistUser = (user: UserAccount | null) => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
  }
};

// Helper function to retrieve user from localStorage
const retrievePersistedUser = (): UserAccount | null => {
  try {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving persisted user:", error);
    return null;
  }
};

// Helper function to persist all accounts to localStorage
const persistAccounts = (accounts: UserAccount[]) => {
  try {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  } catch (error) {
    console.error("Error persisting accounts:", error);
  }
};

// Helper function to retrieve accounts from localStorage
const retrievePersistedAccounts = (): UserAccount[] | null => {
  try {
    const stored = localStorage.getItem("accounts");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving persisted accounts:", error);
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Try to restore from localStorage on initial load
  const persistedUser = retrievePersistedUser();
  const persistedAccounts = retrievePersistedAccounts();
  
  const [user, setUser] = useState<UserAccount | null>(persistedUser);
  const [accounts, setAccounts] = useState<UserAccount[]>(persistedAccounts || userAccounts);

  // Create efficient lookup maps for large datasets
  const accountMaps = useMemo(() => {
    const emailMap = new Map<string, UserAccount>();
    const idMap = new Map<string, UserAccount>();
    
    accounts.forEach(account => {
      emailMap.set(account.email.toLowerCase(), account);
      idMap.set(account.id, account);
    });

    return { emailMap, idMap };
  }, [accounts]);

  const login = (email: string, password: string): boolean => {
    const found = accountMaps.emailMap.get(email.toLowerCase());
    if (found && found.password === password) {
      setUser(found);
      persistUser(found);
      return true;
    }
    return false;
  };

  const loginStudent = (personId: string): boolean => {
    const found = getUserByPersonId(personId);
    if (found && found.role === "student") {
      setUser(found);
      persistUser(found);
      return true;
    }

    const student = getStudentById(personId);
    if (student) {
      const fallbackAccount: UserAccount = {
        id: `U-${student.id}`,
        email: student.email,
        password: "student123",
        role: "student",
        personId: student.id,
        name: student.name,
        status: "active",
      };

      setAccounts(prev => {
        const exists = prev.some(account => account.personId === personId);
        if (exists) return prev;

        const updated = [...prev, fallbackAccount];
        persistAccounts(updated);
        return updated;
      });

      setUser(fallbackAccount);
      persistUser(fallbackAccount);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  const registerUser = (newUser: UserAccount) => {
    setAccounts(prev => {
      const updated = [...prev, newUser];
      persistAccounts(updated);
      return updated;
    });
  };

  const deleteAccount = (personId: string) => {
    setAccounts(prev => {
      const updated = prev.filter(account => account.personId !== personId);
      persistAccounts(updated);
      return updated;
    });
  };

  const updateUserProfile = async (updates: Partial<UserAccount>): Promise<boolean> => {
    try {
      // TODO: Call backend API to persist changes
      // const response = await fetch(`/api/users/${user?.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update the user in state
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        persistUser(updatedUser);
        
        // Update in accounts list
        setAccounts(prev => {
          const updated = prev.map(acc => acc.id === user.id ? updatedUser : acc);
          persistAccounts(updated);
          return updated;
        });
      }

      return true;
    } catch (error) {
      console.error("Failed to update profile:", error);
      return false;
    }
  };

  const getUserById = (id: string): UserAccount | undefined => {
    return accountMaps.idMap.get(id);
  };

  const getUserByEmail = (email: string): UserAccount | undefined => {
    return accountMaps.emailMap.get(email.toLowerCase());
  };

  const getUserByPersonId = (personId: string): UserAccount | undefined => {
    return accounts.find(account => account.personId === personId);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginStudent, logout, registerUser, deleteAccount, updateUserProfile, accounts, isAuthenticated: !!user, getUserById, getUserByEmail, getUserByPersonId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
