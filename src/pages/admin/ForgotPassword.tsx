import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

const ForgotPassword = () => {
  const { t } = useTranslate();
  const { currentLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset mode state
  const [isResetMode, setIsResetMode] = useState(false);

  // Check if we're in reset mode (coming from Supabase email link)
  useEffect(() => {
    // Function to get parameters from both URL search params and hash fragments
    const getAuthParams = () => {
      // First try to get from search params
      let accessToken = searchParams.get('access_token');
      let refreshToken = searchParams.get('refresh_token');
      let type = searchParams.get('type');

      // If not found in search params, try to get from hash fragments
      if (!accessToken || !refreshToken || !type) {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        const hashParams = new URLSearchParams(hash);

        accessToken = accessToken || hashParams.get('access_token');
        refreshToken = refreshToken || hashParams.get('refresh_token');
        type = type || hashParams.get('type');
      }

      return { accessToken, refreshToken, type };
    };

    const { accessToken, refreshToken, type } = getAuthParams();

    console.log('Full URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    console.log('Search params:', window.location.search);
    console.log('Auth params found:', {
      accessToken: accessToken ? 'present' : 'missing',
      refreshToken: refreshToken ? 'present' : 'missing',
      type
    });

    if (accessToken && refreshToken && type === 'recovery') {
      console.log('Setting session with tokens...');
      // Set the session with the tokens from Supabase
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error setting session:', error);
          toast({
            title: "Invalid or Expired Link",
            description: "This password reset link is invalid or has expired. Please request a new one.",
            variant: "destructive",
          });
          navigate('/admin');
        } else {
          console.log('Session set successfully:', data);
          setIsResetMode(true);
          // Clean up the URL by removing the hash
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      });
    } else {
      console.log('No valid auth params found for password reset');
    }
  }, [searchParams, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/forgot-password`,
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      console.error('Supabase Error:', error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple password validation function
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  // Simple password strength calculator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;
    return strength;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: passwordError,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Update the user's password in Supabase
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      // Log the successful update
      console.log('Password successfully updated in Supabase for user:', data.user?.email);

      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated. You can now log in with your new password.",
      });

      // Redirect to login page
      navigate('/admin');
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  // Reset Password Mode (coming from email link)
  if (isResetMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4" dir={currentLanguage.rtl ? "rtl" : "ltr"}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-serif">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your new password below. Make sure it's strong and secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded ${level <= passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Strength: <span className="font-medium">{strengthLabels[passwordStrength - 1] || 'Very Weak'}</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center space-x-2">
                    {password === confirmPassword ? (
                      <>
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-sm text-red-600">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting || passwordStrength < 3}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating Password...
                  </div>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Email Sent Confirmation
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4" dir={currentLanguage.rtl ? "rtl" : "ltr"}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-serif">Check Your Email</CardTitle>
            <CardDescription>
              We've sent password reset instructions to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-slate-600">
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> The reset link will expire in 24 hours for security reasons.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
            >
              Send Another Email
            </Button>
            <Link to="/admin" className="w-full">
              <Button variant="ghost" className="w-full">
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Default: Request Reset Email
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4" dir={currentLanguage.rtl ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-serif">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Instructions"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <Link to="/admin" className="w-full">
            <Button variant="ghost" className="w-full">
              Back to Login
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;