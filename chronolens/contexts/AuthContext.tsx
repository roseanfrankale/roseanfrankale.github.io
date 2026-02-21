import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  birthdate?: string;
  location?: string;
  avatar?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (birthdate?: string, location?: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check if user is already logged in (on app start)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Check AsyncStorage or your backend for existing session
      // For now, simulate a check
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Example: Restore user from storage
      // const storedUser = await AsyncStorage.getItem('user');
      // const storedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
      // if (storedUser) {
      //   setUser(JSON.parse(storedUser));
      //   setHasCompletedOnboarding(storedOnboarding === 'true');
      // }

      setIsLoading(false);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Call your authentication API
      // For demo purposes, create a mock user
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
      };

      setUser(mockUser);

      // TODO: Save to AsyncStorage
      // await AsyncStorage.setItem('user', JSON.stringify(mockUser));

      // Existing users already completed onboarding before, skip it
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // TODO: Call your registration API
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API call

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
      };

      setUser(newUser);

      // TODO: Save to AsyncStorage
      // await AsyncStorage.setItem('user', JSON.stringify(newUser));

      // New signups always need onboarding
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const completeOnboarding = async (birthdate?: string, location?: string) => {
    try {
      // Update user with profile data
      if (user) {
        const updatedUser = { ...user, birthdate, location };
        setUser(updatedUser);

        // TODO: Save to AsyncStorage
        // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setHasCompletedOnboarding(true);

      // TODO: Save onboarding status
      // await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    } catch (error) {
      console.error("Complete onboarding error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setHasCompletedOnboarding(false);

      // TODO: Clear AsyncStorage
      // await AsyncStorage.removeItem('user');
      // await AsyncStorage.removeItem('hasCompletedOnboarding');
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        // TODO: Save to AsyncStorage
        // await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        
        // TODO: Call API to update profile on server
        // await api.updateProfile(updatedUser);
      }
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        hasCompletedOnboarding,
        login,
        signup,
        logout,
        completeOnboarding,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
