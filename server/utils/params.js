
export const getUserParams = (email, obj={}) => {
    const Key = { email,  ...obj};
    return {
        TableName: 'users',
        Key,
    };
};

export const getUserItems = (email, obj={}) => {
  const Item = { email,  ...obj};
  return {
      TableName: 'users',
      Item,
  };
};