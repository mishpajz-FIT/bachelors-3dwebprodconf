import {ContainerHeader} from "./containers/ContainerHeader.tsx";
import {useSnapshot} from "valtio";

import {EditorValuesStore} from "../../stores/EditorValuesStore.ts";

interface ComponentSelectionProps {
  onClose: () => void;
}

export const ComponentSelection = ({ onClose }: ComponentSelectionProps) => {
  const editorValuesSnap = useSnapshot(EditorValuesStore);

  return (
    <>
      <ContainerHeader title={"Edit component"} onClose={onClose} />

      
    </>
  );
};
