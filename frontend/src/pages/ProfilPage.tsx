import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const CHANGE_PASS_URL = "http://localhost:8081/api/auth/password"

export const ProfilePage = () => {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleChangePassword = async () => {
    const token = localStorage.getItem("ziibd_token")
    if (!token) return

    try {
      const res = await fetch(CHANGE_PASS_URL, {
        method: "PUT", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      })

      if (res.ok) {
        setMessage("Hasło zostało pomyślnie zaktualizowane w Matrycy.")
        setOldPassword("")
        setNewPassword("")
      } else {
        const errorData = await res.json()
        setMessage(`Błąd: ${errorData.message || "Błędne stare hasło lub odrzucenie przez bazę."}`)
      }
    } catch (error) {
      setMessage("Błąd.")
    }
  }

  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-4">
      <Card className="w-[400px] border-slate-800 bg-slate-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-100">🔒 Ustawienia Bezpieczeństwa</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Aktualne Hasło</label>
            <Input 
              type="password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              className="bg-slate-950 border-slate-700 text-slate-100" 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-400">Nowe Hasło</label>
            <Input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="bg-slate-950 border-slate-700 text-slate-100" 
            />
          </div>

          <Button 
            onClick={handleChangePassword} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-2"
          >
            Zmień Hasło
          </Button>

          {message && (
            <div className="mt-2 p-2 bg-slate-950/60 rounded text-sm font-mono text-center text-slate-300">
              {message}
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  )
}