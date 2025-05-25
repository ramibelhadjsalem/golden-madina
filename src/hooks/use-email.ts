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

// Password Reset Template Configuration
const PASSWORD_RESET_TEMPLATE_ID = "template_3nx1hho"; // Replace with your password reset template ID

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



// Token encoding/decoding functions for stateless password reset
const encodeResetToken = (email: string, expiresAt: number): string => {
  try {
    const tokenData = {
      email,
      expiresAt
    };
    // Base64 encode the token data
    const encoded = btoa(JSON.stringify(tokenData));
    // Add some random padding to make tokens less predictable
    const padding = Math.random().toString(36).substring(2, 8);
    return `${encoded}.${padding}`;
  } catch (error) {
    console.error('Error encoding token:', error);
    throw new Error('Failed to generate reset token');
  }
};

const decodeResetToken = (token: string): { email: string; expiresAt: number } | null => {
  try {
    // Remove the padding (everything after the last dot)
    const encoded = token.split('.')[0];
    const decoded = atob(encoded);
    const tokenData = JSON.parse(decoded);

    // Validate the structure
    if (tokenData && typeof tokenData.email === 'string' && typeof tokenData.expiresAt === 'number') {
      return tokenData;
    }
    return null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const isTokenExpired = (expiresAt: number): boolean => {
  return Date.now() > expiresAt;
};

// Simple token reuse prevention using localStorage
const USED_TOKENS_KEY = 'used_reset_tokens';

const markTokenAsUsed = (token: string) => {
  try {
    const usedTokens = JSON.parse(localStorage.getItem(USED_TOKENS_KEY) || '[]');
    usedTokens.push({ token, usedAt: Date.now() });

    // Clean tokens older than 24 hours
    const cleanedTokens = usedTokens.filter((item: any) =>
      Date.now() - item.usedAt < 86400000 // 24 hours
    );

    localStorage.setItem(USED_TOKENS_KEY, JSON.stringify(cleanedTokens));
  } catch (error) {
    console.error('Error marking token as used:', error);
  }
};

const isTokenUsed = (token: string): boolean => {
  try {
    const usedTokens = JSON.parse(localStorage.getItem(USED_TOKENS_KEY) || '[]');
    return usedTokens.some((item: any) => item.token === token);
  } catch (error) {
    console.error('Error checking if token is used:', error);
    return false;
  }
};

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

  // Function to send password reset email
  const sendPasswordResetEmail = async (email: string) => {
    setIsSubmitting(true);

    try {
      // Generate reset token with 1 hour expiration
      const expiresAt = Date.now() + 3600000; // 1 hour from now
      const token = encodeResetToken(email, expiresAt);
      const resetLink = `${window.location.origin}/admin/forgot-password?token=${token}`;

      console.log('Generated reset link:', resetLink); // For debugging

      // Prepare email template data
      const templateParams = {
        to_email: email,
        user_email: email,
        reset_link: resetLink,
        company_name: COMPANY_INFO.name || "Golden Madina",
        current_year: new Date().getFullYear().toString(),
        current_date: new Date().toLocaleString(),
        expiry_time: "1 hour"
      };

      const result = await emailjs.send(
        serviceId,
        PASSWORD_RESET_TEMPLATE_ID,
        templateParams,
        publicKey
      );

      console.log('Password reset email sent!', result.text);

      if (showToast) {
        toast({
          title: "Reset Email Sent",
          description: "Check your email for password reset instructions.",
        });
      }

      // Call the success callback if provided
      if (onSuccess) onSuccess();

      return { success: true, token, result };

    } catch (error: any) {
      console.error('Failed to send password reset email:', error.text);

      if (showToast) {
        toast({
          title: t('error') || 'Error',
          description: "Failed to send reset email. Please try again.",
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

  // Function to verify reset token
  const verifyResetToken = (token: string) => {
    console.log('Verifying token:', token); // For debugging

    // Check if token has already been used
    if (isTokenUsed(token)) {
      console.log('Token has already been used'); // For debugging
      return { valid: false, email: null };
    }

    const tokenData = decodeResetToken(token);

    if (!tokenData) {
      console.log('Token could not be decoded'); // For debugging
      return { valid: false, email: null };
    }

    if (isTokenExpired(tokenData.expiresAt)) {
      console.log('Token has expired'); // For debugging
      return { valid: false, email: null };
    }

    console.log('Token is valid for email:', tokenData.email); // For debugging
    return { valid: true, email: tokenData.email };
  };

  // Function to consume reset token (validate and mark as used)
  const consumeResetToken = (token: string) => {
    // // Check if token has already been used
    // if (isTokenUsed(token)) {
    //   return { success: false, email: null };
    // }

    const tokenData = decodeResetToken(token);

    if (!tokenData) {
      return { success: false, email: null };
    }

    if (isTokenExpired(tokenData.expiresAt)) {
      return { success: false, email: null };
    }

    // Mark token as used to prevent reuse
    markTokenAsUsed(token);

    return { success: true, email: tokenData.email };
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

  return {
    sendEmail,
    sendDirectEmail,
    sendPasswordResetEmail,
    verifyResetToken,
    consumeResetToken,
    validatePassword,
    getPasswordStrength,
    isSubmitting
  };
};
