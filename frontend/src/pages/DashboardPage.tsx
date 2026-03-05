import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const DashboardPage=()=>{
  const navigate = useNavigate()
  const [ilosc, setIlosc] = useState("10")
  const [komunikat, setKomunikat] = useState("")

  // Funkcja uniwersalna - strzela do Spring Boota na odpowiedni adres
  const wykonajOperacje = async (typOperacji: "restock" | "dispatch") => {
    // 1. Wyciągamy nasz bilet z sejfu
    const token = localStorage.getItem("ziibd_token")

    if (!token) {
      setKomunikat("Brak biletu! Wyrzucam do logowania...")
      setTimeout(() => navigate("/login"), 2000)
      return
    }

    try {
      // 2. Uzbrojony kurier: ładunek + bilet w nagłówku
      const response = await fetch(`http://localhost:8081/api/inventory/${typOperacji}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // TUTAJ POKAZUJEMY OPASKĘ VIP!
        },
        body: JSON.stringify({
          id_product: 1, // Działamy na sztywno na produkcie 1
          id_warehouse: 1, // Działamy na magazynie 1
          quantity: parseInt(ilosc)
        })
      })

      if (response.ok) {
        const textData = await response.text()
        setKomunikat(`Sukces: ${textData}`)
      } else {
        // Jeśli Spring Boot rzuci błędem z naszej Siatki Bezpieczeństwa (np. brak towaru)
        const errorData = await response.json()
        setKomunikat(`Błąd: ${errorData.message}`)
      }
    } catch (error) {
      setKomunikat("Brak łączności z Matrycą.")
    }
  }


  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 p-4">
  <Card className="w-[400px] border-slate-800 bg-slate-900/70 backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-slate-100">Główna Matryca</CardTitle>
      <CardDescription className="text-slate-400">
        Panel sterowania przepływem materii
      </CardDescription>
    </CardHeader>
    
    <CardContent className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">
          Ilość sztuk (Produkt ID: 1):
        </label>
        <Input 
          type="number" 
          value={ilosc} 
          onChange={(e) => setIlosc(e.target.value)} 
          min="1"
          className="bg-slate-950 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:ring-slate-700"
        />
      </div>
      
      <div className="flex gap-3 flex-col sm:flex-row">
        <Button 
          className="flex-1 bg-indigo-700/80 hover:bg-indigo-700 text-white border border-indigo-600/30 shadow-sm"
          onClick={() => wykonajOperacje("restock")}
        >
          📥 Dostawa
        </Button>
        <Button 
          className="flex-1 bg-teal-700/80 hover:bg-teal-700 text-white border border-teal-600/30 shadow-sm"
          onClick={() => wykonajOperacje("dispatch")}
        >
          📤 Wysyłka
        </Button>
      </div>

      {komunikat && (
        <div className="mt-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded text-sm font-mono text-center text-slate-300">
          {komunikat}
        </div>
      )}
    </CardContent>
  </Card>
</div>
  )
}