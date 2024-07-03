const methodGet = (url, setValue, dispatch) => {
  fetch(url)
    .then((res) => res.json())
    .then((res) => dispatch(setValue(res)))
    .catch((err) => console.log(err.message.toString()));
};
const methodSendRequest = async (url, type, headers, data) => {
  return await fetch(url, {
    method: type,
    body: JSON.stringify(data),
    headers: headers,
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => err);
};
const methodSendRequestWithFormdate = async (url, type, headers, data) => {
  return await fetch(url, {
    method: type,
    body: data,
    // headers: headers,
  })
    .then((res) => res.json())
    .then((res) => res)
    .catch((err) => err);
};

export { methodGet, methodSendRequest, methodSendRequestWithFormdate };
