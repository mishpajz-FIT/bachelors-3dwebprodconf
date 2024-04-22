interface SpinnerProps {
  dark: boolean;
}

export const Spinner = ({ dark }: SpinnerProps) => {
  return (
    <span
      className="inline-block size-3.5 rounded-full"
      style={{
        animation: "rotation 1s linear infinite",
        borderWidth: "2px",
        borderColor: `${dark ? "#000" : "#FFF"} transparent transparent`,
      }}
    />
  );
};
