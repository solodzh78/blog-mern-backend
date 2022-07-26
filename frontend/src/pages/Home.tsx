import React, { useCallback, useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { Box, Button, ButtonGroup } from '@mui/material';
import TagIcon from "@mui/icons-material/Tag";

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchComments, fetchPosts, fetchTags, StatusEnum } from '../store/slices/posts';
import { PostSkeleton } from '../components/Post/Skeleton';

export const Home = () => {
    const dispatch = useAppDispatch();
    const { posts, tags, comments } = useAppSelector((state) => state.posts);
    const authUserId = useAppSelector((state) => state.auth.data?._id);
    const isPostLoading = posts.status === StatusEnum.LOADING;
    const isTagsLoading = tags.status === StatusEnum.LOADING;
    const isCommentsLoading = tags.status === StatusEnum.LOADING;

    const [activeTab, setActiveTab] = useState(0);
    const [checkedTags, setCheckedTags] = useState([] as string[]);


    useEffect(() => {

        const tagsString = checkedTags.reduce((akk, tag) => {
            return `${akk}${akk==='' ? '' : '&'}tags=${tag}`;
        }, '');
        const sortString = activeTab===1 ? `sort=-viewsCount` : '';
        const fetchString = (!tagsString && !sortString) 
            ? '' 
            : `?${tagsString}${tagsString==='' ? '' : '&'}${sortString}`;

        dispatch(fetchPosts(fetchString));
        dispatch(fetchTags(fetchString));
        dispatch(fetchComments(fetchString));
    }, [activeTab, checkedTags]);
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const onClickTagButtonHandler = useCallback((tag: string) => {
        setCheckedTags(prev => {
            const tempArr = [...prev];
                if (prev.includes(tag)) {
                    return tempArr.filter(item => item!==tag)
                }
            tempArr.push(tag);
            return tempArr;
        });
    }, []);

    const onClickCommentHandler = (id: string) => {};
    
    return (
        <>
            {checkedTags.length > 0 && <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    '& > *': { m: 1 },
                }}
            >
                <ButtonGroup variant="text" size="small" aria-label="small text button group">
                    {checkedTags.map(tag => <Button onClick={onClickTagButtonHandler.bind(null, tag)}><TagIcon/>{tag}</Button>)}
                </ButtonGroup>
            </Box>}
            <Tabs style={{ marginBottom: 15 }} value={activeTab} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {(isPostLoading 
                        ? [...Array(5)].map((_, index) => <PostSkeleton key={index} />) 
                        : posts.items.map(post => {

                            return <Post
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
                            />}
                        )
                    )}
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} onClickTagButtonHandler={onClickTagButtonHandler}/>
                    <CommentsBlock items={comments.items} isLoading={isCommentsLoading} onClickCommentHandler={onClickCommentHandler}/>
                </Grid>
            </Grid>
        </>
    );
};
