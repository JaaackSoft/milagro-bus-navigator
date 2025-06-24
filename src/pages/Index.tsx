
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, Route, MapPin, Clock, AlertTriangle } from "lucide-react";
import RouteSelector from "@/components/RouteSelector";
import RouteMap from "@/components/RouteMap";
import BlockedStreets from "@/components/BlockedStreets";

const Index = () => {
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [blockedStreets, setBlockedStreets] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Bus className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Sistema de Rutas Milagro</h1>
              <p className="text-blue-100">Simulador de transporte público - Ciudad de Milagro, Ecuador</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Route Selection */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Planificar Ruta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RouteSelector 
                  onRouteSelect={setSelectedRoute}
                  blockedStreets={blockedStreets}
                  onTimeEstimate={setEstimatedTime}
                />
              </CardContent>
            </Card>

            {/* Time Estimate */}
            {estimatedTime && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Tiempo Estimado
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {estimatedTime} min
                    </div>
                    <p className="text-gray-600">Duración aproximada del viaje</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blocked Streets */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Calles Bloqueadas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <BlockedStreets 
                  blockedStreets={blockedStreets}
                  onBlockedStreetsChange={setBlockedStreets}
                />
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur h-full">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Mapa de Rutas - Milagro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-full">
                <RouteMap 
                  selectedRoute={selectedRoute}
                  blockedStreets={blockedStreets}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bus Stops Info */}
        <Card className="mt-6 shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle>Paradas Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { name: "Terminal", color: "bg-red-500" },
                { name: "UNEMI", color: "bg-blue-500" },
                { name: "Milagro Norte", color: "bg-green-500" },
                { name: "Los Vergeles", color: "bg-yellow-500" },
                { name: "Colegio 17 de Septiembre", color: "bg-purple-500" }
              ].map((stop) => (
                <div key={stop.name} className="text-center">
                  <div className={`w-4 h-4 rounded-full ${stop.color} mx-auto mb-2`}></div>
                  <Badge variant="outline" className="text-xs">
                    {stop.name}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
