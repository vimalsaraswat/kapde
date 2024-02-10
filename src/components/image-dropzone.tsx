"use client";

import Dropzone from "./ui/dropzone";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { cn, formatFileSize } from "@/lib/utils";
import React, { useState } from "react";

const imageMimeTypes = [
  "image/webp",
  "image/tiff",
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/vnd.microsoft.icon",
  "image/gif",
  "image/bmp",
];
const allowedTypes = [
  {
    name: "image",
    types: imageMimeTypes,
  },
];

export type image = File;

interface ImageDropzoneProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  className?: string;
  maxFiles?: number;
  maxSize?: number;
  handleImages: (acceptedFiles: image[]) => void;
}

const ImageDropzone = React.forwardRef<HTMLDivElement, ImageDropzoneProps>(
  (
    {
      className,
      maxFiles = 5,
      maxSize = 1024 * 1024 * 1,
      handleImages,
      ...props
    },
    ref,
  ) => {
    const [images, setFiles] = useState<image[]>([]);
    const [dropzoneDisabled, setDropzoneDisabled] = useState<boolean>(false);

    function updateImages(images: image[]) {
      setFiles(images);
      handleImages && handleImages(images);
      if (images.length < maxFiles && dropzoneDisabled) {
        setDropzoneDisabled(false);
      } else if (!(images.length < maxFiles && !dropzoneDisabled)) {
        setDropzoneDisabled(true);
      }
    }

    function handleOnDrop(acceptedFiles: FileList | null) {
      if (!(acceptedFiles && acceptedFiles.length > 0)) {
        return;
      }

      const validFiles: image[] = [];
      for (const file of acceptedFiles) {
        if (!(images.length + validFiles.length < maxFiles)) {
          break;
        }
        const fileType = allowedTypes.find((allowedType) =>
          allowedType.types.find((type) => type === file.type),
        );

        if (!fileType) {
          continue;
        }
        if (file.size > maxSize) {
          continue;
        }

        validFiles.push(file);

        if (validFiles.length > 0) {
          updateImages([...validFiles, ...images]);
        }
      }
    }

    return (
      <div
        className={cn(
          "4xl:grid-cols-[repeat(4,1fr)] grid h-full w-full grid-cols-[repeat(2,1fr)] gap-2 2xl:grid-cols-[repeat(3,1fr)]",
          className,
        )}
      >
        <Dropzone
          {...props}
          classNameWrapper={cn("aspect-square", dropzoneDisabled && "hidden")}
          disabled={dropzoneDisabled}
          multiple
          dropMessage="Drop images or click here"
          handleOnDrop={handleOnDrop}
          ref={ref}
        />

        {images.map((file, i) => {
          return (
            <div
              key={i}
              className="relative aspect-square h-full w-full rounded-md border border-input bg-transparent p-0 shadow-md"
            >
              <img
                className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                src={
                  typeof file === "string" ? file : URL.createObjectURL(file)
                }
                alt={typeof file === "string" ? file : file.name}
              />

              <Button
                variant="secondary"
                size="icon"
                type="button"
                className="absolute right-0 top-0 -translate-x-1/4 translate-y-1/4 transform opacity-60"
                onClick={() => {
                  updateImages(images.filter((_, index) => index !== i));
                }}
              >
                <Cross1Icon />
              </Button>

              {typeof file !== "string" && (
                <div
                  key={file.name}
                  className="absolute bottom-0 w-full rounded-sm bg-gradient-to-b from-card/60 to-card/90 px-2 py-0.5"
                >
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <span className="text-sm font-medium leading-3">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  },
);

ImageDropzone.displayName = "Image Dropzone";

export default ImageDropzone;
