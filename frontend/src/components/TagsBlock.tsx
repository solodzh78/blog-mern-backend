import React, { FC, useState } from "react";
import { Link } from 'react-router-dom';

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";

type TagsBlockPropsType = {
    items: string[];
    isLoading: boolean;
    onClickTagButtonHandler: (tag: string) => void;
}

export const TagsBlock: FC<TagsBlockPropsType> = ({ items, isLoading = true, onClickTagButtonHandler }) => {

    return (
        <SideBlock title="Тэги">
            <List>
                {(isLoading ? [...Array(5)] : items).map((name, i) => {
                    return (
                        <ListItem key={i} disablePadding>
                            <ListItemButton onClick={onClickTagButtonHandler.bind(null, name)}>
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                {isLoading ? (
                                    <Skeleton width={100} />
                                ) : (
                                    <ListItemText primary={name} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    )
                })}
            </List>
        </SideBlock>
    );
};
