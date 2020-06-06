const express = require("express");
const router = express.Router();
const routeMethod = require("./routeMethod");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// get all trellos
router.get("/trellos", routeMethod.getAllTrellos);

router.get(
  "/trello", forwardAuthenticated, (req, res) => {
  res.status(200).send("welcome");
});

// get all boards
router.get(
  "/trello/:userId/boards",
  ensureAuthenticated,
  routeMethod.getAllBoards
);

// get a board
router.get(
  "/trello/:userId/boards/:boardId", 
  routeMethod.getOneBoard
  );

// get a list
router.get(
  "/trello/:userId/boards/:boardId/lists/:listId",
  routeMethod.getOneList
);

// get a card
router.get(
  "/trello/:userId/boards/:boardId/lists/:listId/cards/:cardId",
  routeMethod.getOneCard
);

// post a board by userId (create a board)
router.post(
  "/trello/:userId/boards", 
  routeMethod.createOneBoard
  );

// post a list (create a list)
router.post(
  "/trello/:userId/boards/:boardId/lists", 
  routeMethod.createOneList
  );

// post a card (create a card)
router.post(
  "/trello/:userId/boards/:boardId/lists/:listId",
  routeMethod.createOneCard
);

// patch a board (edit a board title)
router.patch(
  "/trello/:userId/boards/:boardId/editTitle",
  routeMethod.editBoardTitle
);

// patch a list (edit a list title)
router.patch(
  "/trello/:userId/boards/:boardId/lists/:listId/editTitle",
  routeMethod.editListTitle
);

// patch a board (when move card from a list to another)
router.patch(
  "/trello/:userId/boards/:boardId", 
  routeMethod.moveOneCard
  );

// put a card (edit a card)
router.put(
  "/trello/:userId/boards/:boardId/lists/:listId/cards/:cardId",
  routeMethod.editOneCard
);

// delete a board
router.delete(
  "/trello/:userId/boards/:boardId", 
routeMethod.deleteOneBoard
);

// delete a list
router.delete(
  "/trello/:userId/boards/:boardId/lists/:listId",
  routeMethod.deleteOneList
);

// delete a card
router.delete(
  "/trello/:userId/boards/:boardId/lists/:listId/cards/:cardId",
  routeMethod.deleteOneCard
);

module.exports = router;
