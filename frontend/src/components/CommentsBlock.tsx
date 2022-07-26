import React, { FC, PropsWithChildren } from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { CommentType } from "../store/slices/posts";
import { BASE_URL } from "../assets/constants";
import { Link } from "react-router-dom";

interface CommentsBlockPropsType extends PropsWithChildren {
    items: CommentType[];
    isLoading: Boolean;
    onClickCommentHandler: (_id: string) => void;
};

export const CommentsBlock: FC<CommentsBlockPropsType> = ({ items, children, isLoading, onClickCommentHandler }) => {

    return (
        <SideBlock title="Комментарии">
            <List>
                {isLoading 
                    ? [...Array(5)].map((obj, index) => (
                        <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <Skeleton variant="circular" width={40} height={40} />
                                </ListItemAvatar>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Skeleton variant="text" height={25} width={120} />
                                    <Skeleton variant="text" height={18} width={230} />
                                </div>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    ))
                    : items.map(({ commentText, post, user: { fullName, avatarUrl }}, index) => {

                        return (
                        <React.Fragment key={index}>
                            <Link to={`/posts/${post}`} style={{textDecoration: 'none'}}>
                                <ListItem alignItems="flex-start" onClick={onClickCommentHandler.bind(null, post)}>
                                    <ListItemAvatar>
                                        <Avatar alt={fullName} src={`${BASE_URL}/${avatarUrl}`} />
                                    </ListItemAvatar>
                                        <ListItemText
                                            primary={fullName}
                                            secondary={commentText}
                                        />
                                </ListItem>
                            </Link>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    )})
                }
            </List>
            {children}
        </SideBlock>
    );
};
