
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useRef } from "react";
import { StarIcon, StarHalfIcon, ChevronLeftIcon, ChevronRightIcon, ImageIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { useTranslate } from "@/hooks/use-translate";
import { useEmail } from "@/hooks/use-email";
import { CAROUSEL_IMAGES, COMPANY_INFO, FEATURED_REVIEWS, RICH_HISTORY, SOCIAL_MEDIA } from "@/lib/config";

const Index = () => {
  const { t } = useTranslate();
  const form = useRef<HTMLFormElement>(null);
  const { sendEmail, isSubmitting } = useEmail();

  const showToast = () => {
    toast({
      title: t('welcome'),
      description: t('heritageSubtitle'),
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // You can add additional parameters to be sent with the email
    const additionalParams = {
      site_url: window.location.origin,
      page_url: window.location.href,
      browser: navigator.userAgent,
      company_name: COMPANY_INFO.name
    };

    sendEmail(e, form, additionalParams);
  };

  return (
    <main className="flex-grow">
      {/* Hero Section with Carousel */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl font-playfair font-bold mb-6 animate-fade-in">{t('heritageTitle')}</h1>
            <p className="text-xl mb-8 animate-fade-in opacity-90">
              {t('heritageSubtitle')}
            </p>
            <Button
              onClick={showToast}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium tracking-wide animate-fade-in"
            >
              {t('exploreCollection')}
            </Button>
          </div>

          {/* Carousel */}
          <div className="max-w-4xl mx-auto mt-12">
            <Carousel className="w-full">
              <CarouselContent>
                {CAROUSEL_IMAGES.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="overflow-hidden rounded-lg">
                        <AspectRatio ratio={16 / 9}>
                          <img
                            src={image.src}
                            alt={image.alt}
                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                          />
                        </AspectRatio>
                        <div className="bg-black bg-opacity-50 p-3 text-white text-center">
                          <p className="text-sm font-light italic">{image.caption}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-black left-2 md:left-4" />
              <CarouselNext className="text-black right-2 md:right-4" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">{t('ourMission')}</h2>
            <p className="text-gray-600">
              {t('missionText')}
            </p>
          </div>

          {/* Featured Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="font-playfair">{t('artifactCollection')}</CardTitle>
                <CardDescription>{t('artifactDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('artifactContent')}</p>
              </CardContent>
              <CardFooter>
                <Link to="/artifacts">
                  <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">{t('browseCollection')}</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="font-playfair">{t('heritageBlog')}</CardTitle>
                <CardDescription>{t('blogDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('blogContent')}</p>
              </CardContent>
              <CardFooter>
                <Link to="/blog">
                  <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">{t('readArticles')}</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="font-playfair">{t('ourServices')}</CardTitle>
                <CardDescription>{t('servicesDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{t('servicesContent')}</p>
              </CardContent>
              <CardFooter>
                <Link to="/services">
                  <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50">{t('viewServices')}</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Company History Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair font-bold mb-6 text-center">{t('ourRichHistory')}</h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="space-y-4">
                  <p className="text-slate-700">
                    {t('historyText1')}
                  </p>
                  <p className="text-slate-700">
                    {t('historyText2')}
                  </p>
                  <p className="text-slate-700">
                    {t('historyText3')}
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative h-80 w-80 rounded-full overflow-hidden border-8 border-amber-100">
                  <img
                    src={RICH_HISTORY.image}
                    alt={RICH_HISTORY.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-3xl font-bold text-amber-700">{COMPANY_INFO.foundedYear}</h3>
                <p className="text-sm mt-1">{t('founded')}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-3xl font-bold text-amber-700">{COMPANY_INFO.artifactsPreserved}</h3>
                <p className="text-sm mt-1">{t('artifactsPreserved')}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-3xl font-bold text-amber-700">{COMPANY_INFO.annualVisitors}</h3>
                <p className="text-sm mt-1">{t('annualVisitors')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold mb-10 text-center">{t('visitorReviews')}</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURED_REVIEWS.map((review, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex mb-2">
                  {[...Array(Math.floor(review.rating))].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                  {review.rating % 1 !== 0 && (
                    <StarHalfIcon className="h-5 w-5 fill-amber-400 text-amber-400" />
                  )}
                </div>
                <p className="italic text-slate-600 mb-4">"{review.text}"</p>
                <p className="font-semibold text-slate-800">- {review.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="#"
              className="inline-flex items-center text-amber-700 hover:text-amber-600 font-medium"
            >
              {t('viewMoreReviews')}
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-playfair font-bold mb-10 text-center">{t('faq')}</h2>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">
                  {t('faqQuestion1')}
                </AccordionTrigger>
                <AccordionContent>
                  {t('faqAnswer1')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">
                  {t('faqQuestion2')}
                </AccordionTrigger>
                <AccordionContent>
                  {t('faqAnswer2')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">
                  {t('faqQuestion3')}
                </AccordionTrigger>
                <AccordionContent>
                  {t('faqAnswer3')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">
                  {t('faqQuestion4')}
                </AccordionTrigger>
                <AccordionContent>
                  {t('faqAnswer4')}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">
                  {t('faqQuestion5')}
                </AccordionTrigger>
                <AccordionContent>
                  {t('faqAnswer5')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-amber-700 to-amber-900 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-6">{t('becomePartOfHistory')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('ctaText')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services">
              <Button className="bg-white hover:bg-gray-100 text-amber-900 font-medium">{t('bookService')}</Button>
            </Link>
            <Link to="/artifacts">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 bg-white/20">
                {t('exploreArtifacts')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold mb-6 text-center">{t('contactUs') || 'Contact Us'}</h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            {t('contactText') || 'Have questions or want to get in touch? Fill out the form below and we\'ll get back to you as soon as possible.'}
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left side - Contact Information */}
            <div className="flex flex-col justify-center">
              <div className="mb-8">
                <h3 className="text-2xl font-playfair font-semibold mb-4">{t('getInTouch') || 'Get in Touch'}</h3>
                <p className="text-gray-600 mb-6">
                  {t('contactInfoText') || 'We value your interest in our heritage collection. Our team is ready to assist you with any inquiries about our artifacts, services, or visiting information.'}
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{t('email') || 'Email'}</h4>
                      <p className="text-gray-600">{COMPANY_INFO.email}</p>
                      <p className="text-gray-500 text-sm mt-1">{t('emailResponse') || `We respond within ${COMPANY_INFO.responseTime}`}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{t('phone')}</h4>
                      <p className="text-gray-600">{COMPANY_INFO.phone}</p>
                      <p className="text-gray-500 text-sm mt-1">{t('phoneHours') || COMPANY_INFO.workingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{t('location') || 'Location'}</h4>
                      <p className="text-gray-600">{COMPANY_INFO.address}, {COMPANY_INFO.city}</p>
                      <p className="text-gray-500 text-sm mt-1">{t('visitingHours') || COMPANY_INFO.visitingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-playfair font-semibold mb-3">{t('followUs') || 'Follow Us'}</h3>
                <div className="flex space-x-4">
                  <a href={SOCIAL_MEDIA.facebook} target="_blank" rel="noopener noreferrer" className="text-center w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                  </a>
                  <a href={SOCIAL_MEDIA.instagram} target="_blank" rel="noopener noreferrer" className="flex justify-center w-10 h-10 bg-amber-100 text-amber-700 rounded-full  items-center hover:bg-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                    </svg>
                  </a>
                  <a href={SOCIAL_MEDIA.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                    </svg>
                  </a>
                  <a href={SOCIAL_MEDIA.whatsup} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center hover:bg-amber-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right side - Contact Form Card */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-playfair">{t('contactForm') || 'Contact Form'}</CardTitle>
                  <CardDescription>{t('contactFormDescription') || 'Fill out the form below and we\'ll get back to you as soon as possible.'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form ref={form} onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          {t('yourName') || 'Your Name'}*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name" // Important: name attribute for EmailJS
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder={t('enterYourName') || 'Enter your name'}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          {t('emailAddress') || 'Email Address'}*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email" // Important: name attribute for EmailJS
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder={t('enterYourEmail') || 'Enter your email'}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          {t('phoneNumber') || 'Phone Number'}
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone" // Important: name attribute for EmailJS
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder={t('enterYourPhone') || 'Enter your phone number (optional)'}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                          {t('subject') || 'Subject'}*
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject" // Important: name attribute for EmailJS
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder={t('enterSubject') || 'Enter subject'}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                          {t('yourMessage') || 'Your Message'}*
                        </label>
                        <textarea
                          id="message"
                          name="message" // Important: name attribute for EmailJS
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder={t('enterYourMessage') || 'Enter your message here...'}
                        ></textarea>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        type="submit"
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? (t('sending') || 'Sending...')
                          : (t('sendMessage') || 'Send Message')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
