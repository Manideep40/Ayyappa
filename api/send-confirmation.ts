import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import QRCode from 'qrcode'

const resend = new Resend(process.env.RESEND_API_KEY || '')

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { email, bookingId, date, time } = req.body as {
      email?: string
      bookingId?: string
      date?: string
      time?: string
    }

    if (!email || !bookingId || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const proto = (req.headers['x-forwarded-proto'] as string) || 'https'
    const host = req.headers.host || 'localhost'
    const ticketUrl = `${proto}://${host}/bookings`

    const qrPayload = JSON.stringify({ bookingId, date, time, url: ticketUrl })
    const qrPng = await QRCode.toBuffer(qrPayload, { type: 'png', width: 320, margin: 1 })

    if (!process.env.EMAIL_FROM || !process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'Email is not configured' })
    }

    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
        <h2 style="margin: 0 0 12px;">Darshan Booking Confirmed</h2>
        <p style="margin: 0 0 8px;">Swami Saranam! Your darshan booking has been confirmed.</p>
        <ul style="padding-left: 18px; margin: 10px 0;">
          <li><strong>Booking ID:</strong> ${bookingId}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
        </ul>
        <p style="margin: 12px 0;">Please present this QR code at the temple entry:</p>
        <img alt="Darshan Ticket QR" width="240" height="240" src="cid:ticket-qr" style="display:block; border: 8px solid #fef3c7; border-radius: 16px;" />
        <p style="margin: 16px 0;">You can also manage your bookings here: <a href="${ticketUrl}">${ticketUrl}</a></p>
        <p style="margin: 16px 0; color:#555; font-size: 14px;">Harivarasanam Hariharatmajam Devam!</p>
      </div>
    `

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Darshan Booking Confirmed',
      html,
      attachments: [
        { filename: 'ticket-qr.png', content: qrPng, contentType: 'image/png', contentId: 'ticket-qr' },
      ],
    })

    if (result.error) {
      return res.status(502).json({ error: result.error.message || 'Failed to send email' })
    }

    return res.status(200).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Unexpected error' })
  }
}

