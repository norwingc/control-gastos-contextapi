import { Category, DraftExpense, Expense } from "../types";
import { v4 as uuidv4 } from "uuid";

export type BudgetActions =
   | { type: "ADD_BUDGET"; payload: { budget: number } }
   | { type: "SHOW_MODAL" }
   | { type: "ADD_EXPENSE"; payload: { expense: DraftExpense } }
   | { type: "REMOVE_EXPENSE"; payload: { id: Expense["id"] } }
   | { type: "GET_EXPENSE_BY_ID"; payload: { id: Expense["id"] } }
   | { type: "UPDATE_EXPENSE"; payload: { expense: Expense } }
   | { type: "RESET_APP" }
   | { type: "FILTER_BY_CATEGORY"; payload: { id: Category["id"] } };

export type BudgetState = {
   budget: number;
   modal: boolean;
   expenses: Expense[];
   editingId: Expense["id"];
   currentCategory: Category["id"];
};

const initialBudget = (): number => {
   const localStorageBudget = localStorage.getItem("budget");
   return localStorageBudget ? Number(localStorageBudget) : 0;
};

const initialExpenses = (): Expense[] => {
   const localStorageExpenses = localStorage.getItem("expenses");
   return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
};

export const initialState: BudgetState = {
   budget: initialBudget(),
   modal: false,
   expenses: initialExpenses(),
   editingId: "",
   currentCategory: "",
};

const createExpense = (draftExpense: DraftExpense): Expense => {
   return {
      id: uuidv4(),
      ...draftExpense,
   };
};

export const budgetReducer = (
   state: BudgetState = initialState,
   action: BudgetActions
) => {
   if (action.type === "ADD_BUDGET") {
      return {
         ...state,
         budget: action.payload.budget,
      };
   }

   if (action.type === "SHOW_MODAL") {
      return {
         ...state,
         modal: !state.modal,
         editingId: "",
      };
   }

   if (action.type === "ADD_EXPENSE") {
      const expense = createExpense(action.payload.expense);
      return {
         ...state,
         expenses: [...state.expenses, expense],
         modal: !state.modal,
      };
   }

   if (action.type === "REMOVE_EXPENSE") {
      return {
         ...state,
         expenses: state.expenses.filter(
            (expense) => expense.id !== action.payload.id
         ),
      };
   }

   if (action.type === "GET_EXPENSE_BY_ID") {
      return {
         ...state,
         editingId: action.payload.id,
         modal: !state.modal,
      };
   }

   if (action.type === "UPDATE_EXPENSE") {
      return {
         ...state,
         expenses: state.expenses.map((expense) => {
            if (expense.id === action.payload.expense.id) {
               return action.payload.expense;
            }
            return expense;
         }),
         modal: !state.modal,
         editingId: "",
      };
   }

   if (action.type === "RESET_APP") {
      return {
         ...state,
         budget: 0,
         expenses: [],
         editingId: "",
      };
   }

   if (action.type === "FILTER_BY_CATEGORY") {
      return {
         ...state,
         currentCategory: action.payload.id,
      };
   }

   return state;
};
