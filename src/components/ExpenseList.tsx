import { useMemo } from "react";
import { useBudget } from "../hooks/useBudget";
import ExpenseDetails from "./ExpenseDetails";

export default function ExpenseList() {
   const { state } = useBudget();

   const filterExpenses = state.currentCategory
      ? state.expenses.filter(
           (expense) => expense.category === state.currentCategory
        )
      : state.expenses;

   const isEmpty = useMemo(() => filterExpenses.length === 0, [filterExpenses]);

   return (
      <div className="mt-10 bg-white shadow-lg rounded-lg p-10">
         {isEmpty ? (
            <p className="text-center mb-4 text-2xl text-gray-600 font-bold">
               No hay gastos aún
            </p>
         ) : (
            <>
               <p className="text-center mb-4 text-2xl text-gray-600 font-bold">
                  Listado de gastos
               </p>
               {filterExpenses.map((expense) => (
                  <ExpenseDetails key={expense.id} expense={expense} />
               ))}
            </>
         )}
      </div>
   );
}
