const Trello = require("../models/Trello");

/**************          GET       ***************/

const getAllTrellos = (req, res) => {
  Trello.find()
    .then((record) => {
      res.status(200).json(record);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).end();
    });
};

const getAllBoards = (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }
  Trello.findById(userId)
    .then((record) => {
      //   console.log("recordinboards", record);
      if (record === null) {
        res.status(404).json({ error_message: "user not found" });
        return;
      }
      res.status(200).json(record);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json(error);
    });
};

const getOneBoard = (req, res) => {
  const userId = req.params.userId;
  const boardId = req.params.boardId;
  if (!userId || !boardId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }
  Trello.findById(userId)
    .then((record) => {
      let board = record.boards.id(boardId);
      res.status(200).json(board);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).end();
    });
};

const getOneList = (req, res) => {
  const userId = req.params.userId;
  const boardId = req.params.boardId;
  const listId = req.params.listId;

  if (!userId || !boardId || !listId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId)
    .then((record) => {
      let list = record.boards.id(boardId).lists.id(listId);
      res.status(200).json(list);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).end();
    });
};

const getOneCard = (req, res) => {
  const userId = req.params.userId;
  const boardId = req.params.boardId;
  const listId = req.params.listId;
  const cardId = req.params.cardId;
  // console.log("ids", userId, boardId, listId, cardId)
  if (!userId || !boardId || !listId || !cardId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId)
    .then((record) => {
      let card = record.boards.id(boardId).lists.id(listId).cards.id(cardId);
      res.status(200).json(card);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).end();
    });
};

/**************          POST       ***************/

