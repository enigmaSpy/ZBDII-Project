import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PRODUCTS_URL ="http://localhost:8081/api/data/products"
const ADD_NEWP_URL= "http://localhost:8081/api/products"
interface ProductsData{
  id: number; name: string; isActive:number;
}

export const ProductsPage = () => {
  
  const [products, setProducts] = useState<ProductsData[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  
  const [newName, setNewName] = useState("")
  const [priceBuy, setPriceBuy] = useState("")
  const [priceSell, setPriceSell] = useState("")
  const [desc, setDesc] = useState("")
  const [supplierId, setSupplierId] = useState("1") 
  
  const [message, setMessage] = useState("")

 
  const fetchProducts = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return
    try {
      const res = await fetch(PRODUCTS_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setProducts(await res.json())
    } catch (error) {
      console.error("Błąd pobierania matrycy:", error)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])


  const handleAddProduct = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return

    try {
      const res = await fetch(ADD_NEWP_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: newName,
          price_buy: parseFloat(priceBuy),   
          price_sell: parseFloat(priceSell), 
          p_desc: desc,
          id_supplier: parseInt(supplierId)  
        })
      })

      if (res.ok) { 
        setIsDialogOpen(false)
        fetchProducts() 
        
        
        setNewName("")
        setDesc("")
        setPriceBuy("")
        setPriceSell("")
        setSupplierId("1") 
        setMessage("")
      } else {
        const errorData = await res.json()
        setMessage(`Błąd: ${errorData.message || "Odrzucono przez Matrycę"}`)
      }
    } catch (error) {
      setMessage("Krytyczny błąd połączenia z Matrycą.")
    }
  }

  return (
    <div className="p-8 w-full max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Katalog Produktów</h1>
        
       
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">➕ Dodaj Nowy Towar</Button>
          </DialogTrigger>
          
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle>Rejestracja Nowego Produktu</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <Input placeholder="Nazwa produktu" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-slate-950 border-slate-700" />
              <div className="flex gap-2">
                <Input type="number" placeholder="Cena zakupu" value={priceBuy} onChange={(e) => setPriceBuy(e.target.value)} className="bg-slate-950 border-slate-700" />
                <Input type="number" placeholder="Cena sprzedaży" value={priceSell} onChange={(e) => setPriceSell(e.target.value)} className="bg-slate-950 border-slate-700" />
              </div>
              <Input placeholder="Opis" value={desc} onChange={(e) => setDesc(e.target.value)} className="bg-slate-950 border-slate-700" />
              
              <Button onClick={handleAddProduct} className="w-full bg-teal-600 hover:bg-teal-700">Zapisz w Bazie</Button>
              {message && <p className="text-red-400 text-sm text-center">{message}</p>}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="w-[100px] text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">Nazwa Produktu</TableHead>
              <TableHead className="text-slate-400 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                <TableCell className="font-medium text-slate-300">#{product.id}</TableCell>
                <TableCell className="text-slate-100">{product.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {product.isActive === 1 ? (
                      <>
                        <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
                        <span className="text-xs text-green-400 uppercase tracking-wider font-bold">Active</span>
                      </>
                    ) : (
                      <>
                        <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
                        <span className="text-xs text-red-400 uppercase tracking-wider font-bold">Disactive</span>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center text-slate-500">
                  Brak produktów w Matrycy.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}