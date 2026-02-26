const multer=require('multer')
const fs=require('fs')
const path=require('path')

const uploadDir='uploads/'

const storage=multer.diskStorage({
    destination: (req, file, cb)=>{
        //console.log(file);
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir)
        }
        cb(null, uploadDir)
    },
    filename:(req, file, cb)=>{
        const now=new Date().toISOString().split('T')[0]
        cb(null, `${now}-${file.originalname}`)
    }
})

const upload=multer({
    storage:storage,
    limits:{fileSize: 1024*1024*10},
    fileFilter: (req, file, cb)=>{
        const filetypes=/jpg|jpeg|png|gif|svg|webp|avif|bmp|tiff /
        const extname=filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype=filetypes.test(file.mimetype)

        if(extname && mimetype){
            return cb(null,true)
        }else{
            cb(new Error('Csak képformátumok megengedettek!'))
        }
    }
})
module.exports=upload