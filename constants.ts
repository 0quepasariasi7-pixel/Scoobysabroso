import { FunctionDeclaration, Type } from "@google/genai";
import { MenuData } from "./types";

export const TOTAL_PAGES = 4;

export const AI_SYSTEM_INSTRUCTION = `Eres Scooby-Doo, el asistente de menú del food truck 'ScoobySabroso'. Tu trabajo es ayudar a los clientes a elegir qué comer. Habla como Scooby-Doo, usando frases como '¡Scooby Dooby Doo!', '¡Ruh-roh!', y mezclando algunas palabras con 'R' al principio (ej. 'Rerico').
IMPORTANTE: El menú que te proporciono es la base, PERO EL DUEÑO PUEDE HABERLO MODIFICADO. Basa tus respuestas en el menú JSON que se te pasa en el contexto actual de la conversación. Si un plato no está en el JSON, no lo recomiendes.
REGLA DE VENTA CLAVE: Si el cliente pregunta específicamente por lo 'mejor', 'lo más rico', 'lo más popular', o pide que lo sorprendas ('sorpréndeme'), tu primera recomendación DEBE ser siempre el 'Scoobyhuevo', ¡es nuestro plato estrella! (A menos que el dueño lo haya quitado del menú).

**REGLAS DE VENTA PARA CHURRASCOS:**
1.  **PREGUNTAR POR EL PAN:** CADA VEZ que un cliente pida CUALQUIER churrasco, DEBES preguntarle si lo quiere en 'pan Frica' o 'pan Marraqueta'. Al actualizar el pedido, modifica el nombre del artículo para incluir la elección. Ejemplo: 'Scoobyhuevo (en Marraqueta)'.
2.  **OFRECER PAPAS FRITAS:** DESPUÉS de que el cliente elija su pan, DEBES ofrecerle "agregar papas fritas por solo $500". Si acepta, agrégalas como un nuevo artículo: { name: 'Papas Fritas (Extra)', price: '$500' }.

**ROL DE MASTER SOMMELIER:**
Actúa como un experto recomendador de combinaciones. Tu misión es mejorar la experiencia del cliente y aumentar el valor del pedido.
*   **Si piden comida:** Sugiere la bebida perfecta. Ejemplo: si piden un 'Scoobyhuevo' con tocino y queso, podrías decir '¡Ruh-roh! Para ese misterio de sabor, te rrecomiendo una Coca-Cola bien helada para rrefrescar, ¡o un Jugo Natural del Día para un toque más rrico!'.
*   **Si piden bebidas (grupo):** Si detectas un pedido con 4 o más bebidas, sugiere proactivamente churrascos para compartir. Ejemplo: '¡Rerfecto! Veo que son varias bebidas. ¿Les gustaría acompañarlas con unos churrascos como el 'Bacon Cheddar' o 'La Fantasmal' para compartir el misterio del sabor?'.

ACCIÓN DE ACTUALIZAR/FINALIZAR PEDIDO:
1.  **Actualizar**: CADA VEZ que un cliente agregue o cambie un artículo de su pedido, DEBES llamar a la herramienta 'finalizeOrder' con la lista completa y actualizada de 'items' y el 'total'. NO incluyas el 'customerName' en estas llamadas de actualización. Esto permitirá que el cliente vea su pedido en tiempo real.
2.  **Finalizar**: Cuando el cliente haya confirmado su pedido completo (ej. 'eso es todo', 'confírmalo') y te haya dado su nombre, DEBES hacer una LLAMADA FINAL a la herramienta 'finalizeOrder'. En esta última llamada, incluye la lista final de 'items', el 'total' Y el 'customerName' para cerrar el pedido.
REGLA DE NOMBRE: Es CRUCIAL que uses el nombre de la persona que va a RECOGER el pedido. EJEMPLLO: Si el cliente dice 'Mi nombre es Rodrigo, pero lo va a retirar Jaime', el nombre que debes usar en 'customerName' es 'Jaime'. Si solo da un nombre, usa ese.
INICIO CON PEDIDO PARCIAL: Si la conversación comienza con un artículo ya configurado (ej. una fajita), tu primer mensaje debe confirmar esa elección. LUEGO, llama inmediatamente a 'finalizeOrder' para mostrar este primer artículo en el resumen del pedido (sin 'customerName'). Después, pregunta qué más le gustaría añadir.`;

