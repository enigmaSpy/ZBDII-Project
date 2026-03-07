import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PRODUCTS_URL = "http://localhost:8081/api/data/products"
const ADD_NEWP_URL = "http://localhost:8081/api/products"
const SUPPLIERS_URL = "http://localhost:8081/api/data/suppliers"

interface ProductsData {
  id: number;
  name: string;
  isActive: number;
  priceBuy: number;
  priceSell: number;
  p_desc: string;
  supplierName: string;
  idSupplier: number;
}

interface SupplierData {
  id: number;
  name: string;
}

export const ProductsPage = () => {
  const [products, setProducts] = useState<ProductsData[]>([])
  const [suppliers, setSuppliers] = useState<SupplierData[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [newName, setNewName] = useState("")
  const [priceBuy, setPriceBuy] = useState("")
  const [priceSell, setPriceSell] = useState("")
  const [desc, setDesc] = useState("")
  const [supplierId, setSupplierId] = useState("")
  const [message, setMessage] = useState("")

  const resetForm = () => {
    setEditingId(null)
    setNewName("")
    setPriceBuy("")
    setPriceSell("")
    setDesc("")
    setSupplierId("")
    setMessage("")
  }

  const fetchProducts = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return
    try {
      const res = await fetch(PRODUCTS_URL, { headers: { "Authorization": `Bearer ${token}` } })
      if (res.ok) setProducts(await res.json())
    } catch (error) {
      console.error("Błąd pobierania produktów:", error)
    }
  }

  const fetchSuppliers = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return
    try {
      const res = await fetch(SUPPLIERS_URL, { headers: { "Authorization": `Bearer ${token}` } })
      if (res.ok) setSuppliers(await res.json())
    } catch (error) {
      console.error("Błąd pobierania dostawców:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchSuppliers()
  }, [])

  const handleSaveProduct = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return

    // Payload używa nazw pól zgodnych z Twoim AddProductRequest w Javie
    const payload = {
      name: newName,
      price_buy: priceBuy ? parseFloat(priceBuy) : 0,
      price_sell: priceSell ? parseFloat(priceSell) : 0,
      p_desc: desc,
      id_supplier: supplierId ? parseInt(supplierId) : null
    }

    const url = editingId ? `${ADD_NEWP_URL}/${editingId}` : ADD_NEWP_URL
    const method = editingId ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setIsDialogOpen(false)
        fetchProducts()
        resetForm()
      } else {
        const errorData = await res.json()
        setMessage(`Błąd: ${errorData.message || "Nieznany błąd"}`)
      }
    } catch (error) {
      setMessage("Błąd połączenia z serwerem.")
    }
  }

  return (
    <div className="p-8 w-full max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Katalog Produktów</h1>
          <p className="text-xs text-slate-500 mt-1">Lista zarejestrowanych produktów</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open) }}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-500" onClick={() => { resetForm(); setIsDialogOpen(true) }}>
              + Dodaj produkt
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle>{editingId ? `Edytuj produkt #${editingId}` : "Nowy produkt"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <Input placeholder="Nazwa produktu" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-slate-950 border-slate-700" />
              <div className="flex gap-2">
                <Input type="number" placeholder="Cena zakupu" value={priceBuy} onChange={(e) => setPriceBuy(e.target.value)} className="bg-slate-950 border-slate-700" />
                <Input type="number" placeholder="Cena sprzedaży" value={priceSell} onChange={(e) => setPriceSell(e.target.value)} className="bg-slate-950 border-slate-700" />
              </div>
              <Input placeholder="Opis" value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-slate-950 border-slate-700" />

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dostawca</label>
                <Select onValueChange={setSupplierId} value={supplierId}>
                  <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-100">
                    <SelectValue placeholder="Wybierz dostawcę..." />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProduct} className="w-full bg-indigo-600 hover:bg-indigo-500 mt-2">
                {editingId ? "Zapisz zmiany" : "Dodaj produkt"}
              </Button>
              {message && <p className="text-red-400 text-sm text-center">{message}</p>}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="w-[80px] text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">Nazwa produktu</TableHead>
              <TableHead className="text-slate-400">Dostawca</TableHead>
              <TableHead className="text-right text-slate-400">Ceny (K/S)</TableHead>
              <TableHead className="text-center text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-400">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">Brak produktów.</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <TableCell className="font-medium text-slate-400">#{product.id}</TableCell>
                  <TableCell className="text-slate-100">
                    <div>{product.name}</div>
                    <div className="text-[10px] text-slate-500">{product.p_desc}</div>
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {product.supplierName || "Brak"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs">
                    <span className="text-red-400">{product.priceBuy}</span> / <span className="text-green-400">{product.priceSell}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {product.isActive === 1 ? (
                        <span className="text-xs text-green-400 font-semibold uppercase">Aktywny</span>
                      ) : (
                        <span className="text-xs text-red-400 font-semibold uppercase">Nieaktywny</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-700 bg-slate-800 text-slate-300"
                      onClick={() => {
                        resetForm()
                        setEditingId(product.id)
                        setNewName(product.name)
                        setPriceBuy(product.priceBuy?.toString() || "")
                        setPriceSell(product.priceSell?.toString() || "")
                        setDesc(product.p_desc || "")
                        setSupplierId(product.idSupplier?.toString() || "")
                        setIsDialogOpen(true)
                      }}
                    >
                      Edytuj
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}