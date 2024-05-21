import temporaryMatching from "../../repositories/temporaryMatching/index.js";

const getAllTemporaryMatching = async (req, res, next) => {
  try {
    const { gid } = req.params;
    const { search, skip, limit } = req.query;
    res.send(
      await temporaryMatching.getAllTemporaryMatching(gid, {
        search,
        skip: Number.parseInt(skip) || 0,
        limit: Number.parseInt(limit) || 10,
      })
    );
  } catch (error) {
    next(error);
  }
};
const addTemporaryMatchingByGid = async (req, res, next) => {
  try {
    const { gid } = req.params;
    res.send(await temporaryMatching.addTemporaryMatchingByGid(gid));
  } catch (error) {
    next(error);
  }
};

export default { getAllTemporaryMatching, addTemporaryMatchingByGid };
