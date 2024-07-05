import { useReducer, createContext, useMemo } from "react";
import {
   BudgetActions,
   budgetReducer,
   BudgetState,
   initialState,
} from "../reducers/budget-reducer";

type BudgetContextProps = {
   state: BudgetState;
   dispatch: React.Dispatch<BudgetActions>;
   totalExpense: number;
   remainingBudget: number;
};

export const BudgetContext = createContext<BudgetContextProps>(null!);

type BudgetProviderProps = {
   children: React.ReactNode;
};

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
   const [state, dispatch] = useReducer(budgetReducer, initialState);

   const totalExpense = useMemo(() => {
      return state.expenses.reduce(
         (total, expense) => total + expense.amount,
         0
      );
   }, [state.expenses]);

   const remainingBudget = useMemo(() => {
      return state.budget - totalExpense;
   }, [state.expenses]);

   return (
      <BudgetContext.Provider
         value={{ state, dispatch, totalExpense, remainingBudget }}
      >
         {children}
      </BudgetContext.Provider>
   );
};
