import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendBookingNotification } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceId, preferredDate, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Get service name if serviceId is provided
    let serviceName: string | null = null;
    if (serviceId) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
      serviceName = service?.nameZhTW || service?.nameEn || null;
    }

    // Create booking/inquiry
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone: phone || null,
        serviceId: serviceId || null,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        message,
        status: 'new',
      },
    });

    // Send email notification (don't block the response)
    sendBookingNotification({
      name,
      email,
      phone,
      serviceName,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      message,
    }).catch((err) => console.error('Failed to send notification:', err));

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
