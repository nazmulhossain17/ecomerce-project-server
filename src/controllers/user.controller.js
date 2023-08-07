
const testController = (req, res)=>{
    res.status(200).send({
        message: 'working fine'
    })
}


module.exports = {testController}