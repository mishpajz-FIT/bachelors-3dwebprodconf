import { EditComponentColorsColorTile } from "./EditComponentColorsColorTile.tsx";
import { useComponent } from "../../../../../hooks/useComponent.ts";

interface EditComponentColorsProps {
  componentId: string;
}

export const EditComponentColors = ({
  componentId,
}: EditComponentColorsProps) => {
  const { component, componentSpec } = useComponent(componentId);

  return (
    <>
      {Object.entries(componentSpec.materialSpecs).map(
        ([materialSpecId, materialSpec], materialIndex) => {
          const sortedColorVariations = Object.entries(
            materialSpec.colorVariationsSpecs
          ).sort(([colorSpecIdA, colorSpecA], [colorSpecIdB, colorSpecB]) => {
            const selectedColorSpec = component.materials[materialSpecId];

            if (colorSpecIdA === selectedColorSpec) return -1;
            if (colorSpecIdB === selectedColorSpec) return 1;

            return colorSpecA.sortIndex - colorSpecB.sortIndex;
          });

          return (
            <div key={materialIndex} className="p-1">
              <h2 className="mt-1 text-sm font-normal">{materialSpec.name}</h2>
              <div className="mt-1 flex flex-wrap justify-center rounded-md p-1 outline outline-1 outline-slate-100 dark:outline-zinc-800">
                {sortedColorVariations.map(([colorSpecId, colorSpec]) => (
                  <EditComponentColorsColorTile
                    componentId={componentId}
                    materialSpecId={materialSpecId}
                    colorSpec={colorSpec}
                    colorSpecId={colorSpecId}
                    key={colorSpecId}
                  />
                ))}
              </div>
            </div>
          );
        }
      )}
    </>
  );
};
