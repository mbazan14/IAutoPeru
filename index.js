const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Configura tus datos reales de Azure OpenAI
const OPENAI_API_KEY = '3OHool1nqukqQYAgTCECmgnkBcBwQU9dkh4WAaUwdn3OLQTypvqNJQQJ99BFACHYHv6XJ3w3AAAAACOGJtFC'; // ← Reemplázala por tu clave real
const ENDPOINT = "https://migue-mbx0i92x-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2025-01-01-preview";

app.post("/recomendar-aceite", async (req, res) => {
  const datos = req.body;

const prompt = `Indica el tipo y grado de aceite recomendado para este vehículo, junto con **2 o 3 marcas disponibles en Perú**. Usa un formato **breve y directo**.  
- **Marca:** ${datos.marca}  
- **Modelo:** ${datos.modelo}  
- **Año:** ${datos.anio}  
- **Kilometraje:** ${datos.kilometraje}  
- **Combustible:** ${datos.combustible}  
- **Uso:** ${datos.uso}  
- **Transmisión:** ${datos.transmision}  

Además, en **caso de que el motor presente consumo de aceite**, sugiere opciones alternativas de viscosidad que ayuden a reducir la evaporación y mejorar la protección del motor.  

**Solo incluye el tipo de aceite, grado y marcas específicas en Perú, sin descripciones largas.**`;

  try {
    const respuesta = await axios.post(
      ENDPOINT,
      {
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

const texto = respuesta.data.choices[0].message.content.trim();

// 🔹 Filtrar texto para evitar duplicaciones y asegurar claridad
const textoLimpio = texto.split("\n\n").slice(0, 3).join("\n\n");

res.json({ recomendacion: textoLimpio });
  } catch (err) {
    console.error("❌ Error al llamar a la IA:", err.response?.data || err.message);
    res.status(500).json({ error: "No se pudo obtener una recomendación de la IA." });
  }
});

// ✅ Configura el puerto correctamente para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});

// 🌐 Endpoint de prueba para Render
app.get("/", (req, res) => {
  res.send("✅ Backend IAutoPeru activo y listo para recibir solicitudes!");
});