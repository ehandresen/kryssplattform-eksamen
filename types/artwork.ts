export type Artwork = {
  id: string;
  title: string;
  artistId?: string;
  imageUrl: string;
  caption?: string;
  description: string;
  createdDate?: string;
  category?: string;
  viewsCount?: number;
  likesCount?: number;
  comments: string[];
};