export const FINALIZE_ORDER_TOOL: FunctionDeclaration = {
  name: "finalizeOrder",
  description: "Procesa y actualiza el pedido del cliente. Llama a esta función cada vez que el pedido cambie (agregar/quitar artículos) para que el cliente vea el total actualizado. Incluye el 'customerName' SÓLO en la llamada final para confirmar y cerrar el pedido.",
  parameters: {
    // FIX: Replaced string literal "OBJECT" with Type.OBJECT enum.
    type: Type.OBJECT,
    properties: {
      customerName: {
        // FIX: Replaced string literal "STRING" with Type.STRING enum.
        type: Type.STRING,
        description: "El nombre de la persona que recogerá el pedido. Proporciónalo SÓLO cuando el pedido esté completamente confirmado y listo para ser finalizado.",
      },
      items: {
        // FIX: Replaced string literal "ARRAY" with Type.ARRAY enum.
        type: Type.ARRAY,
        description: "La lista de artículos en el pedido con su nombre y precio.",
        items: {
          // FIX: Replaced string literal "OBJECT" with Type.OBJECT enum.
          type: Type.OBJECT,
          properties: {
            // FIX: Replaced string literal "STRING" with Type.STRING enum.
            name: { type: Type.STRING, description: "Nombre del artículo." },
            // FIX: Replaced string literal "STRING" with Type.STRING enum.
            price: { type: Type.STRING, description: "Precio del artículo." },
          },
          required: ["name", "price"],
        },
      },
      total: {
        // FIX: Replaced string literal "STRING" with Type.STRING enum.
        type: Type.STRING,
        description: "El costo total del pedido en formato de texto (ej. '$12.700').",
      },
    },
    required: ["items", "total"], // customerName is now optional
  },
};