const createOneBoard = (req, res) => {
  let userId = req.params.userId;
  let boardTitle = req.body.title;
  if (!userId) {
    res.status(400).json({ error_message: "invalid userId" });
    return;
  }
  if (!boardTitle) {
    res.status(400).json({ error_message: "invalid board title" });
    return;
  }

  const board = {
    title: boardTitle,
    lists: [],
  };

  Trello.findById(userId).then((record) => {
    record.boards.push(board);
    record
      .save()
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

const createOneList = (req, res) => {
  console.log("params: ", req.params);
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  let listTitle = req.body.title;

  if (!userId || !boardId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  if (!listTitle) {
    res.status(400).json({ error_message: "invalid list title" });
    return;
  }

  const list = {
    title: listTitle,
    cards: [],
  };

  Trello.findById(userId).then((record) => {
    record.boards.id(boardId).lists.push(list);
    record
      .save()
      .then((data) => {
        let board = data.boards.id(boardId);
        res.status(201).json(board);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

const createOneCard = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  let listId = req.params.listId;
  let cardTitle = req.body.title;
  let cardDesc = req.body.desc;

  if (!userId || !boardId || !listId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }
  if (!cardTitle) {
    res.status(400).json({ error_message: "invalid card title" });
    return;
  }

  const card = {
    title: cardTitle,
    desc: cardDesc,
    created: +new Date(),
  };

  Trello.findById(userId).then((record) => {
    record.boards.id(boardId).lists.id(listId).cards.push(card);
    record
      .save()
      .then((data) => {
        let lists = data.boards.id(boardId).lists;
        res.status(201).json(lists);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

/**************          PATCH       **************/
const editBoardTitle = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;

  console.log(userId, "boardID", boardId);
  if (!userId || !boardId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId).then((record) => {
    let board = record.boards.id(boardId);
    for (let property in req.body) {
      // assign the proerty to the same property that exists in req.body
      board[property] = req.body[property];
    }
    record
      .save()
      .then((data) => {
        //   console.log("Patch!!", data);
        let board = data.boards.id(boardId);
        res.status(200).json(board);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

const editListTitle = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  let listId = req.params.listId;
  console.log(userId, boardId, listId);
  if (!userId || !boardId || !listId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId).then((record) => {
    let list = record.boards.id(boardId).lists.id(listId);
    for (let property in req.body) {
      // assign the proerty to the same property that exists in req.body
      list[property] = req.body[property];
    }
    record
      .save()
      .then((data) => {
        //   console.log("Patch!!", data);
        let lists = data.boards.id(boardId).lists;
        res.status(200).json(lists);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

const moveOneCard = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  let oldListId = req.query.oldlistId;
  let newListId = req.query.newlistId;
  let cardId = req.query.cardId;

  if (!userId || !boardId || !oldListId || !newListId) {
    res.status(400).json({ error_message: "invalid url params or queries" });
    return;
  }

  Trello.findById(userId).then((record) => {
    let oldlist = record.boards.id(boardId).lists.id(oldListId);
    let newlist = record.boards.id(boardId).lists.id(newListId);

    let cardIndex = oldlist.cards.findIndex((card) => {
      return card["_id"].toString() === cardId;
    });
    if (cardIndex === -1) {
      return res.status(404).end();
    }

    oldlist.cards.splice(cardIndex, 1);
    let movedcard = {
      ...req.body,
    };

    newlist.cards.push(movedcard);

    record
      .save()
      .then((data) => {
        console.log("Patch lists!!", data);
        let lists = data.boards.id(boardId).lists;
        res.status(200).json(lists);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

/**************          PUT        **************/
const editOneCard = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  let listId = req.params.listId;
  let cardId = req.params.cardId;
  if (!userId || !boardId || !listId || !cardId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId).then((record) => {
    let cards = record.boards.id(boardId).lists.id(listId).cards;
    let cardIndex = cards.findIndex((card) => {
      return card["_id"].toString() === cardId;
    });
    if (cardIndex === -1) {
      return res.status(404).end();
    }
    let editedCard = {
      ...cards[cardIndex],
      ...req.body,
    };

    cards[cardIndex] = editedCard;
    record
      .save()
      .then((data) => {
        //   console.log("Patch!!", data);
        let lists = data.boards.id(boardId).lists;
        res.status(200).json(lists);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

/**************         DELETE      **************/
const deleteOneBoard = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  // console.log("ids", userId, boardId, listId, cardId)
  if (!userId || !boardId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId).then((record) => {
    let boards = record.boards;
    console.log("boards", boards);
    let boardIndex = boards.findIndex((board) => {
      console.log(boardId);
      return board["_id"].toString() === boardId;
    });
    console.log("boardIndex", boardIndex);

    if (boardIndex === -1) {
      res.status(404).end();
      return;
    }

    boards.splice(boardIndex, 1);

    record
      .save()
      .then((data) => {
        console.log("after delete board", data);
        res.status(204).end();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

const deleteOneList = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  let listId = req.params.listId;
  // console.log("ids", userId, boardId, listId, cardId)
  if (!userId || !boardId || !listId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId).then((record) => {
    let lists = record.boards.id(boardId).lists;
    let listIndex = lists.findIndex((list) => {
      return list["_id"].toString() === listId;
    });
    console.log("listIndex", listIndex);

    if (listIndex === -1) {
      res.status(404).end();
      return;
    }

    lists.splice(listIndex, 1);

    record
      .save()
      .then((data) => {
        console.log("after delete list", data);
        res.status(204).end();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

const deleteOneCard = (req, res) => {
  let userId = req.params.userId;
  let boardId = req.params.boardId;
  let listId = req.params.listId;
  let cardId = req.params.cardId;
  // console.log("ids", userId, boardId, listId, cardId)
  if (!userId || !boardId || !listId || !cardId) {
    res.status(400).json({ error_message: "invalid url params" });
    return;
  }

  Trello.findById(userId).then((record) => {
    let cards = record.boards.id(boardId).lists.id(listId).cards;
    let cardIndex = cards.findIndex((card) => {
      return card["_id"].toString() === cardId;
    });
    console.log("cardIndex", cardIndex);

    if (cardIndex === -1) {
      res.status(404).end();
      return;
    }

    cards.splice(cardIndex, 1);

    record
      .save()
      .then((data) => {
        res.status(204).end();
      })
      .catch((error) => {
        console.error(error);
        res.status(500).end();

      });
  });
};

module.exports = {
  getAllTrellos,
  getAllBoards,
  getOneBoard,
  getOneList,
  getOneCard,
  createOneBoard,
  createOneList,
  createOneCard,
  editBoardTitle,
  editListTitle,
  moveOneCard,
  editOneCard,
  deleteOneBoard,
  deleteOneList,
  deleteOneCard,
};
