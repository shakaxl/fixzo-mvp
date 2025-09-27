export default async function handler(req, res) {
  try {
    // PARA TESTING LOCAL - usar IP pública de Perú
    // PARA TESTING LOCAL - usar IP pública de Perú
const ip = '200.48.3.124'; // IP fija para testing

console.log('🧪 TESTING con nueva API IPGeolocation:', ip);

// Llamar a nueva API de geolocalización
const geoUrl = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEOLOCATION_API_KEY}&ip=${ip}&lang=es`;
console.log('🌍 Consultando nueva API:', geoUrl);

const response = await fetch(geoUrl);
const locationData = await response.json();

console.log('📍 Nueva respuesta geo:', locationData);

if (locationData.country_name) {
      const technicians = generateTechniciansForLocation(locationData);
      
      res.status(200).json({
        success: true,
        debug: {
          ipUsed: ip,
          geoResponse: locationData
        },
        location: {
  ciudad: locationData.city || 'Lima',
  distrito: locationData.district || locationData.state_prov || 'San Isidro',
  pais: locationData.country_name || 'Perú'
},
        technicians: technicians
      });
    } else {
      console.log('❌ Error geo:', locationData.message);
      
      const fallbackTechnicians = generateTechniciansForLocation({
        city: 'Lima',
        regionName: 'San Isidro'
      });
      
      res.status(200).json({
        success: true,
        location: {
          ciudad: 'Lima',
          distrito: 'San Isidro', 
          pais: 'Perú'
        },
        technicians: fallbackTechnicians,
        fallback: true,
        debug: {
          ipUsed: ip,
          error: locationData.message
        }
      });
    }
  } catch (error) {
    console.error('❌ Error geolocalización:', error);
    res.status(500).json({ error: 'Error obteniendo ubicación' });
  }
}

// Tu función generateTechniciansForLocation se mantiene igual...
function generateTechniciansForLocation(locationData) {
  const ciudad = locationData.city || 'Lima';
  const distrito = locationData.regionName || 'San Isidro';
  
  // Distritos cercanos de Lima (simulados)
  const distritosLima = [
    'San Isidro', 'Miraflores', 'San Borja', 'Surco', 'La Molina',
    'Jesús María', 'Magdalena', 'Pueblo Libre', 'Lince', 'Barranco',
    'San Miguel', 'Jesús María', 'Callao', 'Chorrillos'
  ];
  
  // Seleccionar 2 distritos aleatorios (uno puede ser el actual)
  const distrito1 = distrito;
  const distrito2 = distritosLima[Math.floor(Math.random() * distritosLima.length)];
  
  return [
    {
      name: "Carlos Mendoza",
      location: `${distrito1}, ${ciudad}`,
      distance: `${(Math.random() * 3 + 0.5).toFixed(1)} km`,
      rating: 4.9,
      reviews: 127,
      solution: "🖥️ SOPORTE REMOTO: Acceso seguro para eliminar virus, optimizar sistema y acelerar rendimiento sin moverte de casa",
      price: 25,
      time: "30-45 min",
      specialty: "Especialista en Soporte Remoto"
    },
    {
      name: "María Rodriguez",
      location: `${distrito2}, ${ciudad}`, 
      distance: `${(Math.random() * 4 + 1.0).toFixed(1)} km`,
      rating: 4.8,
      reviews: 98,
      solution: "🔧 SERVICIO PRESENCIAL: Reinstalación Windows, particionado profesional e instalación completa de programas",
      price: 35,
      time: "2-3 horas", 
      specialty: "Técnica en Sistemas Presencial"
    }
  ];
}