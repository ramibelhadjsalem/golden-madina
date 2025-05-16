import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { handleImageError } from "@/lib/utils";

interface PortfolioCardCarouselProps {
  images: string[];
  name: string;
  className?: string;
}

const PortfolioCardCarousel = ({ images, name, className = "" }: PortfolioCardCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle navigation
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const goToIndex = (index: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex(index);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHovering) return;
      
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [images.length, isHovering]);

  // If there's only one image or no images, render a simple image
  if (images.length <= 1) {
    return (
      <div className={`aspect-square w-full overflow-hidden relative ${className}`}>
        <img
          src={images[0] || ""}
          alt={name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          onError={handleImageError}
        />
      </div>
    );
  }

  return (
    <div 
      className={`aspect-square w-full overflow-hidden relative ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      ref={carouselRef}
    >
      {/* Current image */}
      <img
        src={images[currentIndex]}
        alt={`${name} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        onError={handleImageError}
      />

      {/* Navigation buttons - only visible on hover */}
      <div className={`absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={goToPrevious}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 backdrop-blur-sm transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={goToNext}
          className="bg-black/30 hover:bg-black/50 text-white rounded-full p-1 backdrop-blur-sm transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Indicators */}
      <div className={`absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => goToIndex(index, e)}
            className={`h-1.5 rounded-full transition-all ${
              currentIndex === index 
                ? 'w-6 bg-white' 
                : 'w-1.5 bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PortfolioCardCarousel;
