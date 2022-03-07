import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

function Home() {

    const { data } = useQuery(FEED_QUERY);

    return (
        <div>
            <div>
                <PageTitle title="Home" />
                {data?.seeFeed?.map((photo) => (
                    <Photo key={photo.id} {...photo} />
                ))}
            </div>
        </div>
    )
}
export default Home;

const FEED_QUERY = gql`
    query seeFeed{
        seeFeed{
            ...PhotoFragment
            user{
                username
                avatar
            }
            caption
            createAt
            isMine
            comments{
                ...CommentFragment
            }
        }
    }
    ${PHOTO_FRAGMENT}
    ${COMMENT_FRAGMENT}
`;

