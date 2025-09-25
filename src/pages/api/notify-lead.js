export default async function handler(req, res) {
  // DEBUG: Verificar que la API key existe
  console.log('🔑 API Key existe:', !!process.env.RESEND_API_KEY);
  console.log('🔑 Primeros 10 caracteres:', process.env.RESEND_API_KEY?.substring(0, 10));

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { problema, archivo, timestamp, userLocation } = req.body;

  try {
    // ENVIAR EMAIL REAL
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'FIXZO <onboarding@resend.dev>',
        to: ['wpadilla007@gmail.com'],
        subject: '🚨 NUEVO LEAD INTERESADO EN FIXZO!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb; margin-bottom: 20px;">🔥 ¡Alguien necesita ayuda técnica!</h2>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #374151;">📋 Problema reportado:</h3>
              <p style="font-size: 16px; line-height: 1.5; margin: 0; color: #1f2937; font-weight: 500;">
                "${problema}"
              </p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin: 20px 0; flex-wrap: wrap;">
              <div style="margin: 10px 0;">
                <strong style="color: #374151;">📎 Archivo:</strong><br>
                <span style="color: #6b7280;">${archivo}</span>
              </div>
              <div style="margin: 10px 0;">
                <strong style="color: #374151;">📍 Ubicación:</strong><br>
                <span style="color: #6b7280;">${userLocation}</span>
              </div>
              <div style="margin: 10px 0;">
                <strong style="color: #374151;">⏰ Hora:</strong><br>
                <span style="color: #6b7280;">${new Date(timestamp).toLocaleString('es-PE')}</span>
              </div>
            </div>
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
              <strong style="color: #15803d;">💡 Acción recomendada:</strong><br>
              <span style="color: #166534;">Contacta este lead en las próximas 2 horas para mayor conversión.</span>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://fixzo.app" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
                Ver FIXZO.APP
              </a>
            </div>
          </div>
        `
      })
    });

    if (response.ok) {
      const emailResult = await response.json();
      console.log('✅ Email enviado:', emailResult.id);
      
      res.status(200).json({ 
        success: true, 
        message: 'Lead capturado y email enviado',
        emailId: emailResult.id
      });
    } else {
      const error = await response.text();
      console.error('❌ Error Resend:', error);
      res.status(500).json({ error: 'Error enviando email' });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}