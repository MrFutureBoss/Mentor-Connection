const getParams = (location, url) => {
  const value = url.split("/");
  if (Array.isArray(location)) return location.map((l, i) => ({ ["prm" + i]: value[l] }));
  return value[location];
};
export default getParams;
