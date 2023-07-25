export interface Avatar {
   className?: string;
   children?: React.ReactNode;
}
export interface AvatarInterface
   extends Avatar,
      React.HTMLAttributes<HTMLDivElement> {}
export interface AvatarImageInterface
   extends Avatar,
      React.ImgHTMLAttributes<HTMLImageElement> {
   alt: string;
}
