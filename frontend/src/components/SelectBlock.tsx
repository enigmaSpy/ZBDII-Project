import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory } from "@/context/InventoryContext";
interface ItemInterface{
    id: number;
    name: string;
}
interface SelectValues{
  items: ItemInterface[];
  labelDesc: string;
  type: "product" | "warehouse";
}
export const SelectBlock = ({items, labelDesc, type}:SelectValues) => {

  const {
    setSelectedProduct,
    setSelectedWarehouse
  } = useInventory();

  const handleChange = (value:string)=>{
    const selected = items.find((item)=>item.id.toString()===value)
    if (!selected) return;

    if (type === "product") {
      setSelectedProduct(selected);
    }

    if (type === "warehouse") {
      setSelectedWarehouse(selected);
    }
  }
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-zinc-400">
        {labelDesc}
      </label>

      <Select onValueChange={handleChange}>
        <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
          <SelectValue placeholder="Kliknij, aby wybrać..." />
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.id} value={item.id.toString()}>
              {item.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
