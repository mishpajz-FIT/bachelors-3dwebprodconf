import { useProgress } from "@react-three/drei";

export const ProductEditorLoading = () => {
  const { progress } = useProgress();

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex w-full flex-col items-center gap-1">
        <div
          className="size-10 bg-[var(--primary-light)] dark:bg-[var(--primary-dark)]"
          style={{
            animation: "flips 2.5s infinite cubic-bezier(.23,.59,.28,.72)",
          }}
        />
        <span className="text-sm font-light lining-nums tracking-tighter">
          {(Math.round(progress * 10) / 10).toFixed(1)} %
        </span>
      </div>
    </div>
  );
};
