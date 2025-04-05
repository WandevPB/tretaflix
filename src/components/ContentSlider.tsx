
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export interface ContentItem {
  id: string;
  title: string;
  poster: string;
  type: "movie" | "serie";
  year?: string;
  rating?: number;
}

interface ContentSliderProps {
  title: string;
  items: ContentItem[];
  className?: string;
  viewMoreLink?: string;
}

const ContentSlider = ({ title, items, className, viewMoreLink }: ContentSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkArrows = () => {
    if (sliderRef.current) {
      setShowLeftArrow(sliderRef.current.scrollLeft > 0);
      setShowRightArrow(
        sliderRef.current.scrollLeft <
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkArrows);
      window.addEventListener("resize", checkArrows);
      checkArrows();
    }

    return () => {
      if (slider) {
        slider.removeEventListener("scroll", checkArrows);
      }
      window.removeEventListener("resize", checkArrows);
    };
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { clientWidth } = sliderRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (sliderRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    if (sliderRef.current) {
      const x = e.pageX - sliderRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <div className={cn("mb-12", className)}>
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {viewMoreLink && (
          <Link 
            to={viewMoreLink} 
            className="text-sm text-gray-300 hover:text-tretaflix-red transition-colors"
          >
            Ver Mais
          </Link>
        )}
      </div>

      <div className="relative group">
        {showLeftArrow && (
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        <div
          ref={sliderRef}
          className="flex overflow-x-scroll scrollbar-none gap-2 px-4"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/${item.type === "movie" ? "filme" : "serie"}/${item.id}`}
              className="movie-card flex-none w-[160px] md:w-[180px]"
            >
              <div className="aspect-[2/3] bg-tretaflix-gray">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                />
                <div className="card-overlay">
                  <h3 className="text-sm font-medium truncate text-white">
                    {item.title}
                  </h3>
                  <div className="flex items-center text-xs text-gray-300 mt-1">
                    {item.year && <span>{item.year}</span>}
                    {item.year && item.rating && <span className="mx-1">•</span>}
                    {item.rating && <span>{item.rating}/10</span>}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showRightArrow && (
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ContentSlider;
