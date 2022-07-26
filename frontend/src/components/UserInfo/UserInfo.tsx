import React, { FC } from 'react';
import Avatar from "@mui/material/Avatar";
import styles from './UserInfo.module.scss';
import noavatar from "../../assets/image/noavatar.svg";
import { BASE_URL } from '../../assets/constants';

type UserInfoPropsType = {
  avatarUrl: string;
  fullName: string;
  additionalText: string;
}

export const UserInfo: FC<UserInfoPropsType> = ({ avatarUrl, fullName, additionalText }) => {

  const date = new Date(additionalText).toLocaleString();
  return (
    <div className={styles.root}>
      <Avatar className={styles.avatar} src={`${BASE_URL}/${avatarUrl}`} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{`Опубликована: ${date}`}</span>
      </div>
    </div>
  );
};
