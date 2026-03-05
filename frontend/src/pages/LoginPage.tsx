import { useState } from "react"
import { useNavigate } from "react-router-dom" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
export const LoginPage=()=>{
  const [email, setEmail] = useState("antonioj@google.com")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  
  const navigate = useNavigate() 

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, passwordHash: password })
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("ziibd_token", data.token)
        
        navigate("/dashboard")
      } else {
        setMessage("Błąd autoryzacji")
      }
    } catch (error) {
      setMessage("Brak łączności z Bazą")
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
      <Card className="w-87.5">
        <CardHeader>
          <CardTitle>Logowanie do Systemu</CardTitle>
          <CardDescription>Jeżeli nie masz konta skontaktuj się z adminem</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input type="email" placeholder="E-mail" value={email} onChange={(e:any) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Hasło" value={password} onChange={(e:any) => setPassword(e.target.value)} />
          <Button onClick={handleLogin} className="w-full">Zainicjuj Połączenie</Button>
          {message && <p className="text-sm text-center mt-2 font-bold text-red-500">{message}</p>}
        </CardContent>
      </Card>
    </div>
  )
}