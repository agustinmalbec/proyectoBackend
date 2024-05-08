import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let path = '';
        /* if (file.fieldname === 'profile') {
            path = 'public/files/profiles';
        }
        if (file.fieldname === 'products') {
            path = 'public/files/products';
        }
        if (file.fieldname === 'documents') {
            path = 'public/files/documents';
        } */
        switch (file.fieldname) {
            case 'profile':
                path = 'public/files/profiles';
                break;
            case 'products':
                path = 'public/files/products';
                break;
            case 'documents':
                path = 'public/files/documents';
                break;
        }
        cb(null, path);
    },
    filename: (req, file, cb) => {
        let name = file.originalname.split('.');
        cb(null, name[0]);
    }
});

export const upload = multer({ storage: storage }).any();
