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

const prompt = `Indica el tipo y grado de aceite recomendado para este vehículo, incluyendo **2 o 3 marcas disponibles en Perú**. Formato claro y directo:
- **Marca:** ${datos.marca}
- **Modelo:** ${datos.modelo}
- **Año:** ${datos.anio}
- **Kilometraje:** ${datos.kilometraje}
- **Combustible:** ${datos.combustible}
- **Uso:** ${datos.uso}
- **Transmisión:** ${datos.transmision}
- **Proporciona marcas específicas de aceite en Perú.**`;

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
    res.json({ recomendacion: texto });
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