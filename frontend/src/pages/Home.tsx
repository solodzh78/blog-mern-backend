import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchPosts, fetchTags, StatusEnum } from '../store/slices/posts';
import { PostSkeleton } from '../components/Post/Skeleton';

export const Home = () => {
    const dispatch = useAppDispatch();
    const { posts, tags } = useAppSelector((state) => state.posts);
    const isPostLoading = posts.status === StatusEnum.LOADING;
    const isTagsLoading = tags.status === StatusEnum.LOADING;

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
    }, []);

    return (
        <>
            <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostLoading 
                        ? [...Array(5)].map((_, index) => <PostSkeleton key={index} />) 
                        : posts.items.map(post => 
                            <Post
                                key={post._id}
                                _id={post._id}
                                title={post.title}
                                imageUrl={post.imageUrl}
                                user={post.user}
                                createdAt={post.createdAt}
                                viewsCount={post.viewsCount}
                                commentsCount={post.commentsCount}
                                tags={post.tags}
                                isEditable
                            />
                        )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={[
                            {
                                user: {
                                    fullName: 'Вася Пупкин',
                                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Иван Иванов',
                                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
