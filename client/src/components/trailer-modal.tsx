import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getYoutubeUrl } from "@/lib/tmdb-api";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string | null;
}

export default function TrailerModal({ isOpen, onClose, videoKey }: TrailerModalProps) {
  if (!videoKey) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 w-full max-w-3xl bg-transparent border-none shadow-none">
        <div className="relative">
          <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 hover:bg-black/70 rounded-full p-2 text-white"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <span className="material-icons">close</span>
            </Button>
          </div>
          
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={getYoutubeUrl(videoKey)}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
