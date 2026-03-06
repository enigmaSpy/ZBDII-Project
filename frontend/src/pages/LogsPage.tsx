import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jwtDecode } from "jwt-decode";

const LOGS_URL = "http://localhost:8081/api/admin/workers/logs";

export const LogsPage = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<
    {
      emailAttempted: string;
      isSuccess: number;
      ipAddress: string;
      occurredAt: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem("ziibd_token");
      if (!token) return navigate("/login");

      try {
        const decoded: any = jwtDecode(token);
        if (decoded.role !== "ADMIN") {
          navigate("/dashboard");
          return;
        }
      } catch (e) {
        navigate("/login");
      }

      try {
        const res = await fetch(LOGS_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data.reverse());
        }
      } catch (error) {
        console.error("Błąd pobierania logów:", error);
      }
    };

    fetchLogs();
  }, [navigate]);

  return (
    <div className="p-8 w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-red-500">
          🚨 Audyt Bezpieczeństwa (Logi)
        </h1>
        <p className="text-slate-400 mt-2">Historia autentykacji w Matrycy</p>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="w-[100px] text-center text-slate-400">
                Status
              </TableHead>
              <TableHead className="text-slate-400">Adres E-mail</TableHead>
              <TableHead className="text-slate-400">Adres IP</TableHead>
              <TableHead className="text-slate-400">Czas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow
                key={index}
                className="border-slate-800 hover:bg-slate-800/50 transition-colors"
              >
                <TableCell className="text-center font-medium">
                  {log.isSuccess === 1 ? (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-green-950/30 text-green-400 text-xs font-bold border border-green-900/50">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{" "}
                      ZALOGOWANO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-red-950/30 text-red-400 text-xs font-bold border border-red-900/50">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>{" "}
                      ODRZUCONO
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-slate-100 font-mono">
                  {log.emailAttempted}
                </TableCell>
                <TableCell className="text-slate-400 font-mono">
                  {log.ipAddress}
                </TableCell>
                <TableCell className="text-slate-400 font-mono">
                  {log.occurredAt ? new Date(log.occurredAt).toLocaleString('pl-PL') : "Brak danych"}
                </TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-slate-500"
                >
                  Brak wpisów w rejestrze.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
