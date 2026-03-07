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
interface SummaryInterface {
  warehouseId: number;
  warehouseName: string;
  totalItems: number;
  totalValue: number;
}
const URL_PRODUCT = "http://localhost:8081/api/data/products";
const URL_WAREHOUSE = "http://localhost:8081/api/data/warehouses";
const URL_SUMMARY = "http://localhost:8081/api/data/summary";
export const DashboardPage = () => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("0");
  const [information, setInformation] = useState("");
  const [products, setProducts] = useState<dataInterface[]>([]);
  const [warehouses, setWarehouses] = useState<dataInterface[]>([]);
  const [summaries, setSummaries] = useState<SummaryInterface[]>([]);

  const {selectedProduct, selectedWarehouse} = useInventory();

  const fetchProd =()=>{
     const getData = async () => {
      const token = localStorage.getItem("ziibd_token");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };

      const [resProd, resWare, resSum] = await Promise.all([
        fetch(URL_PRODUCT, { headers }),
        fetch(URL_WAREHOUSE, { headers }),
        fetch(URL_SUMMARY, {headers})
      ]);

      const [prodData, wareData, sumData] = await Promise.all([
        resProd.ok ? resProd.json() : null,
        resWare.ok ? resWare.json() : null,
        resSum.ok ? resSum.json() : null, 
      ]);

      if (prodData) setProducts(prodData);
      if (wareData) setWarehouses(wareData);
      if (sumData) setSummaries(sumData);
    };
    getData();
  }
  useEffect(() => {
   fetchProd();
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
        fetchProd();
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
     <div className="min-h-screen w-full bg-slate-950 p-6 lg:p-10">
  <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
    
    <div className="w-full lg:w-[380px] shrink-0">
      <h2 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Operacje magazynowe</h2>
      <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-sm">
        <CardContent className="flex flex-col gap-5 pt-6">
          
          <SelectBlock items={products} labelDesc="Produkt" type="product"/>
          <SelectBlock items={warehouses} labelDesc="Magazyn" type="warehouse"/>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ilość sztuk
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="bg-slate-950/80 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div className="flex gap-3">
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950 transition-all"
              onClick={() => wykonajOperacje("restock")}
            >
              ↓ Dostawa
            </Button>
            <Button
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-md transition-all"
              onClick={() => wykonajOperacje("dispatch")}
            >
              ↑ Wysyłka
            </Button>
          </div>

          {information && (
            <div className="p-3 rounded-md bg-slate-950 border border-slate-700 text-xs font-mono text-center text-slate-400 leading-relaxed">
              {information}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <div className="w-full flex flex-col gap-5">
      <div>
        <h2 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">Raport</h2>
        <p className="text-slate-600 text-xs">Aktualny stan magazynów</p>
      </div>

      {summaries.length === 0 ? (
        <div className="flex items-center justify-center h-32 rounded-lg border border-dashed border-slate-800 text-slate-600 text-sm">
          Brak danych do wyświetlenia
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summaries.map((summary) => (
            <Card key={summary.warehouseId} className="border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 transition-colors">
              <CardContent className="pt-5">
                <div className="text-sm font-semibold text-slate-200 mb-4">{summary.warehouseName}</div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Przedmioty w magazynie</span>
                    <span className="font-mono text-xl font-bold text-slate-100">{summary.totalItems} <span className="text-xs text-slate-500 font-normal">szt.</span></span>
                  </div>
                  <div className="h-px bg-slate-800"/>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Wartość przedmiotów</span>
                    <span className="font-mono text-xl font-bold text-indigo-400">{summary.totalValue.toFixed(2)} <span className="text-xs text-slate-500 font-normal">PLN</span></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>

  </div>
</div>
  );
};
