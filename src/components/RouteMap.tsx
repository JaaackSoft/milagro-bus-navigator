
import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";

interface RouteMapProps {
  selectedRoute: any;
  blockedStreets: string[];
}

const RouteMap = ({ selectedRoute, blockedStreets }: RouteMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const busStops = [
    { id: "terminal", name: "Terminal", x: 100, y: 150, color: "#ef4444" },
    { id: "unemi", name: "UNEMI", x: 200, y: 100, color: "#3b82f6" },
    { id: "milagro-norte", name: "Milagro Norte", x: 350, y: 80, color: "#10b981" },
    { id: "los-vergeles", name: "Los Vergeles", x: 200, y: 250, color: "#f59e0b" },
    { id: "colegio-17", name: "Colegio 17 de Septiembre", x: 400, y: 180, color: "#8b5cf6" }
  ];

  const streets = [
    { from: "terminal", to: "unemi", name: "Av. García Moreno" },
    { from: "terminal", to: "milagro-norte", name: "Av. Jaime Roldós" },
    { from: "terminal", to: "los-vergeles", name: "Calle Bolívar" },
    { from: "unemi", to: "milagro-norte", name: "Av. Universitaria" },
    { from: "unemi", to: "los-vergeles", name: "Calle Universidad" },
    { from: "unemi", to: "colegio-17", name: "Av. Universitaria" },
    { from: "milagro-norte", to: "colegio-17", name: "Av. 17 de Septiembre" },
    { from: "los-vergeles", to: "colegio-17", name: "Av. Los Vergeles" }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw streets
    streets.forEach(street => {
      const fromStop = busStops.find(stop => stop.id === street.from);
      const toStop = busStops.find(stop => stop.id === street.to);
      
      if (fromStop && toStop) {
        const isBlocked = blockedStreets.includes(street.name);
        
        ctx.beginPath();
        ctx.moveTo(fromStop.x, fromStop.y);
        ctx.lineTo(toStop.x, toStop.y);
        ctx.strokeStyle = isBlocked ? "#ef4444" : "#94a3b8";
        ctx.lineWidth = isBlocked ? 4 : 2;
        ctx.stroke();

        // Draw street name
        const midX = (fromStop.x + toStop.x) / 2;
        const midY = (fromStop.y + toStop.y) / 2;
        ctx.fillStyle = isBlocked ? "#ef4444" : "#64748b";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(street.name, midX, midY - 5);
      }
    });

    // Draw selected route
    if (selectedRoute && selectedRoute.origin && selectedRoute.destination) {
      const origin = busStops.find(stop => stop.id === selectedRoute.origin.id);
      const destination = busStops.find(stop => stop.id === selectedRoute.destination.id);
      
      if (origin && destination) {
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(destination.x, destination.y);
        ctx.strokeStyle = selectedRoute.isAlternative ? "#f59e0b" : "#10b981";
        ctx.lineWidth = 6;
        ctx.setLineDash(selectedRoute.isAlternative ? [10, 5] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw bus icon on route
        const busX = (origin.x + destination.x) / 2;
        const busY = (origin.y + destination.y) / 2;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(busX - 8, busY - 5, 16, 10);
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 2;
        ctx.strokeRect(busX - 8, busY - 5, 16, 10);
        ctx.fillStyle = "#1f2937";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("🚌", busX, busY + 3);
      }
    }

    // Draw bus stops
    busStops.forEach(stop => {
      // Draw stop circle
      ctx.beginPath();
      ctx.arc(stop.x, stop.y, 12, 0, 2 * Math.PI);
      ctx.fillStyle = stop.color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw stop name
      ctx.fillStyle = "#1f2937";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(stop.name, stop.x, stop.y + 25);
    });

  }, [selectedRoute, blockedStreets]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={500}
        height={350}
        className="border rounded-lg bg-white w-full"
        style={{ maxWidth: "100%" }}
      />
      
      {selectedRoute && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50">
              Origen: {selectedRoute.origin?.name}
            </Badge>
            <Badge variant="outline" className="bg-green-50">
              Destino: {selectedRoute.destination?.name}
            </Badge>
            <Badge variant="outline" className="bg-yellow-50">
              Distancia: {selectedRoute.distance} km
            </Badge>
            {selectedRoute.isAlternative && (
              <Badge variant="destructive">
                Ruta Alternativa
              </Badge>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            <p><strong>Calles en la ruta:</strong> {selectedRoute.streets?.join(", ")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-gray-400"></div>
          <span>Calle normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1 bg-red-500"></div>
          <span>Calle bloqueada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1.5 bg-green-500"></div>
          <span>Ruta directa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-1.5 bg-yellow-500 border-dashed border border-yellow-600"></div>
          <span>Ruta alternativa</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;
