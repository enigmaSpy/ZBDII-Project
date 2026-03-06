import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jwtDecode } from "jwt-decode" 

const WAREHOUSES_URL = "http://localhost:8081/api/data/warehouses"
const ADD_WAREHOUSE_URL = "http://localhost:8081/api/warehouses"
export const WarehousesPage = () => {
  const [warehouses, setWarehouses] = useState<{id: number, name: string}[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [userRole, setUserRole] = useState<string>("WORKER")

  const [name, setName] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [message, setMessage] = useState("")

  const fetchWarehouses = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return
    
    try {
      const decoded: any = jwtDecode(token)
      setUserRole(decoded.role) 
    } catch (e) {
      console.error("Błąd dekodowania biletu")
    }

    try {
      const res = await fetch(WAREHOUSES_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setWarehouses(await res.json())
    } catch (error) {
      console.error("Błąd pobierania matrycy:", error)
    }
  }

  useEffect(() => {
    fetchWarehouses()
  }, [])

  const handleAddWarehouse = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return

    try {
      const res = await fetch(ADD_WAREHOUSE_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: name,
          street: street,
          city: city,
          country: country
        })
      })

      if (res.ok) {
        setIsDialogOpen(false)
        fetchWarehouses()
        setName("")
        setStreet("")
        setCity("")
        setCountry("")
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
        <h1 className="text-3xl font-bold text-slate-100">Katalog Magazynów</h1>
        
        {userRole === "ADMIN" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">➕ Dodaj Nowy Magazyn</Button>
            </DialogTrigger>
            
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
              <DialogHeader>
                <DialogTitle>Nowy Magazyn</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Input placeholder="Nazwa obiektu (np. Magazyn Główny)" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-950 border-slate-700" />
                <Input placeholder="Ulica i numer" value={street} onChange={(e) => setStreet(e.target.value)} className="bg-slate-950 border-slate-700" />
                <div className="flex gap-2">
                  <Input placeholder="Miasto" value={city} onChange={(e) => setCity(e.target.value)} className="bg-slate-950 border-slate-700" />
                  <Input placeholder="Kraj" value={country} onChange={(e) => setCountry(e.target.value)} className="bg-slate-950 border-slate-700" />
                </div>
                
                <Button onClick={handleAddWarehouse} className="w-full bg-teal-600 hover:bg-teal-700">Zatwierdź Magazyn</Button>
                {message && <p className="text-red-400 text-sm text-center">{message}</p>}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="w-[100px] text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">Nazwa Obiektu</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
            {warehouses.length === 0 ? (
              <TableRow>
              <TableCell colSpan={2} className="h-24 text-center text-slate-500">
                Brak Magazynów.
              </TableCell>
              </TableRow>
            ) : (
              warehouses.map((warehouse) => (
              <TableRow key={warehouse.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                <TableCell className="font-medium text-slate-300">#{warehouse.id}</TableCell>
                <TableCell className="text-slate-100">{warehouse.name}</TableCell>
              </TableRow>
              ))
            )}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}