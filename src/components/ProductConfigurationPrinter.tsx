import { useProductConfiguration } from '../contexts/ProductConfigurationContext.ts';

export const ProductConfigurationPrinter = () => {
  const productConfig = useProductConfiguration();

  if (!productConfig) {
    return <p>Loading product configuration...</p>;
  }

  return (
    <div>
      <h1>Available Products</h1>
      {productConfig.components.map(component => (
        <div key={component.id}>
          <h2>{component.name}</h2>
        </div>
      ))}
    </div>
  );
};
