
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useTranslate } from "@/hooks/use-translate";
import { useLanguage } from "@/context/LanguageContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { currentLanguage } = useLanguage();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // This is a placeholder for Supabase authentication
      // We're simulating a successful login for demo purposes
      if (credentials.email === "admin@example.com" && credentials.password === "password") {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message
        toast({
          title: t('loginSuccessful'),
          description: t('welcomeAdmin'),
        });

        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setError(t('invalidEmailPassword'));
      toast({
        title: t('loginFailed'),
        description: t('invalidCredentials'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4" dir={currentLanguage.rtl ? "rtl" : "ltr"}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">{t('adminArea')}</CardTitle>
          <CardDescription>{t('signInToAdmin')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={credentials.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('password')}</Label>
                <a href="#" className="text-xs text-slate-500 hover:text-slate-800">
                  {t('forgotPassword')}
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('signingIn') : t('signIn')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm text-slate-500">
          <p className="w-full">
            {t('demoCredentials')}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
