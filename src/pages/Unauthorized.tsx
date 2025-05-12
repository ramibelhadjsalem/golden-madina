import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "@/hooks/use-translate";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { t } = useTranslate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('unauthorized')}</h1>
        <p className="text-gray-600 mb-6">{t('unauthorizedMessage')}</p>
        <div className="flex flex-col space-y-2">
          <Button onClick={() => navigate("/")} variant="default">
            {t('backToHome')}
          </Button>
          <Button onClick={() => navigate(-1)} variant="outline">
            {t('goBack')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
