import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface TopBarProps {
  children: ReactNode;
}

export const TopBar = ({ children }: TopBarProps) => {
  const baseButtonStyle =
    "font-bold tracking-tight underlined-selection active:scale-95 transition duration-150 ease-in-out";

  return (
    <>
      <div className="other-background z-10 flex h-12 flex-row items-center justify-center gap-10 border-b border-gray-200 p-2 shadow-sm dark:border-zinc-700">
        <NavLink
          to="/cataloguecomposer"
          className={({ isActive }) => {
            return `${isActive ? "underline" : "decoration-white"} ${baseButtonStyle}`;
          }}
        >
          Catalogue Composer
        </NavLink>
        <NavLink
          to="/productcomposer"
          className={({ isActive }) => {
            return `${isActive ? "underline" : "decoration-white"} ${baseButtonStyle}`;
          }}
        >
          Product Composer
        </NavLink>
      </div>

      {children}
    </>
  );
};
