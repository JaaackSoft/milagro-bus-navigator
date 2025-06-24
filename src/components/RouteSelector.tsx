
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const busStops = [
  { id: "terminal", name: "Terminal", coordinates: [0, 0] },
  { id: "unemi", name: "UNEMI", coordinates: [1, 1] },
  { id: "milagro-norte", name: "Milagro Norte", coordinates: [2, 0] },
  { id: "los-vergeles", name: "Los Vergeles", coordinates: [1, 2] },
  { id: "colegio-17", name: "Colegio 17 de Septiembre", coordinates: [3, 1] }
];

const routeDatabase = {
  "terminal-unemi": { distance: 3.2, normalTime: 12, streets: ["Av. García Moreno", "Calle 8 de Noviembre"] },
  "terminal-milagro-norte": { distance: 4.1, normalTime: 15, streets: ["Av. Jaime Roldós", "Av. 17 de Septiembre"] },
  "terminal-los-vergeles": { distance: 2.8, normalTime: 10, streets: ["Calle Bolívar", "Av. Los Vergeles"] },
  "terminal-colegio-17": { distance: 3.5, normalTime: 13, streets: ["Av. García Moreno", "Calle Estudiantes"] },
  "unemi-milagro-norte": { distance: 2.1, normalTime: 8, streets: ["Av. Universitaria", "Av. 17 de Septiembre"] },
  "unemi-los-vergeles": { distance: 1.8, normalTime: 7, streets: ["Calle Universidad", "Av. Los Vergeles"] },
  "unemi-colegio-17": { distance: 2.3, normalTime: 9, streets: ["Av. Universitaria", "Calle Estudiantes"] },
  "milagro-norte-los-vergeles": { distance: 3.0, normalTime: 11, streets: ["Av. Norte", "Av. Los Vergeles"] },
  "milagro-norte-colegio-17": { distance: 1.9, normalTime: 7, streets: ["Av. 17 de Septiembre", "Calle Estudiantes"] },
  "los-vergeles-colegio-17": { distance: 2.5, normalTime: 9, streets: ["Av. Los Vergeles", "Calle Estudiantes"] }
};

interface RouteSelectorProps {
  onRouteSelect: (route: any) => void;
  blockedStreets: string[];
  onTimeEstimate: (time: number) => void;
}

const RouteSelector = ({ onRouteSelect, blockedStreets, onTimeEstimate }: RouteSelectorProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const calculateRoute = () => {
    if (!origin || !destination) {
      toast({
        title: "Error",
        description: "Por favor selecciona origen y destino",
        variant: "destructive"
      });
      return;
    }

    if (origin === destination) {
      toast({
        title: "Error",
        description: "El origen y destino no pueden ser iguales",
        variant: "destructive"
      });
      return;
    }

    const routeKey = `${origin}-${destination}`;
    const reverseRouteKey = `${destination}-${origin}`;
    
    let routeData = routeDatabase[routeKey as keyof typeof routeDatabase] || 
                    routeDatabase[reverseRouteKey as keyof typeof routeDatabase];

    if (!routeData) {
      toast({
        title: "Ruta no disponible",
        description: "No hay conexión directa disponible",
        variant: "destructive"
      });
      return;
    }

    // Calcular el impacto de las calles bloqueadas
    const blockedStreetsInRoute = routeData.streets.filter(street => blockedStreets.includes(street));
    let finalTime = routeData.normalTime;
    let alternativeRoute = false;
    let timeDetails = [];

    if (blockedStreetsInRoute.length > 0) {
      // Tiempo base de la ruta original
      timeDetails.push(`Tiempo base: ${routeData.normalTime} min`);
      
      // Calcular tiempo adicional por cada calle bloqueada
      const additionalTimePerStreet = Math.round(routeData.normalTime * 0.4); // 40% más por cada calle bloqueada
      const totalAdditionalTime = blockedStreetsInRoute.length * additionalTimePerStreet;
      
      finalTime = routeData.normalTime + totalAdditionalTime;
      alternativeRoute = true;
      
      timeDetails.push(`Tiempo adicional por ${blockedStreetsInRoute.length} calle(s) bloqueada(s): +${totalAdditionalTime} min`);
      timeDetails.push(`Tiempo total estimado: ${finalTime} min`);
      
      toast({
        title: "Ruta alternativa necesaria",
        description: `Calles bloqueadas: ${blockedStreetsInRoute.join(", ")}. Tiempo adicional: +${totalAdditionalTime} min`,
        variant: "default"
      });
    } else {
      timeDetails.push(`Ruta directa disponible: ${finalTime} min`);
    }

    const route = {
      origin: busStops.find(stop => stop.id === origin),
      destination: busStops.find(stop => stop.id === destination),
      distance: routeData.distance,
      estimatedTime: finalTime,
      normalTime: routeData.normalTime,
      additionalTime: finalTime - routeData.normalTime,
      streets: routeData.streets,
      blockedStreetsInRoute,
      isAlternative: alternativeRoute,
      timeDetails
    };

    onRouteSelect(route);
    onTimeEstimate(finalTime);

    console.log("Detalles del cálculo:", timeDetails);

    toast({
      title: "Ruta calculada",
      description: `${alternativeRoute ? 'Ruta alternativa' : 'Ruta directa'}: ${finalTime} minutos`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="origin">Origen</Label>
        <Select value={origin} onValueChange={setOrigin}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el origen" />
          </SelectTrigger>
          <SelectContent>
            {busStops.map((stop) => (
              <SelectItem key={stop.id} value={stop.id}>
                {stop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destino</Label>
        <Select value={destination} onValueChange={setDestination}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el destino" />
          </SelectTrigger>
          <SelectContent>
            {busStops.map((stop) => (
              <SelectItem key={stop.id} value={stop.id}>
                {stop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={calculateRoute} 
        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
      >
        Calcular Ruta
      </Button>
    </div>
  );
};

export default RouteSelector;
