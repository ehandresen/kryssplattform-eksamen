import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import ArtworkCard from '@/components/ArtworkCard';
import * as artworkApi from '@/api/artworkApi';
import * as commentApi from '@/api/commentApi';
import { Artwork } from '@/types/artwork';
import { useAuth } from '@/hooks/useAuth';
import { CommentObject } from '@/types/comment';

const ArtworkDetails = () => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isLoadingAddComment, setIsLoadingAddComment] = useState(false);
  const [comments, setComments] = useState<CommentObject[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  const { session } = useAuth();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    fetchArtworkFromFirebase();
  }, []);

  const fetchArtworkFromFirebase = async () => {
    try {
      const artworkObj = await artworkApi.getArtworkById(id as string);

      if (artworkObj) {
        setArtwork(artworkObj);
        fetchCommentsFromFirebase(artworkObj.comments);
      }
    } catch (error) {
      console.log('failed to fetch post');
    }
  };

  const fetchCommentsFromFirebase = async (commentsIds: string[]) => {
    const comments = await commentApi.getCommentsByIds(commentsIds);

    if (comments) {
      setComments(comments);
    }
    setIsLoadingComments(false);
  };

  const handleAddComment = async () => {
    if (artwork && commentText !== '') {
      setIsLoadingAddComment(true);
      // todo add context for artist data?
      await commentApi.addComment(artwork.id, {
        artistId: 'artistId',
        artistName: session as string,
        comment: commentText,
      });

      setIsLoadingAddComment(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {artwork && (
          <ArtworkCard
            title={artwork.title}
            artist={artwork.artistId || ''}
            imageUrl={artwork.imageUrl}
            caption={artwork.caption || ''}
            viewsCount={artwork.viewsCount || 0}
            likesCount={artwork.likesCount || 0}
          />
        )}
        <View style={{ marginTop: 16, width: '100%' }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>Comments</Text>
          <View>
            {isLoadingComments ? (
              <ActivityIndicator />
            ) : (
              comments.map((comment) => (
                <View
                  key={comment.id}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',
                  }}
                >
                  <Text style={{ fontWeight: 'bold', marginRight: 8 }}>
                    {comment.comment.artistName}
                  </Text>
                  <Text style={{ flex: 1 }}>{comment.comment.comment}</Text>
                </View>
              ))
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a comment..."
              placeholderTextColor="gray"
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderColor: 'gray',
                padding: 8,
                marginRight: 8,
              }}
            />
            {/* // todo extract button for reusability? */}
            <Pressable
              onPress={handleAddComment}
              // disable button to prevent duplicate comments
              disabled={isLoadingAddComment}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: '#007AFF',
                borderRadius: 4,
              }}
            >
              {isLoadingAddComment ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ArtworkDetails;
