export function imageUrl(src: string, width?: number): string {
  if (!src) return "";
  if (!src.includes("res.cloudinary.com")) return src;

  const searchStr = "/upload/";
  const index = src.indexOf(searchStr);
  if (index === -1) return src;

  const insertIndex = index + searchStr.length;
  const transform = width 
    ? `f_auto,q_auto,w_${width},c_limit/` 
    : "f_auto,q_auto/";
  
  return src.slice(0, insertIndex) + transform + src.slice(insertIndex);
}

export function videoUrl(src: string): string {
  if (!src) return "";
  if (!src.includes("res.cloudinary.com")) return src;

  const searchStr = "/upload/";
  const index = src.indexOf(searchStr);
  if (index === -1) return src;

  const insertIndex = index + searchStr.length;
  return src.slice(0, insertIndex) + "f_auto,q_auto/" + src.slice(insertIndex);
}

export function videoPoster(src: string): string {
  if (!src) return "";
  if (!src.includes("res.cloudinary.com")) return "";

  const base = src.substring(0, src.lastIndexOf(".")) || src;
  
  const searchStr = "/upload/";
  const index = base.indexOf(searchStr);
  if (index === -1) return `${base}.jpg`;

  const insertIndex = index + searchStr.length;
  return base.slice(0, insertIndex) + "f_auto,q_auto,so_0/" + base.slice(insertIndex) + ".jpg";
}
