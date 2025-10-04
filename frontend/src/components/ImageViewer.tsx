import { Card } from "@/components/ui/card";

interface ImageViewerProps {
  imageUrl: string;
}

export const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  return (
    <Card className="relative w-full overflow-hidden border-border bg-card/50 backdrop-blur">
      <div className="flex items-center justify-center p-8 bg-gradient-to-b from-background/50 to-background">
        <img 
          src={imageUrl} 
          alt="Analysis subject"
          className="max-w-full h-auto object-contain rounded-lg shadow-2xl"
        />
      </div>
    </Card>
  );
};
