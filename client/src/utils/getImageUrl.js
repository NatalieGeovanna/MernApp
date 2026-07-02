const API_URL =
  process.env.REACT_APP_API_URL || "${process.env.REACT_APP_API_URL}";

export const getImageUrl = (image) => {
  if (!image) return "";

  return image.startsWith("http") ? image : `${API_URL}/assets/${image}`;
};
