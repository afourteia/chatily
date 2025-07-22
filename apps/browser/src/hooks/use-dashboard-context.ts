import { createContext, useContext } from 'react';

// Define the context type
export interface DashboardContextType {
  firstName: string;
  lastName: string;
  phone: string;
  employeeId: string;
  departmentId: string;
  userId: string;
  productionStartDateUTC: Date;
  productionEndDateUTC: Date;
  role: string[];
  departmentReviewPermissions: string[];
}

// Create the context
export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

// Custom hook to use this context
export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within dashboard outlet');
  }
  return context;
};
