
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
import { useState } from "react";
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
import { CAROUSEL_IMAGES, COMPANY_INFO, FEATURED_REVIEWS, RICH_HISTORY } from "@/lib/config";

const Index = () => {
  const { t } = useTranslate();

  const showToast = () => {
    toast({
      title: t('welcome'),
      description: t('heritageSubtitle'),
    });
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
    </main>
  );
};

export default Index;
