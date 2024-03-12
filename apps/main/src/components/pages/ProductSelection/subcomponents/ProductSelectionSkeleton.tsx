export const ProductSelectionSkeleton = () => {
  return (
    <div className="flex flex-wrap justify-start">
      {Array.from(Array(4).keys()).map((_, index) => (
        <div
          key={index}
          className="h-[160px] w-full p-2 md:w-1/2 lg:w-1/3 xl:w-1/3 2xl:w-1/3"
        >
          <div className="size-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
};
