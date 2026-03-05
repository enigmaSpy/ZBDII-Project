import { useEffect, useState } from "react"
import { useNavigate, Link, Outlet } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { Button } from "@/components/ui/button"

interface JwtPayload {
  sub: string;
  role: string;
}

export const Layout=()=> {
  const navigate = useNavigate()
  const [role, setRole] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) {
      navigate("/login")
      return
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      setRole(decoded.role)
    } catch (error) {
      navigate("/login")
    }
  }, [navigate])

  const wyloguj = () => {
    localStorage.removeItem("ziibd_token")
    navigate("/login")
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white w-full">
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-zinc-100 mb-4">Projekt ZiiBD</h2>
        
        <Link to="/dashboard"><Button variant="ghost" className="navLink">Magazyn</Button></Link>
        <Link to="/products"><Button variant="ghost" className="navLink">Lista Produktów</Button></Link>
        <Link to="/warehouses"><Button variant="ghost" className="navLink">Magazyny</Button></Link>

        {role === "ADMIN" && (
          <div className="mt-8 border-t border-zinc-700 pt-4 flex flex-col gap-4">
            <h3 className="text-xs uppercase text-zinc-500 font-bold tracking-wider">Strefa Admina</h3>
            <Link to="/admin/workers"><Button variant="ghost" className="navLink">Pracownicy</Button></Link>
            <Link to="/admin/logs"><Button variant="ghost" className="navLink">Logi Systemowe</Button></Link>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-zinc-700">
           <div className="text-xs text-zinc-500 mb-2">Zalogowano jako: <span className="text-zinc-300">{role}</span></div>
           <Button variant="destructive" className="w-full cursor-pointer" onClick={wyloguj}>Wyloguj</Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Outlet /> 
      </div>
    </div>
  )
}