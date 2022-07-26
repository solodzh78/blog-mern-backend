export const fileLoader = (files: FileList, setAvatarSrc: React.Dispatch<string>) => {

    if (!FileReader) {
        alert('FileReader не поддерживается — облом');
        return;
    }

    if (!files?.length) {
        alert('Ничего не загружено');
        return;
    }

    if (files[0].type.indexOf('image') === -1) {
        alert('Файл не является изображением');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
        setAvatarSrc(fileReader.result as string);}
    fileReader.readAsDataURL(files[0]);
};