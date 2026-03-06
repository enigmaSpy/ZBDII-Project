import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { SelectBlock } from "@/components/SelectBlock";
import { useInventory } from "@/context/InventoryContext";
interface dataInterface {
  id: number;
  name: string;
}
const URL_PRODUCT = "http://localhost:8081/api/data/products";
const URL_WAREHOUSE = "http://localhost:8081/api/data/warehouses";
export const DashboardPage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("0");
  const [information, setInformation] = useState("");
  const [products, setProducts] = useState<dataInterface[]>([]);
  const [warehouses, setWarehouses] = useState<dataInterface[]>([]);

  const {selectedProduct, selectedWarehouse} = useInventory();

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("ziibd_token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [resProd, resWare] = await Promise.all([
        fetch(URL_PRODUCT, { headers }),
        fetch(URL_WAREHOUSE, { headers }),
      ]);

      const [prodData, wareData] = await Promise.all([
        resProd.ok ? resProd.json() : [null],
        resWare.ok ? resWare.json() : [null],
      ]);
      if (prodData) setProducts(prodData);
      if (wareData) setWarehouses(wareData);
    };
    getData();
  }, []);
  const wykonajOperacje = async (typOperacji: "restock" | "dispatch") => {
    const token = localStorage.getItem("ziibd_token");

    if (!token) {
      setInformation("Brak biletu! Wyrzucam do logowania...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/inventory/${typOperacji}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id_product: selectedProduct?.id,
            id_warehouse: selectedWarehouse?.id,
            quantity: parseInt(quantity),
          }),
        },
      );

      if (response.ok) {
        const textData = await response.text();
        setInformation(`Sukces: ${textData}`);
      } else {
        const errorData = await response.json();
        setInformation(`Błąd: ${errorData.message}`);
      }
    } catch (error) {
      setInformation("Brak łączności z Matrycą.");
    }
  };

  return (
     <div className="flex h-screen w-full items-center justify-center bg-slate-950 p-4">
      <Card className="w-100 border-slate-800 bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-100">Przyjęcia / Wydania</CardTitle>
        </CardHeader>
        <SelectBlock items={products} labelDesc="Wybierz Produkt" type="product"/>
        <SelectBlock items={warehouses} labelDesc="Wybierz Magazyn" type="warehouse"/>
        <CardContent className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300">
              Ilość sztuk
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-slate-700"
            />
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <Button
              className="flex-1 bg-indigo-700/80 hover:bg-indigo-700 text-white border border-indigo-600/30 shadow-sm"
              onClick={() => wykonajOperacje("restock")}
            >
              📥 Dostawa
            </Button>
            <Button
              className="flex-1 bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/30 shadow-sm"
              onClick={() => wykonajOperacje("dispatch")}
            >
              📤 Wysyłka
            </Button>
          </div>

          {information && (
            <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded text-sm font-mono text-center text-slate-300">
              {information}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
