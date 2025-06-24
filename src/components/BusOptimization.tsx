
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Clock, Bus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const routeData = [
  { from: "Centro", to: "Colegio 17 de septiembre", frequency: 95, priority: "media" },
  { from: "Colegio 17 de septiembre", to: "UNEMI", frequency: 55, priority: "baja" },
  { from: "UNEMI", to: "Terminal Terrestre", frequency: 145, priority: "alta" },
  { from: "Terminal Terrestre", to: "Milagro Norte", frequency: 180, priority: "muy-alta" },
  { from: "Milagro Norte", to: "Cdla. Los Vergeles", frequency: 160, priority: "alta" },
  { from: "Los Vergeles", to: "UNEMI", frequency: 220, priority: "muy-alta" }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "muy-alta": return "bg-red-500";
    case "alta": return "bg-orange-500";
    case "media": return "bg-yellow-500";
    case "baja": return "bg-green-500";
    default: return "bg-gray-500";
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case "muy-alta": return "Muy Alta";
    case "alta": return "Alta";
    case "media": return "Media";
    case "baja": return "Baja";
    default: return "Sin definir";
  }
};

const BusOptimization = () => {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [optimizationResult, setOptimizationResult] = useState<any>(null);

  const calculateOptimization = () => {
    if (!selectedRoute) {
      toast({
        title: "Selecciona una ruta",
        description: "Por favor selecciona una ruta para optimizar",
        variant: "destructive"
      });
      return;
    }

    const route = routeData.find(r => `${r.from}-${r.to}` === selectedRoute);
    if (!route) return;

    // Calcular recomendaciones basadas en la frecuencia
    const busesNeeded = Math.ceil(route.frequency / 60); // Buses por hora
    const intervalMinutes = Math.floor(60 / route.frequency * 60); // Intervalo en minutos
    const dailyTrips = route.frequency * 12; // Estimación para 12 horas de servicio
    
    let recommendation = "";
    let optimizationType = "";
    
    if (route.frequency >= 180) {
      recommendation = "Ruta de muy alta demanda. Se recomienda aumentar la flota y reducir intervalos.";
      optimizationType = "Incrementar Flota";
    } else if (route.frequency >= 140) {
      recommendation = "Ruta de alta demanda. Mantener servicio frecuente y monitorear capacidad.";
      optimizationType = "Mantener Servicio";
    } else if (route.frequency >= 80) {
      recommendation = "Ruta de demanda media. Optimizar horarios según picos de demanda.";
      optimizationType = "Optimizar Horarios";
    } else {
      recommendation = "Ruta de baja demanda. Considerar ajustar frecuencia y tamaño de buses.";
      optimizationType = "Reducir Frecuencia";
    }

    const result = {
      route,
      busesNeeded,
      intervalMinutes,
      dailyTrips,
      recommendation,
      optimizationType,
      efficiency: Math.min(100, (route.frequency / 220) * 100).toFixed(1)
    };

    setOptimizationResult(result);

    toast({
      title: "Optimización calculada",
      description: `${optimizationType} para la ruta seleccionada`,
    });
  };

  const getTotalStats = () => {
    const totalFrequency = routeData.reduce((sum, route) => sum + route.frequency, 0);
    const avgFrequency = Math.round(totalFrequency / routeData.length);
    const highDemandRoutes = routeData.filter(r => r.frequency >= 140).length;
    
    return { totalFrequency, avgFrequency, highDemandRoutes };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Bus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{stats.totalFrequency}</div>
            <p className="text-sm text-blue-600">Colectivos/hora Total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{stats.avgFrequency}</div>
            <p className="text-sm text-green-600">Promedio por Ruta</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">{stats.highDemandRoutes}</div>
            <p className="text-sm text-orange-600">Rutas Alta Demanda</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Frecuencias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Frecuencia Óptima por Tramo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {routeData.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{route.from} → {route.to}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getPriorityColor(route.priority)} text-white`}>
                    {getPriorityText(route.priority)}
                  </Badge>
                  <div className="text-right">
                    <p className="font-bold text-lg">{route.frequency}</p>
                    <p className="text-xs text-gray-500">colectivos/hora</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimizador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Optimización de Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una ruta para optimizar" />
              </SelectTrigger>
              <SelectContent>
                {routeData.map((route, index) => (
                  <SelectItem key={index} value={`${route.from}-${route.to}`}>
                    {route.from} → {route.to} ({route.frequency} colectivos/hora)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={calculateOptimization} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Calcular Optimización
            </Button>
          </div>

          {optimizationResult && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <h4 className="font-semibold mb-3 text-blue-800">
                Resultado de Optimización: {optimizationResult.route.from} → {optimizationResult.route.to}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Buses necesarios/hora:</span>
                    <span className="font-semibold">{optimizationResult.busesNeeded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Intervalo promedio:</span>
                    <span className="font-semibold">{optimizationResult.intervalMinutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Viajes diarios estimados:</span>
                    <span className="font-semibold">{optimizationResult.dailyTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Eficiencia de ruta:</span>
                    <span className="font-semibold">{optimizationResult.efficiency}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Badge className={`w-full justify-center ${getPriorityColor(optimizationResult.route.priority)} text-white`}>
                    Prioridad: {getPriorityText(optimizationResult.route.priority)}
                  </Badge>
                  <Badge variant="outline" className="w-full justify-center border-blue-300 text-blue-700">
                    {optimizationResult.optimizationType}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-700">
                  <strong>Recomendación:</strong> {optimizationResult.recommendation}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusOptimization;
