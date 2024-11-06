// this data is what frontend sees
// wat goes into backend looks like this
export type CommentObject = {
  id: string;
  comment: Comment;
};

// this data is saved in backend
// wat comes out of backend looks like this
export type Comment = {
  artistId: string;
  artistName: string;
  comment: string;
};
