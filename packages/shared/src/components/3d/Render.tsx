import { ReactNode } from "react";
import { Material, Mesh, Object3D } from "three";

interface RenderProps {
  object: Object3D;
  materialOverrides?: Record<string, Material>;
  userData?: object;
  children?: ReactNode;
}

const getMaterial = (
  material: Material | Material[],
  materialOverrides?: Record<string, Material>
): Material | Material[] => {
  if (!materialOverrides) {
    return material;
  }

  if (Array.isArray(material)) {
    return material.flatMap((mat) => getMaterial(mat, materialOverrides));
  }

  if (material?.name && materialOverrides[material.name]) {
    return materialOverrides[material.name];
  }
  return material;
};

export const Render = ({
  object,
  materialOverrides,
  userData,
  children,
}: RenderProps) => {
  if (object.type === "Group" || object.type === "Object3D") {
    return (
      <group
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
      >
        {object.children.map((child) => (
          <Render
            key={child.uuid}
            object={child}
            materialOverrides={materialOverrides}
            userData={userData}
          >
            {children}
          </Render>
        ))}
      </group>
    );
  } else if (object.type === "Mesh") {
    const mesh = object as Mesh;
    return (
      <mesh
        key={mesh.uuid}
        geometry={mesh.geometry}
        position={mesh.position}
        rotation={mesh.rotation}
        scale={mesh.scale}
        material={getMaterial(mesh.material, materialOverrides)}
        userData={userData}
      >
        {children}
      </mesh>
    );
  }
};
