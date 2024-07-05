type ErrorMessageProsps = {
   children: React.ReactNode;
};

export default function ErrorMessage({ children }: ErrorMessageProsps) {
   return (
      <p className="bg-red-600 p-2 text-white font-bold text-sm text-center">
         {children}
      </p>
   );
}
