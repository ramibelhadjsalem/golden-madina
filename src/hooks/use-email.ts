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

  return {
    sendEmail,
    sendDirectEmail,
    isSubmitting
  };
};
