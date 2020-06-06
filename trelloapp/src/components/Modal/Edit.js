import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import ReactDOM from "react-dom";
import { autoFocus } from "../../utility";
import "./Modals.scss";

const Edit = ({ setEditModal, cardId, list, setLists }) => {
  const cardTitleInputRef = useRef(null);
  const [card, setCard] = useState({ title: "", desc: "" });
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [board] = useState(JSON.parse(localStorage.getItem("board")));
  const [error, setError] = useState("");

  useEffect(() => {
    autoFocus(cardTitleInputRef);
  }, []);

  const getOneCard = useCallback(() => {
    let CancelToken = axios.CancelToken;
    let source = CancelToken.source();

    axios
      .get(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/lists/${list["_id"]}/cards/${cardId}`
      )
      .then((res) => {
        console.log(res.data);
        setCard({ ...res.data });
      })
      .catch((error) => {
        console.log(error.response);
      });
    return () => source.cancel();
  }, [cardId, list, board, user]);

  //get one list
  useEffect(() => {
    getOneCard();
  }, [getOneCard]);

  const closeModal = () => {
    setEditModal(false);
  };

  const onChange = (e) => {
    if (e.target.name === "title" && e.target.value.length > 15) {
      setError("Card title contains max 15 characters");
    } else {
      setError("");
    }
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  // patch
  const editCard = (e) => {
    e.preventDefault();

    // create a room in roomDB
    let newCard = {
      title: card.title,
      desc: card.desc,
      timestamp: new Date(),
    };

    axios
      .put(
        `/api/trello/${user["_id"]}/boards/${board["_id"]}/lists/${list["_id"]}/cards/${cardId}`,
        newCard
      )
      .then((res) => {
        setLists([...res.data]);
      })
      .catch((error) => {
        console.log(error);
      });
    closeModal();
  };

  return ReactDOM.createPortal(
    <div className="Edit">
      <div className="Edit__modal">
        <div className="Edit__modal-headline">
          <MdEdit className=" Edit__icon Edit__icon-edit" />
          <h5>Edit Card</h5>
        </div>

        <form onSubmit={editCard} className="Edit__form">
          <label className="Edit__label Edit__label-title"> Title</label>
          <input
            className="Edit__input Edit__input-cardTitle"
            type="text"
            name="title"
            value={card.title}
            onChange={onChange}
            ref={cardTitleInputRef}
          />
          <label className="Edit__label Edit__label-Desc"> Description </label>

          <textarea
            className="Edit__input Edit__input-cardDesc"
            type="text"
            name="desc"
            value={card.desc}
            onChange={onChange}
          />
          {error && <span className="Edit__text-error">{error}</span>}
          <div className="Edit__btnCtn">
            <div onClick={closeModal} className="Edit__btn Edit__btn-cancel">
              Cancel
            </div>

            <button type="submit" className="Edit__btn Edit__btn-update">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default Edit;
