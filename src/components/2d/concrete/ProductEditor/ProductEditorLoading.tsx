import { useProgress } from "@react-three/drei";

export const ProductEditorLoading = () => {
  const { progress } = useProgress();

  return (
    <div className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 md:w-1/4 lg:w-1/5">
      <div className="w-full rounded-full bg-gray-100 shadow-lg dark:bg-gray-800">
        <div
          className="rounded-full bg-slate-800 p-1 text-center text-xs font-medium leading-none text-white transition-[width] duration-75 ease-linear dark:bg-slate-100 dark:text-black"
          style={{ width: `${Math.max(progress, 15)}%` }}
        >
          {(Math.round(progress * 10) / 10).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
