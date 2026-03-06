import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jwtDecode } from "jwt-decode"

const WORKERS_URL = "http://localhost:8081/api/admin/workers"

export const WorkersPage = () => {
  const navigate = useNavigate()
  const [workers, setWorkers] = useState<{id: number, email: string, role: string, isActive?: number}[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("WORKER")
  const [message, setMessage] = useState("")

  const fetchWorkers = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return navigate("/login")
    
    try {
      const decoded: any = jwtDecode(token)
      if (decoded.role !== "ADMIN") {
        navigate("/dashboard")
        return
      }
    } catch (e) {
      navigate("/login")
    }

    try {
      const res = await fetch(WORKERS_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setWorkers(await res.json())
    } catch (error) {
      console.error("Błąd pobierania matrycy:", error)
    }
  }

  useEffect(() => {
    fetchWorkers()
  }, [])

  const handleAddWorker = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return

    try {
      const res = await fetch(WORKERS_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: name, 
          email: email,
          password: password,
          role: role
        })
      })

      if (res.ok) {
        setIsDialogOpen(false)
        fetchWorkers()
        setEmail("")
        setPassword("")
        setRole("WORKER")
        setMessage("")
      } else {
        const errorData = await res.json()
        setMessage(`Błąd: ${errorData.message || "Odrzucono przez Matrycę"}`)
      }
    } catch (error) {
      setMessage("Krytyczny błąd połączenia")
    }
  }

  return (
    <div className="p-8 w-full max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-orange-400">Panel Administratora</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">➕ Zarejestruj Pracownika</Button>
          </DialogTrigger>
          
          <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-orange-400">Otwarcie Nowego Konta Dostępu</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
                <Input placeholder="Imię i Nazwisko" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-950 border-slate-700" />
              <Input placeholder="Adres E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-950 border-slate-700" />
              <Input type="password" placeholder="Hasło startowe" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-950 border-slate-700" />
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400">Poziom Uprawnień:</label>
                <Select onValueChange={setRole} value={role}>
                  <SelectTrigger className="bg-slate-950 border-slate-700">
                    <SelectValue placeholder="Wybierz rolę..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WORKER">Magazynier (WORKER)</SelectItem>
                    <SelectItem value="ADMIN">Administrator (ADMIN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddWorker} className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-2">Zatwierdź w Bazie</Button>
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
              <TableHead className="text-slate-400">E-mail</TableHead>
              <TableHead className="text-slate-400">Ranga</TableHead>
              <TableHead className="text-slate-400 text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((worker) => (
              <TableRow key={worker.id} className="border-slate-800 hover:bg-slate-800/50 transition-colors">
                <TableCell className="font-medium text-slate-300">#{worker.id}</TableCell>
                <TableCell className="text-slate-100">{worker.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${worker.role === 'ADMIN' ? 'bg-orange-900/50 text-orange-400' : 'bg-blue-900/50 text-blue-400'}`}>
                    {worker.role}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`w-3 h-3 inline-block rounded-full ${worker.isActive === 1 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-red-500'}`}></span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}