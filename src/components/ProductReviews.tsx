import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({
  rating,
  onRate,
  interactive = false,
}: {
  rating: number;
  onRate?: (r: number) => void;
  interactive?: boolean;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={interactive ? 20 : 14}
          className={`${
            i < (hover || rating)
              ? "fill-accent text-accent"
              : "text-border"
          } ${interactive ? "cursor-pointer transition-colors" : ""}`}
          onClick={() => interactive && onRate?.(i + 1)}
          onMouseEnter={() => interactive && setHover(i + 1)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
};

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data as Review[]);
      if (user) {
        const existing = (data as Review[]).find((r) => r.user_id === user.id);
        setUserReview(existing || null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please sign in to leave a review", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Please select a star rating", variant: "destructive" });
      return;
    }
    if (!comment.trim()) {
      toast({ title: "Please write a comment", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const reviewerName =
      user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Anonymous";

    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: user.id,
      reviewer_name: reviewerName,
      rating,
      comment: comment.trim(),
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "You've already reviewed this product", variant: "destructive" });
      } else {
        toast({ title: "Failed to submit review", variant: "destructive" });
      }
    } else {
      toast({ title: "Review submitted!" });
      setRating(0);
      setComment("");
      fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-16 border-t border-border pt-12">
      {/* Summary */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Reviews
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(avgRating)} />
            <span className="text-sm text-muted-foreground font-body">
              {avgRating.toFixed(1)} ({reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      {!userReview && (
        <div className="bg-card border border-border rounded-sm p-6 mb-8">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
            {user ? "Write a Review" : "Sign in to Write a Review"}
          </h3>
          {user ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-body text-muted-foreground mb-2 block">
                  Your Rating
                </label>
                <StarRating rating={rating} onRate={setRating} interactive />
              </div>
              <div>
                <label className="text-sm font-body text-muted-foreground mb-2 block">
                  Your Review
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="bg-background"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1 font-body">
                  {comment.length}/500
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-gold text-accent-foreground hover:shadow-gold font-body letter-spacing-luxury uppercase text-sm"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-body">
              <a href="/auth" className="text-accent hover:underline">
                Sign in
              </a>{" "}
              to share your thoughts on this product.
            </p>
          )}
        </div>
      )}

      {userReview && (
        <div className="bg-accent/5 border border-accent/20 rounded-sm p-4 mb-8">
          <p className="text-sm font-body text-accent font-medium">
            ✓ You've already reviewed this product
          </p>
        </div>
      )}

      {/* Review List */}
      {loading ? (
        <p className="text-muted-foreground font-body text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground font-body text-sm">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-border pb-6 last:border-0"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-sm font-semibold text-foreground">
                    {review.reviewer_name}
                  </span>
                  <StarRating rating={review.rating} />
                </div>
                <span className="text-xs text-muted-foreground font-body">
                  {format(new Date(review.created_at), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
