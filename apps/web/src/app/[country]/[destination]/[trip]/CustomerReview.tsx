"use client";

import { Star, StarHalf } from "lucide-react";
import { useState } from "react";
import { manrope } from "~/src/lib/fonts";
import { TypographyH4 } from "~/src/lib/typography";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../../../../packages/ui/src/components/avatar";

interface Review {
  id: number;
  name: string;
  avatar?: string;
  rating: number;
  time: string;
  text: string;
  country?: string;
  title?: string;
}

interface CustomerReviewsProps {
  reviews?: Review[];
}

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
        } else if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
        } else {
          return <Star key={i} className="h-4 w-4 fill-gray-200 text-gray-200" />;
        }
      })}
    </div>
  );
};

export default function CustomerReviews({ reviews }: CustomerReviewsProps) {
  // Use default reviews if no reviews provided or empty array
  const displayReviews = reviews && reviews.length > 0 ? reviews : [];

  const [visibleCount, setVisibleCount] = useState(3);

  return (
    <section className={`py-8 ${manrope.className}`}>
      {/* Reviews Grid */}
      <div className="space-y-4">
        <TypographyH4 className="font-bold text-gray-700">Reviews</TypographyH4>
        {displayReviews.slice(0, visibleCount).map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage src={review.avatar} alt={review.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-semibold">
                  {review.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <h5 className="font-semibold text-gray-800">{review.name}</h5>

                  <span className="text-xs text-gray-500">{review.time}</span>
                </div>

                {/* {review.country && (
      <TypographySmall className="text-gray-500">
        {review.country}
      </TypographySmall>
    )} */}

                <div className="mt-1">
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </div>

            {review.title && <h6 className="font-medium text-gray-800 mb-2">{review.title}</h6>}

            <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
          </div>
        ))}
      </div>

      {/* Load More / Show Less Button */}
      {displayReviews.length > 3 && (
        <div className="mt-6 text-center">
          {visibleCount < displayReviews.length ? (
            <button
              onClick={() => setVisibleCount(displayReviews.length)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All {displayReviews.length} Reviews
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(3)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </section>
  );
}
