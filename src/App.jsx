import { useState } from "react";
import ProductForm from './components/ProductForm';


function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Gestión De Productos</h1>
         <ProductForm />
    </div>
  );
}

export default App;
