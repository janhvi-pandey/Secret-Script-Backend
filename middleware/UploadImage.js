const multer  = require('multer')
const upload = multer({ dest: '/tmp/uploads', limits: { fileSize: 5 * 1024 * 1024 }, });
module.exports = {upload};