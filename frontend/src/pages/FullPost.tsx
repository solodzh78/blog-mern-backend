import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Post } from "../components/Post";
import { AddComment } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { PostType } from "../store/slices/posts";
import { PostSkeleton } from "../components/Post/Skeleton";
import ReactMarkdown from "react-markdown";
import { useAppSelector } from "../store/store";
import { selectIsAuth } from "../store/slices/auth";

export const FullPost: FC = () => {
    const [ post, setPost ] = useState({} as PostType);
    const [ isLoading, setIsLoading ] = useState(true);
    const { id } = useParams();
    const authUserId = useAppSelector((state) => state.auth.data?._id);
    const isAuth = useAppSelector(selectIsAuth);


    useEffect(() => {
        setIsLoading(true);
        axios.get<PostType>(`posts/${id}`)
            .then(res => {
                setPost(res.data);
                setIsLoading(false);
            });
    }, []);

    return (
        <>
            {isLoading
                ? <PostSkeleton />
                : <Post
                    key={post._id}
                    _id={post._id}
                    title={post.title}
                    imageUrl={post.imageUrl ? post.imageUrl : ''}
                    user={post.user}
                    createdAt={post.createdAt}
                    viewsCount={post.viewsCount}
                    commentsCount={post.comments.length}
                    tags={post.tags}
                    isEditable={authUserId ? (authUserId===post.user._id) : false}
                    isFullPost
                >
                    <ReactMarkdown children={post.text ? post.text : ''}/>
                </Post>
            }
            <CommentsBlock
                items={post.comments}
                isLoading={isLoading}
                onClickCommentHandler={() => {}}
            >
                {isAuth && <AddComment id={post._id} setPost={setPost}/>}
            </CommentsBlock>
        </>
    );
};

// [
//     {
//         user: {
//             fullName: "Вася Пупкин",
//             avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
//         },
//         text: "Это тестовый комментарий",
//     },
//     {
//         user: {
//             fullName: "Иван Иванов",
//             avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
//         },
//         text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
//     },
// ]