'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import StarField from '../components/StarField';
import Script from 'next/script';

export default function FixzoApp() {
  const [step, setStep] = useState('landing');
  const [problem, setProblem] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [userLocation, setUserLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [technicians, setTechnicians] = useState<Array<{
  name: string;
  location: string;
  distance: string;
  rating: number;
  reviews: number;
  solution: string;
  price: number;
  time: string;
  specialty: string;
}>>([]);

  const handleStartDemo = () => {
    setStep('form');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.size <= 10 * 1024 * 1024) {
      setFile(uploadedFile);
    } else {
      alert('El archivo debe ser menor a 10MB');
    }
  };

  const handleAnalyze = async () => {
  if (!problem.trim() || problem.trim().length < 10) {
    alert('Por favor describe tu problema con más detalle');
    return;
  }

  setStep('processing');
  
  // Función para enviar notificación
  const sendNotification = async (location: string) => {
    try {
      const leadData = {
        problema: problem,
        archivo: file ? file.name : 'Sin archivo',
        timestamp: new Date().toISOString(),
        userLocation: location
      };

      await fetch('/api/notify-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });

      console.log('✅ Notificación enviada correctamente');
    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
    }
  };

  // INTENTAR GPS PRIMERO
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // ÉXITO GPS
      // ÉXITO GPS
async (position) => {
  try {
    const { latitude, longitude } = position.coords;
    console.log('📍 GPS obtenido:', latitude, longitude);
    
    // Convertir coordenadas a dirección
    
    
    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=es`);
    const geoData = await geoResponse.json();
    
          
          // OpenStreetMap tiene estructura diferente
const address = geoData.address || {};
const distrito = address.suburb || address.neighbourhood || address.city_district || address.county;
const ciudad = address.city || address.town || address.village || 'Lima';
const provincia = address.state || address.region || 'Lima';


const preciseLocation = `${distrito || ciudad}, ${provincia}`;
setUserLocation(preciseLocation);

// Crear técnicos GPS
const gpsTechnicians = [
  {
    name: "Carlos Mendoza",
    location: `${distrito || 'Tu zona'}, ${ciudad}`,
              distance: `${(Math.random() * 2 + 0.3).toFixed(1)} km`,
              rating: 4.9,
              reviews: 127,
              solution: "🖥️ SOPORTE REMOTO COMPLETO: Acceso seguro a tu PC para eliminar virus, optimizar sistema a nivel lógico, limpiar archivos innecesarios y acelerar rendimiento. ¡Tu PC volverá a volar sin moverte de casa!",
              price: 25,
              time: "30-45 min",
              specialty: "Especialista en Soporte Remoto"
            },
            {
              name: "María Rodriguez",
              location: `${geoData.district || 'Tu zona'}, Lima`,
              distance: `${(Math.random() * 3 + 1.0).toFixed(1)} km`,
              rating: 4.8,
              reviews: 98,
              solution: "🔧 SERVICIO PRESENCIAL PREMIUM: Reinstalación completa de Windows, particionado profesional de discos, instalación de programas esenciales y configuración personalizada. ¡Computadora como nueva con garantía!",
              price: 35,
              time: "2-3 horas",
              specialty: "Técnica en Sistemas Presencial"
            }
          ];
          
          setTechnicians(gpsTechnicians);
          await sendNotification(preciseLocation);
          console.log('✅ Ubicación GPS:', preciseLocation);
          
        } catch (gpsError) {
  console.log('❌ Error procesando GPS, usando fallback IP');
  await usarFallbackIP();
}
      },
      // ERROR GPS - usar fallback
      async (error) => {
        console.log('🚫 GPS rechazado/error:', error.message);
console.log('⚠️ Usando fallback por IP en su lugar');
        await usarFallbackIP();
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  } else {
    console.log('📱 Navegador no soporta GPS, usando IP');
    await usarFallbackIP();
  }
  
  // Función fallback por IP
  async function usarFallbackIP() {
    try {
      const locationResponse = await fetch('/api/get-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problema: problem })
      });
      
      const locationData = await locationResponse.json();
      
      if (locationData.success) {
        const realLocation = `${locationData.location.distrito}, ${locationData.location.ciudad}`;
        setUserLocation(realLocation);
        setTechnicians(locationData.technicians);
        await sendNotification(realLocation);
        console.log('🌐 USANDO FALLBACK IP - no GPS');
console.log('📡 Respuesta IP API:', locationData);
console.log('✅ Fallback IP final:', realLocation);
      } else {
        setUserLocation('Lima, Perú');
        await sendNotification('Lima, Perú');
      }
    } catch (fallbackError) {
  console.error('❌ Error fallback IP:', fallbackError);
  setUserLocation('Lima, Perú');
  await sendNotification('Lima, Perú');
}
  }
  
  setTimeout(() => {
    setStep('results');
  }, 3000);
};

  const handleChooseTechnician = (techName: string) => {
    console.log('💰 CONVERSIÓN:', {
      tecnico: techName,
      problema: problem.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });
    
    alert(`¡Excelente! ${techName} ha sido notificado y te contactará en los próximos 15 minutos.`);
    
    // Reset después de 2 segundos
    setTimeout(() => {
      setStep('landing');
      setProblem('');
      setFile(null);
      setUserLocation('');
    }, 2000);
  };

  // PANTALLA DE PROCESAMIENTO
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center relative">
          <StarField />
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">🤖 Analizando tu problema...</h3>
          <p className="text-gray-600 mb-4">Conectando con técnicos especializados cerca de ti</p>
          
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <span>Procesando descripción...</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span>Buscando técnicos cercanos...</span>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></div>
              <span>📍 Detectando ubicación...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA DE RESULTADOS CON TÉCNICOS
if (step === 'results') {
  // Usar técnicos de geolocalización O fallback si no hay
  const currentTechnicians = technicians.length > 0 ? technicians : [
    {
      name: "Carlos Mendoza",
      location: "San Isidro, Lima",
      distance: "1.8 km",
      rating: 4.9,
      reviews: 127,
      solution: "🖥️ SOPORTE REMOTO COMPLETO: Acceso seguro a tu PC para eliminar virus, optimizar sistema a nivel lógico, limpiar archivos innecesarios y acelerar rendimiento. ¡Tu PC volverá a volar sin moverte de casa!",
      price: 25,
      time: "30-45 min",
      specialty: "Especialista en Soporte Remoto"
    },
    {
      name: "María Rodriguez",
      location: "Miraflores, Lima", 
      distance: "2.3 km",
      rating: 4.8,
      reviews: 98,
      solution: "🔧 SERVICIO PRESENCIAL PREMIUM: Reinstalación completa de Windows, particionado profesional de discos, instalación de programas esenciales y configuración personalizada. ¡Computadora como nueva con garantía!",
      price: 35,
      time: "2-3 horas",
      specialty: "Técnica en Sistemas Presencial"
    }
  ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
          <StarField />

          {/* Google Analytics - NUEVO CÓDIGO */}
    
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-center relative">
              <Image 
                src="/images/logo.png" 
                alt="FIXZO Logo" 
                width={100} 
                height={100}
                className=""
              />

            <button 
              onClick={() => setStep('landing')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white flex items-center"
            >
              ✕ Cerrar
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Mensaje de éxito */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              ¡{currentTechnicians.length} técnicos especializados respondieron!
            </h2>
            <p className="text-blue-100 text-lg">
              📍 Técnicos cerca de {userLocation}
            </p>
          </div>

          {/* Resumen del problema */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8 border border-white/20">
            <h4 className="font-semibold text-white mb-2">Tu problema:</h4>
            <p className="text-blue-100 text-sm">{problem}</p>
            {file && (
              <p className="text-green-300 text-sm mt-2">📎 Archivo adjunto: {file.name}</p>
            )}
          </div>

          {/* Grid de técnicos */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {currentTechnicians.map((tech, index) => (
              <div key={index} className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-lg">
                        {tech.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{tech.name}</h3>
                      <p className="text-sm text-blue-600 font-medium">{tech.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-500 mb-1">
                      <span className="text-lg">⭐</span>
                      <span className="font-bold ml-1">{tech.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({tech.reviews})</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      📍 {tech.distance}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">💡 Solución propuesta:</h4>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg leading-relaxed">
                    {tech.solution}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-6 bg-green-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <span className="text-green-600 font-bold text-xl">S/{tech.price}</span>
                    <span className="text-gray-500 text-sm ml-1">soles</span>
                  </div>
                  <div className="text-blue-600 font-medium">
                    ⏱️ {tech.time}
                  </div>
                </div>

                <button
                  onClick={() => handleChooseTechnician(tech.name)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Elegir a {tech.name.split(' ')[0]} →
                </button>
              </div>
            ))}
          </div>

          {/* Garantía */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center border border-white/20">
            <div className="text-4xl mb-3">🛡️</div>
            <h3 className="font-bold text-white mb-2">Garantía de Satisfacción</h3>
            <p className="text-blue-100 text-sm">
              Si no quedas 100% satisfecho, te devolvemos tu dinero. Todos nuestros técnicos están verificados.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // FORMULARIO MEJORADO
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 relative">
          <StarField />
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/logo.png" 
              alt="FIXZO Logo" 
              width={100} 
              height={100}
              className=""
            />
            
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Describe tu problema técnico
            </h2>
            <p className="text-gray-600">
              Nuestros técnicos especializados analizarán tu problema y te darán soluciones personalizadas
            </p>
          </div>

          <div className="space-y-6">
            {/* Campo de problema */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ¿Qué problema tienes con tu computadora? *
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Ejemplo: Mi computadora está muy lenta desde hace una semana. Al abrir programas se demora mucho, el disco siempre está al 100% y a veces se cuelga..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-40 text-gray-800"
                maxLength={800}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-500">
                  Mínimo 10 caracteres para un mejor diagnóstico
                </div>
                <div className="text-sm text-gray-500">
                  {problem.length}/800 caracteres
                </div>
              </div>
            </div>

            {/* Upload de archivos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sube una imagen o video del problema (opcional)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              >
                <div className="text-4xl mb-4">📸</div>
                {file ? (
                  <div>
                    <p className="text-green-600 font-semibold">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">Archivo seleccionado ✅</p>
                    <p className="text-xs text-blue-600 mt-1">Click para cambiar archivo</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 font-semibold mb-2">
                      Click para subir imagen o video
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, MP4 - Máximo 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Botón de análisis */}
            <div className="pt-4">
              <button
                onClick={handleAnalyze}
                disabled={!problem.trim() || problem.trim().length < 10}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg disabled:transform-none disabled:shadow-none"
              >
                {problem.trim().length < 10 ? 
                  `Necesitas ${10 - problem.trim().length} caracteres más` :
                  '🔍 Analizar Problema y Conectar con Técnicos'
                }
              </button>
            </div>

            {/* Botón volver */}
            <button 
              onClick={() => setStep('landing')}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              ← Volver al inicio
            </button>

            {/* Indicadores de confianza */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-xs text-gray-600">Técnicos activos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">4.8⭐</div>
                <div className="text-xs text-gray-600">Calificación promedio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-xs text-gray-600">Disponibilidad</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LANDING PRINCIPAL
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      <StarField />
      <nav className="bg-white/10 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-center">
          <Image 
            src="/images/logo.png" 
            alt="FIXZO Logo" 
            width={120} 
            height={120}
            className=""
          />
        
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-8">
              <span className="bg-blue-400/20 text-blue-200 px-4 py-2 rounded-full text-sm font-semibold border border-blue-400/30">
                🚀 Soporte técnico revolucionario
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Soporte Técnico
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Rápido y Confiable
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                a Solo un Clic
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-8">
              Conéctate con técnicos expertos en tu zona para resolver tus problemas informáticos. 
              Sin esperas, sin complicaciones.
            </p>
            
            <button
              onClick={handleStartDemo}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              ⚡ Resolver Mi Problema GRATIS
            </button>
            
            <div className="mt-8 text-sm text-blue-200">
              ✅ +500 técnicos activos • ⭐ 4.8/5 calificación • ⚡ Respuesta en 5 min
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <video 
                className="w-full h-auto rounded-2xl"
                controls
                poster="/images/hero-image.png"
              >
                <source src="/images/video-demo.mp4" type="video/mp4" />
                Tu navegador no soporta video.
              </video>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white/5 backdrop-blur-sm py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-white mb-6 drop-shadow-lg">Nuestro Servicio</h2>
              <p className="text-xl text-blue-100 mb-8">
                Imagina tu dispositivo en manos de un experto con solo un clic. FIXZO te conecta 
                con técnicos calificados para ofrecerte soluciones rápidas y efectivas.
              </p>
              <p className="text-xl text-blue-100 mb-8">
                Desde la instalación de programas hasta la recuperación de datos, nuestro servicio 
                hace que el soporte técnico sea fácil, confiable y accesible.
              </p>
            </div>
            <div className="relative">
                <Image 
                  src="/images/service-1.png"
                  alt="Servicio técnico profesional"
                  width={500}
                  height={350}
                  className="w-full h-auto rounded-xl"
                />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}