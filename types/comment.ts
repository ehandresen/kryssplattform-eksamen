// this data is what frontend sees
// what goes into backend looks like this
export type CommentObject = {
  id: string;
  comment: Comment;
};

// this data is saved in backend
// what comes out of backend looks like this
export type Comment = {
  artistId: string;
  artistName: string;
  comment: string;
};
