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

export const updateUserItem = (email, obj) => {
  const Key = { email,  ...obj};
  return {
      TableName: 'emailLeads',
      Key,

  };
};

export const baseLead = {
  TableName: "emailLeads",
  IndexName: "EmailLeadTableIndex",
  ScanIndexForward: false,
};

export const getLeadWithStatus = (status, limit, attr=[]) => {
  let obj = {
    ExpressionAttributeValues: {
      ":v_status": status,
    },
    ExpressionAttributeNames:{
    "#st": "status",
    }
  };

  if (limit) {
    obj.Limit = limit;
  }

  if (attr.length) {
    attr.forEach(item => {
      obj.FilterExpression = `#${item.field} = :${item.field}`;
      obj.ExpressionAttributeValues[`:${item.field}`] = item.value;
      obj.ExpressionAttributeNames[`#${item.field}`] = item.field;
    });
  }

  return {
    ... baseLead,
    ...obj,
    KeyConditionExpression: "#st = :v_status",
  };
};

export const updateItem = (emailLeadId, attr=[], table="emailLeads") => {
  const obj = {
    ExpressionAttributeValues: {
    },
    ExpressionAttributeNames:{
    },
    UpdateExpression: 'set '
  };

  attr.forEach(item => {
    obj.UpdateExpression += `#${item.field} = :${item.field},`;
    obj.ExpressionAttributeValues[`:${item.field}`] = item.value;
    obj.ExpressionAttributeNames[`#${item.field}`] = item.field;
  });
  obj.UpdateExpression = obj.UpdateExpression.slice(0, -1);
  return {
    TableName: table,
    Key: {
      emailLeadId
    },
    ...obj,
  };
};
