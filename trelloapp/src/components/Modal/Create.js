import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaClipboard, FaList } from "react-icons/fa";
import ReactDOM from "react-dom";
import { autoFocus } from "../../utility";
import "./Modals.scss";

const Create = ({
  setCreateModal,
  userId,
  board,
  setBoards,
  setLists,
  option,
}) => {
  const [boardTitle, setBoardTitle] = useState("");
  const [listTitle, setListTitle] = useState("");
  const [error, setError] = useState("");
  let createInputRef = useRef(null);

  useEffect(() => {
    autoFocus(createInputRef);
  }, []);

  const onChangeInput = (e) => {
    if (e.target.value.length > 15 && option === "board") {
      setError("Board title contains max 15 characters");
    } else if (e.target.value.length > 15 && option === "list") {
      setError("List title contains max 15 characters");
    } else {
      setError("");
    }
    if (option === "board") {
      setBoardTitle(e.target.value);
    } else {
      setListTitle(e.target.value);
    }
  };

  const closeModal = () => {
    setCreateModal(false);
  };

  const createBoard = (e) => {
    e.preventDefault();

    // create a room in roomDB
    let board = {
      title: boardTitle,
    };

    axios
      .post(`/api/trello/${userId}/boards`, board)
      .then((res) => {
        console.log(res.data);
        setBoards([...res.data.boards]);
        closeModal();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createList = (e) => {
    e.preventDefault();
    // create a room in roomDB
    let list = {
      title: listTitle,
    };

    axios
      .post(`/api/trello/${userId}/boards/${board["_id"]}/lists`, list)
      .then((res) => {
        console.log(res.data);
        setLists([...res.data.lists]);
        board.lists = [...res.data.lists];
        localStorage.setItem("board", JSON.stringify(board));
        closeModal();
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return ReactDOM.createPortal(
    <div className="Create">
      <div className="Create__modal">
        <div className="Create__modal-headline">
          {option === "board" ? (
            <FaClipboard className="Create__icon Create__icon-board" />
          ) : (
            <FaList className=" Create__icon Create__icon-list" />
          )}
          {option === "board" ? (
            <h5>Create new board</h5>
          ) : (
            <h5>Create new list</h5>
          )}
        </div>

        <form
          onSubmit={option === "board" ? createBoard : createList}
          className="Create__form"
        >
          <input
            value={option === "board" ? boardTitle : listTitle}
            ref={createInputRef}
            onChange={onChangeInput}
            type="text"
            placeholder={option === "board" ? "Board Title" : "List Title"}
            className="Create__input"
          />
          {error && <span className="Create__text-error">{error}</span>}
          <div className="Create__btnCtn">
            <div
              onClick={closeModal}
              className="Create__btn Create__btn-cancel"
            >
              Cancel
            </div>

            <button type="submit" className="Create__btn Create__btn-create">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default Create;
