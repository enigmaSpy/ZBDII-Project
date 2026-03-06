import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInventory } from "@/context/InventoryContext";

interface ItemInterface {
    id: number;
    name: string;
}

interface SelectValues {
    items: ItemInterface[];
    labelDesc: string;
    type: "product" | "warehouse" | "supplier";
}

export const SelectBlock = ({ items, labelDesc, type }: SelectValues) => {
    const { setSelectedProduct, setSelectedWarehouse, setSelectedSupplier } = useInventory();

    const handleChange = (value: string) => {
        const selected = items.find((item) => item.id.toString() === value);
        if (!selected) return;

        if (type === "product") setSelectedProduct(selected);
        if (type === "warehouse") setSelectedWarehouse(selected);
        if (type === "supplier") setSelectedSupplier(selected);
    }

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {labelDesc}
            </label>
            <Select onValueChange={handleChange}>
                <SelectTrigger className="bg-slate-950/80 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Wybierz..." />
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