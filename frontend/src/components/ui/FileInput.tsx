import { FC, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { fileLoader } from '../../utils/fileLoader';
import noAvatar from '../../assets/image/noavatar.svg';

export const FileInput: FC<{className: string, field: any}> = (props) => {
    const { field, className } = props;
    const [value, setValue] = useState('');
    const [avatarSrc, setAvatarSrc] = useState(noAvatar);

    return (
        <div className={className}>
            <label
                htmlFor='fileInput'
            >
            <Avatar 
                sx={{ width: 100, height: 100 }} 
                src={avatarSrc}
            />
            </label>
            <input
                value={field.value.length !== 0 ? value : ''}
                id='fileInput'
                type="file"
                hidden
                onChange={e => {
                    setValue(e.target.value);
                    const files = e.target.files;
                    field.onChange(files);
                    if (files !== null) fileLoader(files, setAvatarSrc);
                }}
            />
        </div>
    );
};
