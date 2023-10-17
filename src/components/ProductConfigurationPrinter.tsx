import { useProductConfiguration } from '../contexts/ProductConfigurationContext';
import {useUserProduct} from "../contexts/UserProductContext";
import {UserProduct} from "../interfaces/UserProduct";

export const ProductConfigurationPrinter = () => {
  const productConfig = useProductConfiguration();
  const [userProduct, setUserProduct] = useUserProduct();

  const handleAddComponent = () => {
    if (userProduct) {
      setUserProduct(prevState => {
        if (prevState) {
          const newBaseComponentId = (parseInt(prevState.baseComponentId, 10) + 1).toString();

          return {
            ...prevState,
            baseComponentId: newBaseComponentId
          };
        }
        return prevState;
      });
    } else {
      const newProduct: UserProduct = {
        baseComponentId: "0",
        configuredMaterials: [],
        attachedComponents: []
      };
      setUserProduct(newProduct);
    }
  };

  if (!productConfig) {
    return <p>Loading product configuration...</p>;
  }

  if (!userProduct) {
    return <p>Loading user product..</p>;
  }

  return (
    <div>
      <h1>Available Products</h1>
      {productConfig.components.map(component => (
        <div key={component.id}>
          <h2>{component.name}</h2>
        </div>
      ))}
      <h1>Selected Products</h1>
      <h2>{userProduct.baseComponentId}</h2>
      <button onClick={handleAddComponent}>Add Component</button>
    </div>
  );
};
