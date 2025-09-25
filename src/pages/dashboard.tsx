import { useState, useEffect } from 'react';

interface Lead {
  id: number;
  problema: string;
  archivo: string | null;
  fecha: Date;
  ubicacion: string;
}

interface Stats {
  total: number;
  hoy: number;
  estaSemana: number;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    hoy: 0,
    estaSemana: 0
  });

  // Simular datos por ahora
  useEffect(() => {
    // Aquí conectarías con tu base de datos real
    const mockLeads: Lead[] = [
      {
        id: 1,
        problema: "Mi computadora está muy lenta desde hace una semana, el disco siempre está al 100%",
        archivo: "screenshot.png",
        fecha: new Date(),
        ubicacion: "San Isidro, Lima"
      },
      {
        id: 2, 
        problema: "No me reconoce el USB y hace ruidos extraños",
        archivo: null,
        fecha: new Date(Date.now() - 24 * 60 * 60 * 1000), // Ayer
        ubicacion: "Miraflores, Lima"
      }
    ];
    
    setLeads(mockLeads);
    setStats({
      total: mockLeads.length,
      hoy: 1,
      estaSemana: mockLeads.length
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              📊 FIXZO Dashboard
            </h1>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              ← Volver a FIXZO
            </button>
          </div>
          
          {/* Estadísticas */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-blue-800">Total Leads</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{stats.hoy}</div>
              <div className="text-green-800">Hoy</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.estaSemana}</div>
              <div className="text-purple-800">Esta Semana</div>
            </div>
          </div>

          {/* Lista de Leads */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Últimos Leads</h2>
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-4 gap-4 items-start">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-800 mb-2">Problema:</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {lead.problema.length > 100 ? 
                        `${lead.problema.substring(0, 100)}...` : 
                        lead.problema
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Detalles:</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        📎 {lead.archivo || 'Sin archivo'}
                      </p>
                      <p className="text-gray-600">
                        📍 {lead.ubicacion}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Fecha:</h4>
                    <p className="text-gray-600 text-sm">
                      {lead.fecha.toLocaleDateString('es-PE')}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {lead.fecha.toLocaleTimeString('es-PE')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {leads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No hay leads aún
              </h3>
              <p className="text-gray-500">
                Los leads aparecerán aquí cuando alguien use el formulario
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}