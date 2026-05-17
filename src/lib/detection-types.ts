export type DetectionInput = {
  fileName?: string;
  fileType?: string;
  previewDataUrl?: string | null;
};

export const uploadStorageKey = "echoes-upload";

export type StoredUpload = DetectionInput & {
  createdAt: string;
};
