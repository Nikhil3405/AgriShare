import { useEffect, useState, useCallback } from "react";
import { 
  ImageIcon, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw 
} from "lucide-react";

const EquipmentGallery = ({ equipment }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (equipment?.images?.length > 0) {
      setSelectedImage(equipment.images[0].image);
      setActiveIndex(0);
    }
  }, [equipment]);

  // Handle Close Modal & Reset Zoom
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setScale(1);
  }, []);

  // Keyboard support for closing modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  const handleThumbnailClick = (img, index) => {
    setSelectedImage(img);
    setActiveIndex(index);
  };

  const handleZoom = (type) => {
    if (type === "in") setScale(prev => Math.min(prev + 0.5, 4));
    if (type === "out") setScale(prev => Math.max(prev - 0.5, 1));
    if (type === "reset") setScale(1);
  };

  if (!equipment?.images?.length) {
    return (
      <div className="w-full aspect-[16/9] bg-slate-100 rounded-3xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200">
        <ImageIcon size={48} strokeWidth={1} />
        <p className="mt-2 font-medium">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Stage - Reduced Height via aspect-[16/7] */}
      <div className="relative group overflow-hidden rounded-3xl shadow-md bg-transparent border border-white">
        <div className="flex items-center justify-center h-96 bg-transparent grid-cols-1">

        <img
          key={selectedImage}
          src={selectedImage}
          alt={equipment.name}
          className="h-96 transition-all duration-500 animate-in fade-in zoom-in-95 cursor-zoom-in"
          onClick={() => setIsModalOpen(true)}
        />
        </div>
        
        {/* Floating Controls Overlay */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-black/50 backdrop-blur-md text-white rounded-xl hover:bg-primary transition-colors shadow-lg"
            title="Expand Image"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
          {activeIndex + 1} / {equipment.images.length}
        </div>
      </div>

      {/* Thumbnails Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar snap-x touch-pan-x">
        {equipment.images.map((img, index) => (
          <button
            key={img.id}
            onClick={() => handleThumbnailClick(img.image, index)}
            className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden transition-all duration-200 snap-start border-2 ${
              activeIndex === index
                ? "border-primary ring-2 ring-primary/20 scale-95"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img.image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
          {/* Modal Header Actions */}
          <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
            <div className="flex items-center gap-2 bg-white/10 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
              <button 
                onClick={() => handleZoom("out")}
                className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
              <button 
                onClick={() => handleZoom("reset")}
                className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Reset"
              >
                <RotateCcw size={20} />
              </button>
              <button 
                onClick={() => handleZoom("in")}
                className="p-3 text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
            </div>
            <button 
              onClick={closeModal}
              className="p-3 bg-white text-slate-900 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
            >
              <X size={24} />
            </button>
          </div>

          {/* Zoomable Image Container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden p-10 cursor-grab active:cursor-grabbing">
            <img
              src={selectedImage}
              alt="Zoom view"
              style={{ transform: `scale(${scale})` }}
              className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out shadow-2xl rounded-lg"
            />
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium tracking-wide">
             {activeIndex + 1} of {equipment.images.length} — {equipment.name}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentGallery;