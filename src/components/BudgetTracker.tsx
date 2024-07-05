import AmountDisplay from "./AmountDisplay";
import { useBudget } from "../hooks/useBudget";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useMemo } from "react";

export default function BudgetTracker() {
   const { dispatch, state, totalExpense, remainingBudget } = useBudget();

   const percentage = useMemo(() => {
      return Math.round((totalExpense / state.budget) * 100);
   }, [totalExpense, state.budget]);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         <div className="flex justify-center">
            <CircularProgressbar
               value={percentage}
               styles={buildStyles({
                  pathColor: percentage > 70 ? "#DC2626" : "#3b82f6",
                  trailColor: "#f5f5f5",
                  textSize: 8,
                  textColor: "#3b82f6",
               })}
               text={`${percentage}% Gastado`}
            />
         </div>

         <div className="flex flex-col justify-center items-center gap-8">
            <button
               type="button"
               className="bg-pink-600 w-full p-2 text-white uppercase font-bold"
               onClick={() => dispatch({ type: "RESET_APP" })}
            >
               Resetear App
            </button>

            <AmountDisplay label="Presupuesto" amount={state.budget} />
            <AmountDisplay label="Disponible" amount={remainingBudget} />
            <AmountDisplay label="Gastado" amount={totalExpense} />
         </div>
      </div>
   );
}
