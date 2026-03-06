import { createContext, useState, useContext } from "react";

interface DataInterface{
    id: number;
    name: string;
}

interface InventoryContextType{
    selectedProduct: DataInterface |null;
    setSelectedProduct: (product: DataInterface|null)=>void;

    selectedWarehouse: DataInterface|null;
    setSelectedWarehouse: (warehouse: DataInterface|null)=>void;
}

const InventoryContext = createContext<InventoryContextType|null>(null);

export const InventoryProvider = ({children}: {children:React.ReactNode})=>{
    const [selectedProduct, setSelectedProduct] = useState<DataInterface|null>(null);
    const [selectedWarehouse, setSelectedWarehouse] = useState<DataInterface | null>(null);

    return(
        <InventoryContext value={{
            selectedProduct,
            setSelectedProduct,
            selectedWarehouse,
            setSelectedWarehouse
        }}>
            {children}
        </InventoryContext>
    )
}

export const useInventory = ()=>{
    const context = useContext(InventoryContext);
    if(!context) throw new Error("useInventory must be used inside InventoryProvider");
    return context;
}
