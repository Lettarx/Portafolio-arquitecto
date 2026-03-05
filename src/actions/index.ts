import { defineAction, ActionError } from 'astro:actions'
import { z } from 'astro:schema'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const server = {
  sendEmail: defineAction({
    accept: 'form',
    input: z.object({
      nombre: z.string(),
      email: z.string().email(),
      telefono: z.string(),
      'tipo-proyecto': z.string(),
      mensaje: z.string(),
      presupuesto: z.string().optional(),
    }),
    handler: async (input) => {
      try {
        const {data, error} = await resend.emails.send({
          from: 'onboarding@resend.dev', // en dev usa este
          to: 'alejandra.arkanetstudios@gmail.com',
          subject: 'Nuevo mensaje de contacto',
          html: `
            <p>Nombre: ${input.nombre}</p>
            <p>Email: ${input.email}</p>
            <p>Teléfono: ${input.telefono}</p>
            <p>Tipo de proyecto: ${input['tipo-proyecto']}</p>
            <p>Mensaje: ${input.mensaje}</p>
            <p>Presupuesto aproximado: ${input.presupuesto ?? 'No especificado'}</p>
          `
        })
        console.log('resend response: ', data)
        console.log('resend error', error)
        return { success: true }
      } catch (error) {
        throw new ActionError({ code: 'BAD_REQUEST', message: 'Error al enviar el correo' })
      }
    }
  })
}