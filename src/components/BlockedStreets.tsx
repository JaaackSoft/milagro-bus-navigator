
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const availableStreets = [
  "Av. García Moreno",
  "Calle 8 de Noviembre", 
  "Av. Jaime Roldós",
  "Av. 17 de Septiembre",
  "Calle Bolívar",
  "Av. Los Vergeles",
  "Calle Estudiantes",
  "Av. Universitaria",
  "Calle Universidad",
  "Av. Norte"
];

interface BlockedStreetsProps {
  blockedStreets: string[];
  onBlockedStreetsChange: (streets: string[]) => void;
}

const BlockedStreets = ({ blockedStreets, onBlockedStreetsChange }: BlockedStreetsProps) => {
  const [selectedStreet, setSelectedStreet] = useState("");

  const addBlockedStreet = () => {
    if (!selectedStreet) return;
    
    if (blockedStreets.includes(selectedStreet)) {
      toast({
        title: "Calle ya bloqueada",
        description: "Esta calle ya está en la lista de bloqueadas",
        variant: "destructive"
      });
      return;
    }

    onBlockedStreetsChange([...blockedStreets, selectedStreet]);
    setSelectedStreet("");
    
    toast({
      title: "Calle bloqueada",
      description: `${selectedStreet} ha sido añadida a calles bloqueadas`,
    });
  };

  const removeBlockedStreet = (street: string) => {
    onBlockedStreetsChange(blockedStreets.filter(s => s !== street));
    
    toast({
      title: "Bloqueo removido",
      description: `${street} ya no está bloqueada`,
    });
  };

  const clearAllBlocked = () => {
    onBlockedStreetsChange([]);
    
    toast({
      title: "Todos los bloqueos removidos",
      description: "Todas las calles están ahora disponibles",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select value={selectedStreet} onValueChange={setSelectedStreet}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona calle a bloquear" />
          </SelectTrigger>
          <SelectContent>
            {availableStreets
              .filter(street => !blockedStreets.includes(street))
              .map((street) => (
                <SelectItem key={street} value={street}>
                  {street}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={addBlockedStreet} 
          disabled={!selectedStreet}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Bloquear Calle
        </Button>
      </div>

      {blockedStreets.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">Calles Bloqueadas:</h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllBlocked}
              className="text-red-600 hover:text-red-700"
            >
              Limpiar Todo
            </Button>
          </div>
          
          <div className="space-y-1">
            {blockedStreets.map((street) => (
              <Badge 
                key={street} 
                variant="destructive" 
                className="flex items-center justify-between w-full p-2"
              >
                <span className="text-xs">{street}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBlockedStreet(street)}
                  className="h-4 w-4 p-0 text-white hover:bg-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {blockedStreets.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay calles bloqueadas actualmente
        </p>
      )}
    </div>
  );
};

export default BlockedStreets;
