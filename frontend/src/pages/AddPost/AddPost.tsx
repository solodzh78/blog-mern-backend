import React, { ChangeEventHandler, FC, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import axios from "../../axios";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { useAppSelector } from '../../store/store';
import { selectIsAuth } from '../../store/slices/auth';
import { PostType } from '../../store/slices/posts';


export const AddPost: FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');

    const inputFileRef = useRef(null as HTMLInputElement | null);

    useEffect(() => {
        if (id) {
        axios.get<PostType>(`/posts/${id}`)
            .then(({data}) => {
                setImageUrl(data.imageUrl);
                setText(data.text ? data.text : '');
                setTitle(data.title);
                setTags(data.tags.join(', '));
            })
            .catch(err => console.log(err));
        }
    
    }, []);

    const handleChangeFile: ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            const files = event.target.files;
            const formdata = new FormData();
            if (files?.[0]) formdata.append('image', files[0]);
            const { data } = await axios.post('/upload', formdata);
            setImageUrl(data.url);
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit: MouseEventHandler = async () => {
        try {
            const article = { 
                title, 
                tags: tags.split(',').map(item => item.trim()), 
                imageUrl, 
                text }
            if (id) {
                const { data } = await axios.patch(`/posts/${id}`, article);
                navigate(`/posts/${id}`);
            } else {
                const { data } = await axios.post('/posts', article);
                navigate(`/posts/${data._id}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    const onChangeValue = useCallback((value: string) => {
        setText(value);
    }, []);
    const onChangeTitle: ChangeEventHandler<HTMLTextAreaElement> = useCallback((event) => {
        setTitle(event.target.value);
    }, []);
    const onChangeTags: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        setTags(event.target.value);
    }, []);
    const onClickLoadButton: MouseEventHandler = useCallback(() => {
        const input = inputFileRef.current;
        if (input) input.click();
    }, []);

    const options = React.useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
                uniqueId: ''
            },
        }),
        [],
    );

    const isAuth = useAppSelector(selectIsAuth);
    if (!isAuth && !localStorage.getItem('token')) return <Navigate to={'/'} />;

    return (
        <Paper style={{ padding: 30 }}>
            <Button 
                variant="outlined" 
                size="large"
                onClick={onClickLoadButton}
            >
                Загрузить превью
            </Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
            {imageUrl && (<>
                <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                    Удалить
                </Button>
                <img className={styles.image} src={`http://localhost:4444/${imageUrl}`} alt="Uploaded" />
            </>)}
            <br />
            <br />
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
                onChange={onChangeTitle}
                value={title}
            />
            <TextField 
                classes={{ root: styles.tags }} 
                variant="standard" 
                placeholder="Тэги" 
                onChange={onChangeTags}
                value={tags}
                fullWidth 
            />
            <SimpleMDE className={styles.editor} value={text} onChange={onChangeValue} options={options} />
            <div className={styles.buttons}>
                <Button 
                    size="large" 
                    variant="contained"
                    onClick={onSubmit}
                >
                    {id ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <Link to="/">
                    <Button size="large">Отмена</Button>
                </Link>
            </div>
        </Paper>
    );
};
