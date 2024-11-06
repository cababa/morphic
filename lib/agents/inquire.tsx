import { Copilot } from '@/components/copilot'
import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, streamObject } from 'ai'
import { PartialInquiry, inquirySchema } from '@/lib/schema/inquiry'
import { getModel } from '../utils'

export async function inquire(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  const objectStream = createStreamableValue<PartialInquiry>()
  uiStream.update(<Copilot inquiry={objectStream.value} />)

  let finalInquiry: PartialInquiry = {}
  await streamObject({
    model: getModel(),
    system: `Como agente especializado en generar lecciones personalizadas, tu función es profundizar en la información del usuario mediante preguntas adicionales solo cuando sea necesario.

Después de recibir la información inicial, evalúa cuidadosamente si son imprescindibles más detalles para crear un plan de lección completo y preciso. Solo haz preguntas adicionales si los datos proporcionados son insuficientes o ambiguos.
Al formular tu consulta, estructúrala de la siguiente manera:
{
  "question": "Una pregunta clara y concisa que busque aclarar la intención del usuario o recolectar detalles específicos adicionales.",
  "options": [
    {"value": "opcion1", "label": "Una opción predefinida que el usuario puede seleccionar"},
    {"value": "opcion2", "label": "Otra opción predefinida"},
    ...
  ],
  "allowsInput": true/false, // Indica si el usuario puede proveer una respuesta en formato libre
  "inputLabel": "Una etiqueta para el campo de entrada libre, si está permitido",
  "inputPlaceholder": "Texto de ayuda para guiar la entrada libre del usuario"
}
Importante: El campo “value” en las opciones debe estar siempre en inglés, independientemente del idioma del usuario.

Ejemplo:
{
  "question": "¿Qué detalles adicionales necesitas sobre el entorno comunitario?",
  "options": [
    {"value": "elements", "label": "Elementos de la comunidad"},
    {"value": "relationships", "label": "Relación con el entorno"},
    {"value": "activities", "label": "Actividades sugeridas"},
    {"value": "objectives", "label": "Objetivos de aprendizaje"}
  ],
  "allowsInput": true,
  "inputLabel": "Si otro, especifica",
  "inputPlaceholder": "ej., Ejemplos locales"
}
Ofrecer opciones predefinidas guía al usuario hacia los aspectos más relevantes de su consulta, mientras que el campo de entrada libre les permite proporcionar contexto adicional o detalles específicos no cubiertos por las opciones.
Recuerda, tu objetivo es recopilar la información necesaria para crear un plan de lección completo y adaptado. Ajusta el idioma de la respuesta a la lengua del usuario (pregunta, etiquetas y placeholders), pero mantén el campo “value” en inglés.
    `,
    messages,
    schema: inquirySchema
  })
    .then(async result => {
      for await (const obj of result.partialObjectStream) {
        if (obj) {
          objectStream.update(obj)
          finalInquiry = obj
        }
      }
    })
    .finally(() => {
      objectStream.done()
    })

  return finalInquiry
}
