const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
let Room = require('../models/roomModel');
const writeFileAsync = promisify(fs.writeFile);

function generateUniqueFilename(originalName) {
  const timestamp = new Date().getTime();
  const extension = path.extname(originalName);
  const filename = `${timestamp}${extension}`;

  return filename;
}

const base64ToImage = async dataObject => {
  const { name, data } = dataObject;
  const folderPath = path.join(__dirname, 'uploads');
  const extension = path.extname(name).toLowerCase();
  const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = Buffer.from(base64Data, 'base64');
  const filename = generateUniqueFilename(name);
  const filePath = path.join(folderPath, filename);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
  }
  try {
    await writeFileAsync(filePath, binaryData); // Use await here to wait for the file writing to complete
    const fileObject = {
      mimetype: `image/${extension.slice(1)}`,
      filePath: filePath
    };
    return fileObject;
  } catch (err) {
    throw err;
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const images = [];
    req.files.forEach(element => {
      const { originalname, mimetype } = element;
      const filePath = path.join(
        __dirname,
        '..',
        'routes',
        'uploads',
        element.filename
      );
      const newImage = { name: originalname, mimetype, filePath };
      images.push(newImage);
      // fs.unlinkSync(filePath);
    });
    res.status(200).json({
      status: 'success',
      message: 'images uploaded',
      data: images
    });
  } catch (err) {
    res.status(404).json({
      status: 'err',
      message: 'Upload only 5 images'
    });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const query = Room.find(queryObj);
    const rooms = await query;
    rooms.forEach(ele => {
      if (ele?.host?.profile?.filePath) {
        const hostData = fs.readFileSync(ele.host.profile.filePath);
        const str = hostData.toString('base64');
        ele.host.profile.data = str;
      }
      ele.images.forEach(child => {
        if (child.filePath) {
          const data = fs.readFileSync(child.filePath);
          const base64String = data.toString('base64');
          child.data = base64String;
        }
      });
    });
    res.status(200).json({
      status: 'success',
      result: rooms.length,
      data: rooms
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'Not found',
      message: err
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room.host.profile.filePath) {
      const hostData = fs.readFileSync(room.host.profile.filePath);
      const str = hostData.toString('base64');
      room.host.profile.data = str;
    }
    room.images.forEach(ele => {
      if (ele.filePath) {
        const data = fs.readFileSync(ele.filePath);
        const base64String = data.toString('base64');
        ele.data = base64String;
      }
    });
    res.status(200).json({
      status: 'success',
      data: room
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not found',
      message: err
    });
  }
};

exports.getRoomBySearchParam = async (req, res) => {
  try {
    const { country, startDate, endDate, guestCapacity } = req.query;
    const query = {};
    if (country) {
      query['location.country'] = country;
    }
    if (startDate) {
      query['stayDate.startDate'] = { $lte: new Date(startDate) };
    }
    if (endDate) {
      query['stayDate.endDate'] = { $gte: new Date(endDate) };
    }
    if (guestCapacity > 0) {
      query.guestCapacity = { $gte: guestCapacity };
    }
    const data = await Room.find(query);
    res.status(200).json({
      status: 'success',
      result: data.length,
      data: data
    });
  } catch (err) {
    res.status(404).json({
      status: 'Not found',
      message: err
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const dataObj = await base64ToImage(req.body.host.profile);
    req.body.host.profile = { ...dataObj };
    const newRoom = await Room.create(req.body);
    res.status(200).json({
      status: 'success',
      message: 'You are now a host',
      data: {
        room: newRoom
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Unexpected err, try after some time',
      data: err
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    if (req.body.stayDate) {
      const { stayDate } = req.body;
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            'stayDate.startDate': stayDate.startDay,
            'stayDate.endDate': stayDate.endDay
          }
        },
        {
          new: true,
          runValidators: true
        }
      );
      res.status(200).json({
        status: 'success',
        message: 'Dates Updated',
        data: room
      });
    } else if (req.body.pricing) {
      const { pricing } = req.body;
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            'pricing.basePrice': pricing.basePrice,
            'pricing.cleaningFee': pricing.cleaningFee,
            'pricing.serviceFee': pricing.serviceFee
          }
        },
        {
          new: true,
          runValidators: true
        }
      );
      res.status(200).json({
        status: 'success',
        message: 'Prices Updated',
        data: room
      });
    } else {
      const { host } = req.body;
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            host: host
          }
        },
        {
          new: true,
          runValidators: true
        }
      );
      res.status(200).json({
        status: 'success',
        message: 'Profile Updated',
        data: room
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const temp = await Room.findById(req.params.id);
    fs.unlinkSync(temp.host.profile.filePath);
    temp.images.forEach(ele => {
      fs.unlinkSync(ele.filePath);
    });
    await Room.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      message: 'Deleted Successfully',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};