import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { jwtDecode } from "jwt-decode" 

const SUPPLIERS_URL = "http://localhost:8081/api/data/suppliers"
const ADD_SUPPLIERS_URL = "http://localhost:8081/api/suppliers"

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState<{id: number, name: string, city: string, country: string, email: string, phone: string, isActive: number}[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>("WORKER")

  const [name, setName] = useState("")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const fetchSuppliers = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return
    
    try {
      const decoded: any = jwtDecode(token)
      setUserRole(decoded.role) 
    } catch (e) {
      console.error("Błąd dekodowania tokenu")
    }

    try {
      const res = await fetch(SUPPLIERS_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setSuppliers(await res.json())
    } catch (error) {
      console.error("Błąd pobierania dostawców:", error)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleAddSupplier = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return

    try {
      const res = await fetch(ADD_SUPPLIERS_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ name, street, city, country, email, phone })
      })

      if (res.ok) {
        setIsDialogOpen(false)
        fetchSuppliers()
        setName(""); setStreet(""); setCity("")
        setCountry(""); setEmail(""); setPhone(""); setMessage("")
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
          <h1 className="text-2xl font-bold text-slate-100">Dostawcy</h1>
          <p className="text-xs text-slate-500 mt-1">Lista zarejestrowanych dostawców</p>
        </div>
        
        {userRole === "ADMIN" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-500">+ Dodaj dostawcę</Button>
            </DialogTrigger>
            
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
              <DialogHeader>
                <DialogTitle>Nowy dostawca</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 py-4">
                <Input placeholder="Nazwa firmy" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-950 border-slate-700" />
                <Input placeholder="Ulica i numer" value={street} onChange={(e) => setStreet(e.target.value)} className="bg-slate-950 border-slate-700" />
                <div className="flex gap-2">
                  <Input placeholder="Miasto" value={city} onChange={(e) => setCity(e.target.value)} className="bg-slate-950 border-slate-700" />
                  <Input placeholder="Kraj" value={country} onChange={(e) => setCountry(e.target.value)} className="bg-slate-950 border-slate-700" />
                </div>
                <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-950 border-slate-700" />
                <Input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-slate-950 border-slate-700" />
                
                <Button onClick={handleAddSupplier} className="w-full bg-indigo-600 hover:bg-indigo-500 mt-2">Dodaj dostawcę</Button>
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
              <TableHead className="w-[80px] text-slate-400">ID</TableHead>
              <TableHead className="text-slate-400">Nazwa</TableHead>
              <TableHead className="text-slate-400">Miasto</TableHead>
              <TableHead className="text-slate-400">Kraj</TableHead>
              <TableHead className="text-slate-400">Email</TableHead>
              <TableHead className="text-slate-400">Telefon</TableHead>
              <TableHead className="text-slate-400 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Brak dostawców w systemie.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <TableCell className="font-medium text-slate-400">#{supplier.id}</TableCell>
                  <TableCell className="text-slate-100 font-medium">{supplier.name}</TableCell>
                  <TableCell className="text-slate-300">{supplier.city}</TableCell>
                  <TableCell className="text-slate-300">{supplier.country}</TableCell>
                  <TableCell className="text-slate-300">{supplier.email}</TableCell>
                  <TableCell className="text-slate-300">{supplier.phone}</TableCell>
                  <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    {supplier.isActive === 1 ? (
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}