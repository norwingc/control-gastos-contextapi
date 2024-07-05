import { categories } from "../data/categories";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";

export default function ExpenseForm() {
   const [expense, setExpense] = useState<DraftExpense>({
      expenseName: "",
      amount: 0,
      category: "",
      date: new Date(),
   });

   const [error, setError] = useState("");
   const [previousAmount, setPreviousAmount] = useState(0);
   const { dispatch, state, remainingBudget } = useBudget();

   useEffect(() => {
      if (state.editingId) {
         const editingExpense = state.expenses.filter(
            (expense) => expense.id === state.editingId
         )[0];
         setExpense(editingExpense);
         setPreviousAmount(editingExpense.amount);
      }
   }, [state.editingId]);

   const handleChange = (
      e:
         | React.ChangeEvent<HTMLInputElement>
         | React.ChangeEvent<HTMLSelectElement>
   ) => {
      const { name, value } = e.target;
      const isAmountField = ["amount"].includes(name);
      setExpense({ ...expense, [name]: isAmountField ? Number(value) : value });
   };

   const handleChangeDate = (date: Value) => {
      setExpense({ ...expense, date });
   };

   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (Object.values(expense).includes("")) {
         setError("Todos los campos son obligatorios");
         return;
      }

      if (expense.amount - previousAmount > remainingBudget) {
         setError("No hay suficiente presupuesto");
         return;
      }

      if (state.editingId) {
         dispatch({
            type: "UPDATE_EXPENSE",
            payload: { expense: { id: state.editingId, ...expense } },
         });
      } else {
         dispatch({ type: "ADD_EXPENSE", payload: { expense } });
      }

      setExpense({
         expenseName: "",
         amount: 0,
         category: "",
         date: new Date(),
      });
      setPreviousAmount(0);
   };

   return (
      <form className="space-y-5" onSubmit={handleSubmit}>
         <legend className="uppercase text-2xl text-center font-black border-b-4 border-blue-500 py-2">
            {state.editingId ? "Editar Gasto" : "Añadir Gasto"}
         </legend>
         {error && <ErrorMessage>{error}</ErrorMessage>}

         <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">
               Nombre Gasto
            </label>
            <input
               type="text"
               id="expenseName"
               placeholder="Añade el nombre del gasto"
               className="bg-slate-100 p-2"
               name="expenseName"
               value={expense.expenseName}
               onChange={handleChange}
            />
         </div>
         <div className="flex flex-col gap-2">
            <label htmlFor="amount" className="text-xl">
               Cantidad
            </label>
            <input
               type="number"
               id="amount"
               placeholder="Añade la cantidad del gasto"
               className="bg-slate-100 p-2"
               name="amount"
               value={expense.amount}
               onChange={handleChange}
            />
         </div>
         <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-xl">
               Categoria
            </label>
            <select
               id="category"
               className="bg-slate-100 p-2"
               name="category"
               value={expense.category}
               onChange={handleChange}
            >
               <option value="">-- Seleccione --</option>
               {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                     {category.name}
                  </option>
               ))}
            </select>
         </div>

         <div className="flex flex-col gap-2">
            <label htmlFor="expenseName" className="text-xl">
               Fecha Gasto
            </label>
            <DatePicker
               className="bg-slate-100 p-2 b-0"
               value={expense.date}
               onChange={handleChangeDate}
            />
         </div>

         <input
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full p-2 text-white font-bold rounded-lg uppercase"
            value={state.editingId ? "Actualizar Gasto" : "Guardar Gasto"}
         />
      </form>
   );
}
