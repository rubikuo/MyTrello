import React, { useState } from "react";
import axios from "axios";
import { MdRemove } from "react-icons/md";
import ReactDOM from "react-dom";
import "./Modals.scss";

const Remove = ({ setRemoveModal, type, list, card, lists, setLists, _board, boards, setBoards }) => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [board] = useState(JSON.parse(localStorage.getItem("board")));

  const closeModal = (e) => {
    e.stopPropagation();
    setRemoveModal(false);
  };


  const removeBoard = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("id",_board["_id"]);
    axios
      .delete(
        `/api/trello/${user["_id"]}/boards/${_board["_id"]}`
      )
      .then((res) => {
        setBoards(boards.filter((bo) => bo["_id"] !== _board["_id"]));
   
      })
      .catch((error) => {
        console.log(error);
      });
      setRemoveModal(false);
  };

  const removeList = (e) => {
    e.preventDefault();
    axios
      .delete(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/lists/${list["_id"]}`
      )
      .then((res) => {
        setLists(lists.filter((li) => li["_id"] !== list["_id"]));
      })
      .catch((error) => {
        console.log(error);
      });
      setRemoveModal(false);
  };

  const removeCard = (e) => {
    e.preventDefault();
    axios
      .delete(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/lists/${list["_id"]}/cards/${card["_id"]}`
      )
      .then((res) => {
        let copyLists = [...lists];
        let listIndex = copyLists.findIndex((li) => li["_id"] === list["_id"]);
        console.log("listIndex", listIndex);
        let cards = copyLists[listIndex].cards;
        let cardIndex = cards.findIndex((ca) => ca["_id"] === card["_id"]);
        cards.splice(cardIndex, 1);
        console.log(copyLists);
        setLists([...copyLists]);
      })
      .catch((error) => {
        console.log(error);
      });
      setRemoveModal(false);
  };

  return ReactDOM.createPortal(
    <div className="Remove">
      <div className="Remove__modal">
        <div className="Remove__modal-headline">
          <MdRemove className=" Remove__icon Remove__icon-remove" />
          <h5> {type ==="board"? "Remove board?" : type === "list" ? "Remove list" :  "Remove card?"} </h5>
        </div>
        {type === "board"? (
          <p className="Remove__text">
            Are you sure to remove{" "}
            <span className="Remove__text-sub">{board.title}</span> board?
          </p>
        ): type === "list" ? (
          <p className="Remove__text">
            Are you sure to remove{" "}
            <span className="Remove__text-sub">{list.title}</span> from{" "}
            <span className="Remove__text-sub">{board.title}</span> board?
          </p>
        ) : (
          <p className="Remove__text">
            Are you sure to remove{" "}
            <span className="Remove__text-sub">{card.title}</span> from{" "}
            <span className="Remove__text-sub">{list.title}</span> list?
          </p>
        )}
        <div className="Remove__btnCtn">
          <div onClick={(e)=>closeModal(e)} className="Remove__btn Remove__btn-cancel">
            Cancel
          </div>

          <button
            onClick={type ==="board"? removeBoard: type === "list" ? removeList : removeCard}
            className="Remove__btn Remove__btn-remove"
          >
            Remove
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Remove;
