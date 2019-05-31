// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateMarket = `subscription OnCreateMarket {
  onCreateMarket {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
        owner
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;
export const onUpdateMarket = `subscription OnUpdateMarket {
  onUpdateMarket {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
        owner
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;
export const onDeleteMarket = `subscription OnDeleteMarket {
  onDeleteMarket {
    id
    name
    products {
      items {
        id
        description
        price
        shipped
        owner
        createdAt
      }
      nextToken
    }
    tags
    owner
    createdAt
  }
}
`;
export const onCreateProduct = `subscription OnCreateProduct {
  onCreateProduct {
    id
    description
    market {
      id
      name
      products {
        nextToken
      }
      tags
      owner
      createdAt
    }
    file {
      bucket
      region
      key
    }
    price
    shipped
    owner
    createdAt
  }
}
`;
export const onUpdateProduct = `subscription OnUpdateProduct {
  onUpdateProduct {
    id
    description
    market {
      id
      name
      products {
        nextToken
      }
      tags
      owner
      createdAt
    }
    file {
      bucket
      region
      key
    }
    price
    shipped
    owner
    createdAt
  }
}
`;
export const onDeleteProduct = `subscription OnDeleteProduct {
  onDeleteProduct {
    id
    description
    market {
      id
      name
      products {
        nextToken
      }
      tags
      owner
      createdAt
    }
    file {
      bucket
      region
      key
    }
    price
    shipped
    owner
    createdAt
  }
}
`;
