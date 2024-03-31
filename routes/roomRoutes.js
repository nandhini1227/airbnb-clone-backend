const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const roomController = require('../controllers/roomController');
const auth = require('../middleware/authMiddleWare');

const router = express.Router();
const uploadPath = path.join(__dirname, '..', 'uploads'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadPath, { recursive: true }); 
    cb(null, uploadPath); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`); 
  }
});

const upload = multer({ storage });

router.get('/', roomController.getAllRooms);
router.post('/', auth.protect, roomController.createRoom);

router.get('/search', roomController.getRoomBySearchParam);

router.post('/upload', upload.array('images', 5), roomController.uploadImage);

router.get('/:id', auth.protect, roomController.getRoom);
router.patch('/:id', auth.protect, roomController.updateRoom);
router.delete('/:id', auth.protect, roomController.deleteRoom);

module.exports = router;
