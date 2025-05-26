/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, FormEvent, RefObject } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from '@/hooks/use-toast';
import { useTranslate } from '@/hooks/use-translate';
import { COMPANY_INFO } from '@/lib/config';

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_lfpyori"; // Replace with your actual service ID
const EMAILJS_TEMPLATE_ID = "template_s78rdl9"; // Replace with your actual template ID
const EMAILJS_PUBLIC_KEY = "TaKmgQvMqfGVXkn92"; // Replace with your actual public key


// Booking Notification Template ID
const BOOKING_STATUS_TEMPLATE_ID = "template_qjeqqhs"; // Replace with your booking status template ID

interface UseEmailProps {
  onSuccess?: () => void;
  onError?: () => void;
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  showToast?: boolean;
}

interface EmailTemplateParams {
  [key: string]: string | number;
}


export const useEmail = ({
  onSuccess,
  onError,
  serviceId = EMAILJS_SERVICE_ID,
  templateId = EMAILJS_TEMPLATE_ID,
  publicKey = EMAILJS_PUBLIC_KEY,
  showToast = true
}: UseEmailProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslate();

  // Function to send email using form reference
  const sendEmail = async (e: FormEvent<HTMLFormElement>, formRef: RefObject<HTMLFormElement>, additionalParams?: EmailTemplateParams) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSubmitting(true);

    try {
      // Add additional parameters if provided
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.name = key;
          hiddenInput.value = String(value);
          formRef.current?.appendChild(hiddenInput);
        });
      }

      // Add current date/time
      const now = new Date();
      const timeInput = document.createElement('input');
      timeInput.type = 'hidden';
      timeInput.name = 'time';
      timeInput.value = now.toLocaleString();
      formRef.current?.appendChild(timeInput);

      // Add current year for copyright
      const yearInput = document.createElement('input');
      yearInput.type = 'hidden';
      yearInput.name = 'year';
      yearInput.value = String(now.getFullYear());
      formRef.current?.appendChild(yearInput);

      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey,
      );

      console.log('Email successfully sent!', result.text);

      if (showToast) {
        toast({
          title: t('messageSent') || 'Message Sent',
          description: t('thankYouForMessage') || 'Thank you for your message. We\'ll get back to you soon!',
        });
      }

      // Reset the form
      formRef.current?.reset();

      // Remove the dynamically added hidden inputs
      const hiddenInputs = formRef.current.querySelectorAll('input[type="hidden"]');
      hiddenInputs.forEach(input => input.remove());

      // Call the success callback if provided
      if (onSuccess) onSuccess();

      return result;

    } catch (error: any) {
      console.error('Failed to send email:', error.text);

      if (showToast) {
        toast({
          title: t('error') || 'Error',
          description: t('emailSendError') || 'There was an error sending your message. Please try again later.',
          variant: "destructive",
        });
      }

      // Call the error callback if provided
      if (onError) onError();

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to send email with direct parameters (without form)
  const sendDirectEmail = async (params: EmailTemplateParams) => {
    setIsSubmitting(true);

    try {
      // Add current date/time and year
      const now = new Date();
      const templateParams = {
        ...params,
        time: now.toLocaleString(),
        year: now.getFullYear(),
        company_name: COMPANY_INFO.name || 'Heritage Gateway Nexus',
        company_email: COMPANY_INFO.email,
        company_phone: COMPANY_INFO.phone
      };

      const result = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      console.log('Email successfully sent!', result.text);

      if (showToast) {
        toast({
          title: t('messageSent') || 'Message Sent',
          description: t('thankYouForMessage') || 'Thank you for your message. We\'ll get back to you soon!',
        });
      }

      // Call the success callback if provided
      if (onSuccess) onSuccess();

      return result;

    } catch (error: any) {
      console.error('Failed to send email:', error.text);

      if (showToast) {
        toast({
          title: t('error') || 'Error',
          description: t('emailSendError') || 'There was an error sending your message. Please try again later.',
          variant: "destructive",
        });
      }

      // Call the error callback if provided
      if (onError) onError();

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };



  // Function to validate password strength
  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  // Function to get password strength (0-5)
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  // Function to send booking status notification email
  const sendBookingStatusEmail = async (bookingData: {
    customer_name: string;
    customer_email: string;
    service_name: string;
    booking_date: string;
    booking_id: string;
    status: 'pending' | 'confirmed' | 'canceled';
    participants?: number;
    notes?: string;
    cancellation_reason?: string;
  }) => {
    setIsSubmitting(true);

    try {
      // Determine status-specific content
      const getStatusContent = (status: string) => {
        switch (status) {
          case 'confirmed':
            return {
              status_title: '🎉 Booking Confirmed!',
              status_message: 'Great news! Your booking has been confirmed. We\'re excited to welcome you to Golden Madina.',
              status_color: '#16a34a',
              status_bg_color: '#dcfce7',
              status_border_color: '#bbf7d0',
              status_icon: '✓',
              action_title: 'What\'s Next?',
              action_items: [
                'Please arrive 15 minutes before your scheduled time',
                'Bring a valid ID for verification',
                'If you need to make changes, contact us at least 24 hours in advance',
                'Check your email for any updates or additional information'
              ]
            };
          case 'canceled':
            return {
              status_title: '❌ Booking Canceled',
              status_message: 'We regret to inform you that your booking has been canceled. We apologize for any inconvenience this may cause.',
              status_color: '#dc2626',
              status_bg_color: '#fef2f2',
              status_border_color: '#fecaca',
              status_icon: '!',
              action_title: 'What\'s Next?',
              action_items: [
                'If you paid in advance, a refund will be processed within 3-5 business days',
                'You can book a new appointment at any time through our website',
                'Contact us if you have any questions about this cancellation',
                'We hope to serve you again in the future'
              ]
            };
          case 'pending':
          default:
            return {
              status_title: '⏳ Booking Pending',
              status_message: 'Your booking is currently pending review. We will confirm your booking shortly.',
              status_color: '#d97706',
              status_bg_color: '#fef3c7',
              status_border_color: '#fde68a',
              status_icon: '⏳',
              action_title: 'What\'s Next?',
              action_items: [
                'We will review your booking request within 24 hours',
                'You will receive a confirmation email once approved',
                'Please keep this booking ID for your records',
                'Contact us if you have any questions'
              ]
            };
        }
      };

      const statusContent = getStatusContent(bookingData.status);

      const templateParams = {
        to_email: bookingData.customer_email,
        customer_name: bookingData.customer_name,
        service_name: bookingData.service_name,
        booking_date: bookingData.booking_date,
        booking_id: bookingData.booking_id,
        booking_status: bookingData.status,
        participants: bookingData.participants?.toString() || '1',
        notes: bookingData.notes || 'No special notes',
        cancellation_reason: bookingData.cancellation_reason || 'Administrative decision',

        // Status-specific content
        status_title: statusContent.status_title,
        status_message: statusContent.status_message,
        status_color: statusContent.status_color,
        status_bg_color: statusContent.status_bg_color,
        status_border_color: statusContent.status_border_color,
        status_icon: statusContent.status_icon,
        action_title: statusContent.action_title,
        action_items: statusContent.action_items.join('|'), // Join with | for template parsing

        // Company info
        company_name: COMPANY_INFO.name || "Golden Madina",
        company_email: COMPANY_INFO.email,
        company_phone: COMPANY_INFO.phone,
        current_year: new Date().getFullYear().toString(),
        current_date: new Date().toLocaleString(),
      };

      const result = await emailjs.send(
        serviceId,
        BOOKING_STATUS_TEMPLATE_ID,
        templateParams,
        publicKey
      );

      console.log(`Booking ${bookingData.status} email sent!`, result.text);

      if (showToast) {
        const statusMessages = {
          confirmed: "Booking confirmation email has been sent to the customer.",
          canceled: "Booking cancellation email has been sent to the customer.",
          pending: "Booking pending email has been sent to the customer."
        };

        toast({
          title: "Status Email Sent",
          description: statusMessages[bookingData.status] || "Booking status email has been sent to the customer.",
        });
      }

      if (onSuccess) onSuccess();
      return { success: true, result };

    } catch (error: any) {
      console.error(`Failed to send booking ${bookingData.status} email:`, error.text);

      if (showToast) {
        toast({
          title: "Email Error",
          description: "Failed to send status notification email to customer.",
          variant: "destructive",
        });
      }

      if (onError) onError();
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sendEmail,
    sendDirectEmail,
    sendBookingStatusEmail,
    validatePassword,
    getPasswordStrength,
    isSubmitting
  };
};
