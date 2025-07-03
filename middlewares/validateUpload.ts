export function validateUpload(req, res, next) {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'File is required',
            code: 'FILE_REQUIRED',
        });
    }
    next();
}