
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

const TOTAL_BUSES = 70;

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

  const calculateBusDistribution = () => {
    const totalFrequency = routeData.reduce((sum, route) => sum + route.frequency, 0);
    
    return routeData.map(route => {
      const proportion = route.frequency / totalFrequency;
      const assignedBuses = Math.round(proportion * TOTAL_BUSES);
      const busesPerHour = Math.max(1, Math.round(assignedBuses / 2)); // Asumiendo 2 turnos
      const intervalMinutes = Math.max(5, Math.round(60 / busesPerHour));
      
      return {
        ...route,
        assignedBuses,
        busesPerHour,
        intervalMinutes,
        utilization: Math.min(100, (route.frequency / (busesPerHour * 60)) * 100).toFixed(1)
      };
    });
  };

  const distributedRoutes = calculateBusDistribution();
  const totalAssignedBuses = distributedRoutes.reduce((sum, route) => sum + route.assignedBuses, 0);

  const calculateOptimization = () => {
    if (!selectedRoute) {
      toast({
        title: "Selecciona una ruta",
        description: "Por favor selecciona una ruta para optimizar",
        variant: "destructive"
      });
      return;
    }

    const route = distributedRoutes.find(r => `${r.from}-${r.to}` === selectedRoute);
    if (!route) return;

    const dailyTrips = route.busesPerHour * 12; // Estimación para 12 horas de servicio
    
    let recommendation = "";
    let optimizationType = "";
    
    if (parseFloat(route.utilization) >= 90) {
      recommendation = `Ruta sobrecargada (${route.utilization}% utilización). Se recomienda reasignar más buses desde rutas de menor demanda.`;
      optimizationType = "Reasignar Más Buses";
    } else if (parseFloat(route.utilization) >= 70) {
      recommendation = `Ruta bien optimizada (${route.utilization}% utilización). Mantener asignación actual.`;
      optimizationType = "Mantener Asignación";
    } else if (parseFloat(route.utilization) >= 50) {
      recommendation = `Ruta con capacidad disponible (${route.utilization}% utilización). Se puede optimizar reduciendo buses.`;
      optimizationType = "Optimizar Capacidad";
    } else {
      recommendation = `Ruta subutilizada (${route.utilization}% utilización). Considerar reasignar buses a rutas de mayor demanda.`;
      optimizationType = "Reasignar Buses";
    }

    const result = {
      route,
      dailyTrips,
      recommendation,
      optimizationType,
      efficiency: route.utilization
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
    const avgUtilization = (distributedRoutes.reduce((sum, route) => sum + parseFloat(route.utilization), 0) / distributedRoutes.length).toFixed(1);
    
    return { totalFrequency, avgFrequency, highDemandRoutes, avgUtilization };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <Bus className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{TOTAL_BUSES}</div>
            <p className="text-sm text-blue-600">Total de Colectivos</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{totalAssignedBuses}</div>
            <p className="text-sm text-green-600">Buses Asignados</p>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">{stats.highDemandRoutes}</div>
            <p className="text-sm text-orange-600">Rutas Alta Demanda</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{stats.avgUtilization}%</div>
            <p className="text-sm text-purple-600">Utilización Promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Buses por Ruta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Distribución de los 70 Colectivos por Ruta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {distributedRoutes.map((route, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{route.from} → {route.to}</p>
                  <p className="text-xs text-gray-500">{route.frequency} pasajeros/hora demandados</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-lg text-blue-600">{route.assignedBuses}</p>
                    <p className="text-xs text-gray-500">buses asignados</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-green-600">{route.busesPerHour}</p>
                    <p className="text-xs text-gray-500">buses/hora</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-orange-600">{route.intervalMinutes} min</p>
                    <p className="text-xs text-gray-500">intervalo</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-purple-600">{route.utilization}%</p>
                    <p className="text-xs text-gray-500">utilización</p>
                  </div>
                  <Badge className={`${getPriorityColor(route.priority)} text-white`}>
                    {getPriorityText(route.priority)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Los buses se distribuyen proporcionalmente según la demanda de cada ruta. 
              Total asignado: {totalAssignedBuses} de {TOTAL_BUSES} colectivos disponibles.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Optimizador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análisis de Optimización por Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una ruta para analizar" />
              </SelectTrigger>
              <SelectContent>
                {distributedRoutes.map((route, index) => (
                  <SelectItem key={index} value={`${route.from}-${route.to}`}>
                    {route.from} → {route.to} ({route.assignedBuses} buses asignados - {route.utilization}% utilización)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              onClick={calculateOptimization} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Analizar Optimización
            </Button>
          </div>

          {optimizationResult && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <h4 className="font-semibold mb-3 text-blue-800">
                Análisis: {optimizationResult.route.from} → {optimizationResult.route.to}
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Buses asignados:</span>
                    <span className="font-semibold">{optimizationResult.route.assignedBuses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Buses operando/hora:</span>
                    <span className="font-semibold">{optimizationResult.route.busesPerHour}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Intervalo promedio:</span>
                    <span className="font-semibold">{optimizationResult.route.intervalMinutes} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Viajes diarios estimados:</span>
                    <span className="font-semibold">{optimizationResult.dailyTrips}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Utilización de flota:</span>
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
