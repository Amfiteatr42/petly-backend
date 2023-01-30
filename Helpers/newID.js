async function getNewID(Model) {
    const data = await Model.find();
    const lastItem = data.length;
    return lastItem === 0 ? 1 : data[lastItem-1]._id + 1;
}

module.exports = {
    getNewID,
}