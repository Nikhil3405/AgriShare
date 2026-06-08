import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  X, 
  Camera, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import equipmentService from "../services/equipmentService";

const EquipmentPhotos = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `https://agrishare-52sg.onrender.com${path}`;
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await equipmentService.getImages(id);
      setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [id]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    
    if (validFiles.length !== files.length) {
      alert("Please select only image files (JPG, PNG, WebP).");
    }
    
    // Create local preview URLs
    const filesWithPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setSelectedFiles(prev => [...prev, ...filesWithPreviews]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      setUploading(true);
      for (const item of selectedFiles) {
        const formData = new FormData();
        formData.append("image", item.file);
        await equipmentService.uploadImage(id, formData);
      }
      
      // Cleanup previews
      selectedFiles.forEach(item => URL.revokeObjectURL(item.preview));
      setSelectedFiles([]);
      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Remove this photo?")) return;
    try {
      setDeletingId(imageId);
      await equipmentService.deleteImage(imageId);
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      alert("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 page-fade-in">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-primary rounded-2xl mb-4">
          <Camera size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Showcase Your Equipment</h1>
        <p className="text-slate-500 mt-2">High-quality photos increase your chances of getting rented by 3x.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 hover:border-primary/50 transition-colors text-center relative group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary transition-colors">
                <Upload size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-900">Drop photos here</p>
                <p className="text-xs text-slate-500 mt-1">or click to browse from device</p>
              </div>
            </div>
          </div>

          {/* Local Preview List */}
          {selectedFiles.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm animate-in slide-in-from-top-4">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex justify-between items-center">
                Ready to Upload
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px]">{selectedFiles.length} Selected</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedFiles.map((item, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                {uploading ? "Uploading..." : "Confirm Upload"}
              </button>
            </div>
          )}

          <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex gap-4">
            <div className="text-emerald-600 shrink-0 mt-1"><ShieldCheck size={20} /></div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              AgriShare verifies photos to ensure trust. Make sure your equipment is clearly visible and well-lit.
            </p>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-card min-h-[400px]">
            <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <ImageIcon className="text-primary" size={22} />
              Current Gallery
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-2xl" />)}
              </div>
            ) : images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                  <ImageIcon size={40} />
                </div>
                <h3 className="text-slate-900 font-bold">No photos yet</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Upload at least 2 photos to make your listing look professional.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div key={image.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <img
                      src={getImageUrl(image.image)}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-sm">
                        Cover Photo
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <button
                        onClick={() => handleDelete(image.id)}
                        disabled={deletingId === image.id}
                        className="bg-white text-red-600 p-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-50 transition-all active:scale-90"
                      >
                        {deletingId === image.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50 pt-8">
              <p className="text-slate-500 text-sm font-medium">
                {images.length > 0 ? "Happy with your gallery?" : "You can add more photos later."}
              </p>
              <button
                onClick={() => navigate(`/dashboard`)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 active:scale-95"
              >
                Finish & Go to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EquipmentPhotos;