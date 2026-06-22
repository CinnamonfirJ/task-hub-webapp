"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/utils/image";
import { Loader2, RotateCcw, ZoomIn } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ImageCropperModalProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: string) => void;
}

export function ImageCropperModal({
  image,
  isOpen,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation: number) => {
    setRotation(rotation);
  };

  const onCropCompleteInternal = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    try {
      setIsProcessing(true);
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden overflow-y-auto bg-white rounded-3xl border-none">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold text-gray-900">Crop Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[400px] mt-4 bg-gray-900">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            cropShape="round"
            showGrid={false}
          />
        </div>

        <div className="p-6 space-y-6">
          {/* Zoom Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <ZoomIn size={14} />
                <span>Zoom</span>
              </div>
              <span className="text-xs font-black text-[#6B46C1] bg-purple-50 px-2 py-0.5 rounded-full">{zoom.toFixed(1)}x</span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val: number[]) => setZoom(val[0])}
              className="py-2"
            />
          </div>

          {/* Rotation Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-wider">
                <RotateCcw size={14} />
                <span>Rotation</span>
              </div>
              <span className="text-xs font-black text-[#6B46C1] bg-purple-50 px-2 py-0.5 rounded-full">{rotation}°</span>
            </div>
            <Slider
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={(val: number[]) => setRotation(val[0])}
              className="py-2"
            />
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 font-bold border-gray-100 text-gray-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCrop}
            disabled={isProcessing}
            className="flex-1 bg-[#6B46C1] hover:bg-[#553C9A] rounded-2xl h-12 font-bold text-white transition-all active:scale-95"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
