import { gql } from "@apollo/client";

export const PHOTO_FRAGMENT = gql`
    fragment PhotoFragment on Photo{
        id
        file
        likes
        isLiked
        commentNumber
    }
`;

export const COMMENT_FRAGMENT = gql`
    fragment CommentFragment on Comment{
        id
        user{
            username
            avatar
        }
        payload
        isMine
        createAt
    }
`;

export const FEED_PHOTO = gql`
  fragment FeedPhoto on Photo {
    ...PhotoFragment
    user {
      id
      username
      avatar
    }
    caption
    isMine
  }
  ${PHOTO_FRAGMENT}
`;

export const ROOM_FRAGMENT = gql`
  fragment RoomParts on Room {
    id
    unreadTotal
    users {
      avatar
      username
    }
  }
`;
