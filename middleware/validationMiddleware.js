const validation = (Schema) => async (req, res, next) => {
    const body = req.body;
    try {
        await Schema.validate(body);
        next();
        return next();
    } catch (error) {
       return res.status(400).json({
        message: error.message
       });
    }
};

module.exports = { validation };