export const DEFAULT_MENU: MenuData = {
  churrascos: [
    {
      name: "Scoobyhuevo",
      description: "Cebolla acaramelizada, queso cheddar, tocino, huevo.",
      price: "$7.000",
      image: "https://i.imgur.com/yvdBkwP.png"
    },
    {
      name: "Bacon Cheddar",
      description: "Doble queso cheddar, tocino, bbq.",
      price: "$6.000",
      image: "https://i.imgur.com/UcN4FLW.png",
    },
    {
      name: "La Fantasmal",
      description: "Champiñón, cebollín, queso fundido, salsa de la casa.",
      price: "$6.500",
      image: "https://i.imgur.com/cj9dZd6.png",
    },
    {
      name: "Shagui Misterio",
      description: "Cebolla acaramelizada, pimentón rojo, champiñón y queso fundido.",
      price: "$6.500",
    },
    {
      name: "La Especial",
      description: "Palta, cebolla morada, pepinillo, queso cheddar y tocino.",
      price: "$6.000",
    },
    {
      name: "Italiano",
      description: "Tomate, palta, mayo.",
      price: "$5.700",
    },
    {
      name: "Chacarero",
      description: "Tomate, poroto verde, ají verde, mayonesa.",
      price: "$6.000",
    },
    {
      name: "Dinámico",
      description: "Chucrut, salsa americana, tomate, palta y mayonesa.",
      price: "$6.000",
    },
    {
      name: "Luco",
      description: "Queso amarillo fundido.",
      price: "$5.000",
    },
  ],
  extras: [
      { name: "Champiñón", price: "$990" },
      { name: "Salsa Cheddar", price: "$990" },
      { name: "Queso Cheddar", price: "$800" },
      { name: "Tocino", price: "$800" },
      { name: "Choclo", price: "$500" },
      { name: "Pepinillo", price: "$500" },
      { name: "Cebollín", price: "$500" },
  ],
  fajitas: {
    proteins: [
        { name: "Pollo" },
        { name: "Carne de Vacuno" },
        { name: "Mechada" },
        { name: "Camarones" },
    ],
    accompaniments: [
        { name: "Palta" },
        { name: "Tomate" },
        { name: "Champiñón" },
        { name: "Pimentón (rojo, verde)" },
        { name: "Queso Fundido" },
        { name: "Poroto Verde" },
        { name: "Cebolla Acaramelizada" },
        { name: "Cebolla Morada" },
        { name: "Aceituna" },
        { name: "Pepinillo" },
        { name: "Papas Fritas" },
        { name: "Queso Cheddar" },
    ],
    categories: [
      {
          name: "ARMA TU FAJITA MISTERIOSA",
          description: "Combina hasta 3 proteínas",
          options: [
              { name: "1 Proteína + 3 Acompañamientos", price: "$4.500" },
              { name: "2 Proteínas + 3 Acompañamientos", price: "$5.700" },
              { name: "3 Proteínas + 3 Acompañamientos", price: "$6.700" },
          ],
      },
      {
          name: "EXTRA FAJITA 30CM",
          description: "Combina hasta 4 proteínas",
          options: [
              { name: "1 proteína + 4 verduras", price: "$7.500" },
              { name: "2 proteínas + 3 verduras", price: "$8.700" },
              { name: "3 proteínas + 3 verduras", price: "$9.700" },
              { name: "4 proteínas + 3 verduras", price: "$12.000" },
          ],
      },
    ]
  },
  drinks: [
    {
        name: "Coca-Cola",
        description: "Clásica e inconfundible.",
        image: "https://i.imgur.com/rBtnU7r.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" },
            { name: "Botella (1.5L)", price: "$2.500" }
        ]
    },
    {
        name: "Fanta",
        description: "El sabor burbujeante de la naranja.",
        image: "https://i.imgur.com/fVLEojK.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" },
            { name: "Botella (1.5L)", price: "$2.500" }
        ]
    },
    {
        name: "Sprite",
        description: "Refrescante sabor a lima-limón.",
        image: "https://i.imgur.com/29uN3Ig.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" },
            { name: "Botella (1.5L)", price: "$2.500" }
        ]
    },
    {
        name: "Bilz",
        description: "Refrescante sabor a frambuesa.",
        image: "https://i.imgur.com/6TIAibX.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" },
            { name: "Botella (1.5L)", price: "$2.500" }
        ]
    },
    {
        name: "Pap",
        description: "El clásico sabor a papaya.",
        image: "https://i.imgur.com/WUDEv67.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" },
            { name: "Botella (1.5L)", price: "$2.500" }
        ]
    },
    {
        name: "Kem Xtreme",
        description: "Intenso sabor frutal, ¡pura energía!",
        image: "https://i.imgur.com/gBGhF8y.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" }
        ]
    },
    {
        name: "Limón Soda",
        description: "El toque justo de limón y gas.",
        image: "https://i.imgur.com/7Emy3N8.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" }
        ]
    },
    {
        name: "Canada Dry Ginger Ale",
        description: "El clásico y sutil sabor del jengibre.",
        image: "https://i.imgur.com/stfEtwM.png",
        options: [
            { name: "Lata (350cc)", price: "$1.500" }
        ]
    },
    {
        name: "Agua Mineral con Gas",
        description: "Refrescante y pura, con un toque de misterio.",
        image: "https://i.imgur.com/ciqrr7k.png",
        options: [
            { name: "Botella (500ml)", price: "$1.200" }
        ]
    },
    {
        name: "Agua Mineral sin Gas",
        description: "Hidratación en su forma más natural.",
        image: "https://i.imgur.com/ciqrr7k.png",
        options: [
            { name: "Botella (500ml)", price: "$1.200" }
        ]
    },
    {
        name: "Jugo Natural del Día",
        description: "Pregunta por el sabor misterioso de hoy.",
        image: "https://i.imgur.com/QigOZCx.png",
        options: [
            { name: "Vaso", price: "$2.000" }
        ]
    },
    {
        name: "Red Bull Energy Drink",
        description: "Para cuando necesitas resolver misterios toda la noche.",
        image: "https://i.imgur.com/pPmLntr.png",
        options: [
            { name: "Lata (250ml)", price: "$2.200" }
        ]
    },
  ],
  salsas: [
    { name: "Mayo" },
    { name: "Mayo Casera" },
    { name: "Ketchup" },
    { name: "Mostaza" },
    { name: "Mayo de Ajo" },
    { name: "Ají" },
    { name: "BBQ" },
    { name: "Mayo de Queso" },
    { name: "Ciboulette" },
  ],
  socials: {
    instagram: "https://www.instagram.com/scoobysabroso",
    tiktok: "https://www.tiktok.com/@scoobysabroso",
    instagramIcon: "https://i.imgur.com/yDtkL5K.png",
    tiktokIcon: "https://i.imgur.com/q9qX2tq.png",
  },
  customPages: []
};